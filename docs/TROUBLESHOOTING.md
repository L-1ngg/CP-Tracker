# 常见问题与解决方案

> 开发过程中遇到的问题及解决方法

---

## 问题 1: PostgreSQL 保留字 `date` 导致查询错误

### 现象
调用 `/api/analysis/heatmap/{userId}` 返回 500 Internal Server Error

### 原因
`DailyActivity` 实体中的 `date` 字段是 PostgreSQL 保留字，JPA 生成的 SQL 未正确转义

### 解决方法
在实体类中使用双引号转义列名：

```java
// DailyActivity.java
@Id
@Column(name = "\"date\"")  // 使用双引号转义
private LocalDate date;
```

---

## 问题 2: `globally_quoted_identifiers` 与 JSONB 类型冲突

### 现象
启动服务时报错：
```
Schema-validation: wrong column type encountered in column [platform_breakdown];
found [jsonb (Types#OTHER)], but expecting ["jsonb" (Types#VARCHAR)]
```

### 原因
在 `application.yml` 中启用 `globally_quoted_identifiers: true` 后，`columnDefinition = "jsonb"` 中的 `jsonb` 也被引号包裹，变成了字符串类型

### 解决方法
移除 `globally_quoted_identifiers` 配置，改用手动转义方式：

```yaml
# application.yml - 正确配置
spring:
  jpa:
    properties:
      hibernate:
        format_sql: true
        # 不要使用: globally_quoted_identifiers: true
```

---

## 问题 3: `@RequestParam` 参数名反射问题

### 现象
调用 API 时报错：
```
Name for argument of type [int] not specified, and parameter name information
not available via reflection. Ensure that the compiler uses the '-parameters' flag.
```

### 原因
编译器未使用 `-parameters` 标志，Spring 无法通过反射获取方法参数名

### 解决方法
在 `@RequestParam` 注解中明确指定参数名：

```java
// 修改前
@RequestParam(defaultValue = "365") int days

// 修改后
@RequestParam(value = "days", defaultValue = "365") int days
```

---

## 问题 4: CORS 头重复导致跨域请求失败

### 现象
前端调用 API 时浏览器报错：
```
Access to XMLHttpRequest at 'http://localhost:8080/api/auth/login' from origin
'http://localhost:3000' has been blocked by CORS policy: The 'Access-Control-Allow-Origin'
header contains multiple values 'http://localhost:3000, http://localhost:3000',
but only one is allowed.
```

API 测试工具（如 Swagger、curl）返回 200，但浏览器请求失败。

### 原因
Gateway 和微服务（如 auth-service）都配置了 CORS，导致响应头中 `Access-Control-Allow-Origin` 被设置两次。

请求链路：
```
浏览器 → Gateway (添加CORS头) → auth-service (再次添加CORS头) → 响应
```

### 解决方法
**只在 Gateway 层配置 CORS**，移除各微服务的 CORS 配置。

Gateway CORS 配置 (`api-gateway/.../config/CorsConfig.java`)：
```java
@Configuration
public class CorsConfig {
    @Bean
    public CorsWebFilter corsWebFilter() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOriginPatterns(Arrays.asList("*"));
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(Arrays.asList("*"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return new CorsWebFilter(source);
    }
}
```

微服务 SecurityConfig 中**不要**配置 CORS：
```java
// 错误示例 - 不要这样做
http.cors(cors -> cors.configurationSource(corsConfigurationSource()))

// 正确示例 - 只配置安全规则，不配置CORS
http.csrf(csrf -> csrf.disable())
    .authorizeHttpRequests(auth -> auth.requestMatchers("/api/**").permitAll())
```

---

## 问题 5: 热力图只显示近100次提交而非365天数据

### 现象
Dashboard 页面的提交热力图只显示最近100次提交的数据，而不是完整的365天日历视图。

### 原因
1. **后端爬虫限制**：`CodeforcesFetcher` 调用 Codeforces API 时使用了 `&count=100` 参数
2. **前端数据处理**：`ActivityHeatmap` 组件直接使用后端返回的数据，没有填充缺失的日期

### 解决方法

#### 1. 修改 CodeforcesFetcher - 获取365天内所有提交

移除 `count=100` 限制，改为获取所有提交后过滤365天内的数据。

#### 2. 修改 ActivityHeatmap 组件 - 填充365天连续日期

```tsx
function fillDateRange(data: DailyActivity[], days = 365): DailyActivity[] {
  const dataMap = new Map(data.map((item) => [item.date, item.count]));
  const result: DailyActivity[] = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    result.push({
      date: dateStr,
      count: dataMap.get(dateStr) || 0,
    });
  }

  return result;
}
```

---

## 问题 6: NowCoder 爬虫返回 HTML 而非 JSON

### 现象
调用牛客网 API 时报错：
```
Could not extract response: no suitable HttpMessageConverter found
for response type [class NowCoderUserResponse] and content type [text/html;charset=UTF-8]
```

### 原因
牛客网有反爬取机制，返回 HTML 登录页面而非 JSON 数据

### 临时解决方法
在前端 `BindAccountDialog.tsx` 中暂时隐藏 NowCoder 选项，保留后端代码待后续解决。

---

## 问题 7: 切换账号后 Dashboard 显示旧用户数据

