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

*最后更新: 2025-01*
