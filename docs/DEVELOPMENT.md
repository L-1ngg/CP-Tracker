# CP-Tracker 开发文档

> 本文档记录项目功能开发的实现细节和技术方案

---

## 目录

1. [用户设置页面](#功能-1-用户设置页面)
2. [统一Rating加权计算](#功能-2-统一rating加权计算)
3. [多平台数据爬取](#功能-3-多平台数据爬取)
4. [博客发布与审核](#功能-4-博客发布与审核)
5. [评论、点赞与标签](#功能-5-评论点赞与标签)
6. [Redis缓存与分布式锁](#功能-6-redis缓存与分布式锁)

---

## 功能 1: 用户设置页面

### 需求描述

实现 `/u/[username]` 用户设置页面，包含：
- 用户基本信息（用户名、邮箱）编辑
- 密码修改
- 头像上传（使用MinIO存储）

### 技术方案

#### 后端实现 (auth-service)

**1. MinIO集成**

添加依赖 (`pom.xml`):
```xml
<dependency>
    <groupId>io.minio</groupId>
    <artifactId>minio</artifactId>
    <version>8.5.7</version>
</dependency>
```

配置 (`application.yml` 或 Nacos 配置):
```yaml
minio:
  endpoint: http://localhost:9000
  access-key: ${MINIO_ROOT_USER}
  secret-key: ${MINIO_ROOT_PASSWORD}
  bucket: avatars
```

**2. API端点**

| 方法 | 路径 | 功能 | 认证 |
|------|------|------|------|
| GET | `/api/auth/profile` | 获取当前用户信息 | 需要 |
| PUT | `/api/auth/profile` | 更新用户名/邮箱 | 需要 |
| PUT | `/api/auth/password` | 修改密码 | 需要 |
| POST | `/api/auth/avatar` | 上传头像 | 需要 |

**3. 新增文件**

| 文件路径 | 说明 |
|----------|------|
| `service/MinioService.java` | MinIO文件上传服务 |
| `dto/UpdateProfileRequest.java` | 更新用户信息请求DTO |
| `dto/ChangePasswordRequest.java` | 修改密码请求DTO |
| `dto/UserProfileResponse.java` | 用户信息响应DTO |

**4. 修改文件**

| 文件路径 | 修改内容 |
|----------|----------|
| `pom.xml` | 添加MinIO依赖 |
| `application.yml` | 添加MinIO配置 |
| `service/AuthService.java` | 添加用户管理方法 |
| `controller/AuthController.java` | 添加4个API端点 |

#### 前端实现

**1. 新增类型定义** (`types/auth.ts`):
```typescript
export interface UpdateProfileRequest {
  username?: string;
  email?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  avatarUrl?: string;
  role: string;
}
```

**2. API调用方法** (`lib/api/auth.ts`):
```typescript
getProfile: async (): Promise<UserProfile> => {
  const response = await apiClient.get<UserProfile>('/api/auth/profile');
  return response.data;
},

updateProfile: async (data: UpdateProfileRequest): Promise<UserProfile> => {
  const response = await apiClient.put<UserProfile>('/api/auth/profile', data);
  return response.data;
},

changePassword: async (data: ChangePasswordRequest): Promise<void> => {
  await apiClient.put('/api/auth/password', data);
},

uploadAvatar: async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await apiClient.post<{ avatarUrl: string }>(
    '/api/auth/avatar',
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
  return response.data.avatarUrl;
},
```

**3. 页面组件** (`app/(main)/u/[username]/page.tsx`):

页面结构：
```
居中Card容器 (max-w-md rounded-2xl shadow-apple-md)
├── 头像区域（可点击上传，hover显示相机图标）
├── 用户信息表单
│   ├── 用户名输入框
│   └── 邮箱输入框
├── 保存按钮
└── 修改密码区域
    ├── 当前密码（带显示/隐藏切换）
    ├── 新密码（带显示/隐藏切换）
    ├── 确认密码
    └── 修改密码按钮
```

### 使用说明

1. 确保MinIO服务已启动：
   ```bash
   docker-compose up -d minio
   ```

2. 在 Nacos 或本地配置中设置 `minio.access-key` / `minio.secret-key`

3. 重启 auth-service

4. 访问用户设置页面：`http://localhost:3000/u/{username}`

---

## 功能 2: 统一Rating加权计算

### 需求描述

将统一Rating的计算方式从"取最大值"改为"加权平均"。

### 计算规则

| 平台 | 权重 |
|------|------|
| Codeforces | 70% |
| AtCoder | 30% |
| NowCoder | 暂时禁用 |

### 边界情况处理

- **只有一个平台**：直接使用该平台的rating
- **两个平台都有**：`统一Rating = CF × 0.7 + AT × 0.3`
- **rating为null**：视为该平台未绑定，不参与计算

### 实现代码

**文件**: `crawler-service/.../service/AnalyticsService.java`

```java
/**
 * 计算加权平均 Rating
 * CF 权重 70%，AT 权重 30%
 */
private Integer calculateWeightedRating(Integer cfRating, Integer atRating) {
    boolean hasCf = cfRating != null && cfRating > 0;
    boolean hasAt = atRating != null && atRating > 0;

    if (hasCf && hasAt) {
        // 两个平台都有：加权平均
        return (int) (cfRating * CrawlerConstants.CF_RATING_WEIGHT
                + atRating * CrawlerConstants.AT_RATING_WEIGHT);
    } else if (hasCf) {
        return cfRating;
    } else if (hasAt) {
        return atRating;
    }
    return 0;
}
```

---

## 功能 3: 多平台数据爬取

### 支持平台

| 平台 | 状态 | 热力图 | 技能雷达 |
|------|------|--------|----------|
| Codeforces | ✅ 支持 | ✅ | ✅ |
| AtCoder | ✅ 支持 | ✅ | ❌ (无tags) |
| NowCoder | ⏸️ 暂停 | - | - |

### AtCoder 实现

**API来源**: AtCoder Problems (kenkoooo)
- 提交记录: `https://kenkoooo.com/atcoder/atcoder-api/v3/user/submissions?user={handle}`
- Rating历史: `https://atcoder.jp/users/{handle}/history/json`

**文件**: `crawler-service/.../fetcher/AtCoderFetcher.java`

### NowCoder 暂停原因

牛客网有反爬取机制，API返回HTML而非JSON：
```
Could not extract response: no suitable HttpMessageConverter found
for response type [class NowCoderUserResponse] and content type [text/html;charset=UTF-8]
```

**临时处理**: 在前端 `BindAccountDialog.tsx` 中暂时隐藏 NowCoder 选项，保留后端代码待后续解决。

### 定时同步与锁机制

爬虫使用 Spring Schedule 定时任务，并通过 Redis 分布式锁避免多实例重复执行：

```java
// CrawlerScheduler.java - 关键逻辑
Boolean acquired = redisTemplate.opsForValue()
        .setIfAbsent(SYNC_LOCK_KEY, lockValue, LOCK_TIMEOUT);
if (Boolean.TRUE.equals(acquired)) {
    crawlerService.syncAllUsers();
}
```

### 热力图数据合并

多平台提交数据合并到同一热力图：

```java
// AnalyticsService.java - updateDailyActivity()
Map<String, Integer> breakdown = activity.getPlatformBreakdown();
breakdown.put(platform, count);  // 按平台存储
activity.setCount(breakdown.values().stream()
    .mapToInt(Integer::intValue).sum());  // 总数
```

---

## 功能 4: 博客发布与审核

### 需求描述

实现博客的草稿编辑、提交审核与管理员发布/驳回流程。

### 状态流转

| 状态 | 说明 | 触发 |
|------|------|------|
| DRAFT | 草稿 | 创建/编辑 |
| PENDING | 待审核 | 提交审核 |
| PUBLISHED | 已发布 | 管理员通过 |
| REJECTED | 已拒绝 | 管理员驳回 |

### 后端实现 (core-service)

**1. 核心接口**

| 方法 | 路径 | 功能 |
|------|------|------|
| POST | `/api/core/blogs` | 创建草稿 |
| POST | `/api/core/blogs/{id}/submit` | 提交审核 |
| GET | `/api/core/admin/blogs/pending` | 待审列表 |
| POST | `/api/core/admin/blogs/review` | 审核博客 |

**2. 审核逻辑**

```java
// BlogReviewService.java
if (ReviewAction.APPROVE == request.getAction()) {
    blog.setStatus(BlogStatus.PUBLISHED);
    blog.setPublishedAt(LocalDateTime.now());
} else if (ReviewAction.REJECT == request.getAction()) {
    blog.setStatus(BlogStatus.REJECTED);
}
```

**3. 权限点**
- 编辑/删除仅允许作者本人
- 管理员审核通过 `X-User-Id` 记录 reviewer

---

## 功能 5: 评论、点赞与标签

### 评论体系

- 评论支持 `parentId` 实现楼中楼回复
- 提供顶级评论与回复列表接口

```java
// CreateCommentRequest.java
private String content;
private Long parentId;
```

### 点赞体系

- `blog_likes` 使用 `(blog_id, user_id)` 唯一约束
- 点赞/取消点赞会同步更新 `blogs.like_count`

```java
// BlogLikeService.java
if (blogLikeRepository.existsByBlogIdAndUserId(blogId, userId)) {
    throw new RuntimeException("已经点赞过了");
}
```

### 标签体系

- 标签表 `blog_tags` 与关系表 `blog_tag_relations`
- 支持按标签筛选博客与批量设置标签

---

## 功能 6: Redis缓存与分布式锁

### 分析服务缓存

Analysis Service 使用 `@Cacheable` + Redis 缓存热点数据，避免重复查询。

```java
@Cacheable(cacheNames = "analysis:rating", key = "#userId", unless = "#result == null")
public UserRating getUserRating(Long userId) {
    return userRatingRepository.findById(userId).orElse(null);
}
```

缓存序列化使用 `GenericJackson2JsonRedisSerializer` 并开启类型信息，避免反序列化成 `LinkedHashMap`：

```java
RedisSerializer<Object> serializer = new GenericJackson2JsonRedisSerializer(cacheObjectMapper);
```

### 分布式锁

Crawler Service 在定时任务中使用 Redis 分布式锁，避免多实例重复同步。

---

*最后更新: 2026-01*