### 现象
当用户从账号 A 退出登录后，再登录账号 B，Dashboard 页面仍然显示账号 A 的数据（绑定的平台账号、Rating 等信息）。

### 原因

**1. 登录接口未返回完整用户信息**

后端 `AuthResponse` 只返回了 `token`、`username`、`role`，缺少 `id` 和 `email`。前端登录时使用硬编码的假数据：

```typescript
// 修复前
setAuth(response.token, {
  id: 0,           // 硬编码为 0
  username: response.username,
  email: '',       // 空字符串
  role: response.role,
});
```

**2. React Query 缓存未在登出时清除**

Dashboard 使用 `userId` 作为 Query Key，但由于 `userId` 始终相同（0 或 1），切换账号后 React Query 返回缓存数据而非重新请求。

### 解决方法

**1. 后端返回完整用户信息**

```java
// AuthResponse.java
public class AuthResponse {
    private String token;
    private Long id;        // 新增
    private String username;
    private String email;   // 新增
    private String role;
}

// AuthService.java
return AuthResponse.builder()
        .token(token)
        .id(user.getId())
        .username(user.getUsername())
        .email(user.getEmail())
        .role(user.getRole().name())
        .build();
```

**2. 前端使用真实用户数据**

```typescript
// login/page.tsx
setAuth(response.token, {
  id: response.id,
  username: response.username,
  email: response.email,
  role: response.role,
});
```

**3. 登出时清除 React Query 缓存**

```typescript
// QueryProvider.tsx - 导出全局 queryClient
export const queryClient = new QueryClient({ ... });

// authStore.ts
import { queryClient } from '@/providers/QueryProvider';

logout: () => {
  queryClient.clear();  // 清除所有缓存
  set({ token: null, user: null, isAuthenticated: false });
},
```

### 修改文件
- `services/auth-service/.../dto/AuthResponse.java`
- `services/auth-service/.../service/AuthService.java`
- `frontend/src/types/auth.ts`
- `frontend/src/app/(auth)/login/page.tsx`
- `frontend/src/app/(auth)/register/page.tsx`
- `frontend/src/providers/QueryProvider.tsx`
- `frontend/src/stores/authStore.ts`

---

## 问题 8: Redis 认证失败 (WRONGPASS)

### 现象
服务报错：
```
RedisCommandExecutionException: WRONGPASS invalid username-password pair or user is disabled.
```

### 原因
Redis 使用 `--requirepass` 启用了密码，但服务端配置的 `REDIS_PASSWORD` 与实际密码不一致，或额外配置了用户名导致认证失败。

### 解决方法

1. 确保 `.env` 与 `docker-compose.yml` 中的 `REDIS_PASSWORD` 一致
2. 重启 Redis 容器使密码生效
3. 如果未使用 ACL 用户名，Spring 侧不要设置 `spring.data.redis.username`

```yaml
spring:
  data:
    redis:
      host: localhost
      port: 6379
      password: ${REDIS_PASSWORD}
```

---

## 问题 9: Redis 缓存反序列化成 LinkedHashMap

### 现象
```
ClassCastException: class java.util.LinkedHashMap cannot be cast to class com.cptracker.analysis.entity.UserRating
```

### 原因
默认序列化没有写入类型信息，反序列化为 `LinkedHashMap`。

### 解决方法

使用 `GenericJackson2JsonRedisSerializer` 并开启类型信息，同时清理旧缓存：

```java
ObjectMapper cacheObjectMapper = objectMapper.copy();
cacheObjectMapper.activateDefaultTyping(
        ptv,
        ObjectMapper.DefaultTyping.NON_FINAL,
        JsonTypeInfo.As.PROPERTY);
RedisSerializer<Object> serializer = new GenericJackson2JsonRedisSerializer(cacheObjectMapper);
```

清理旧数据：
```
redis-cli -a ${REDIS_PASSWORD} FLUSHDB
```

---

## 问题 10: SpEL `isEmpty()` 找不到方法

### 现象
```
SpelEvaluationException: Method call: Method isEmpty() cannot be found on type com.xxx.UserRating
```

### 原因
`@Cacheable` 的 `unless` 表达式对实体对象调用 `isEmpty()`，但实体类没有该方法。

### 解决方法

对实体使用 `#result == null` 判断；对集合使用 `#result == null || #result.isEmpty()`：

```java
@Cacheable(cacheNames = "analysis:rating", key = "#userId", unless = "#result == null")
public UserRating getUserRating(Long userId) {
    return userRatingRepository.findById(userId).orElse(null);
}
```

---

## 问题 11: Multiple '@FilterDef' annotations define a filter named 'userFilter'

### 现象
服务启动时报错：
```
AnnotationException: Multiple '@FilterDef' annotations define a filter named 'userFilter'
```

### 原因
同一个持久化单元中重复定义了 `@FilterDef(name = "userFilter")`（常见于多包扫描或复用实体）。

### 解决方法

- 保证每个 `EntityManagerFactory` 里只定义一次 `@FilterDef`
- 如需共存，改用不同的 filter 名称
- 使用 `@EntityScan` 限定扫描范围，避免把其他服务的 entity 扫进来

---

*最后更新: 2026-01*