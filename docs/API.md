# API 接口文档

> CP-Tracker RESTful API 接口说明

---

## 1. 认证服务 (Auth Service)

**基础路径**: `/api/auth`

### 1.1 用户注册

```
POST /api/auth/register
```

**请求体**:
```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

**响应**:
```json
{
  "token": "string",
  "user": {
    "id": 1,
    "username": "string",
    "email": "string",
    "role": "USER"
  }
}
```

### 1.2 用户登录

```
POST /api/auth/login
```

**请求体**:
```json
{
  "username": "string",
  "password": "string"
}
```

**响应**: 同注册接口

### 1.3 获取用户信息

```
GET /api/auth/profile
Authorization: Bearer {token}
```

**响应**:
```json
{
  "id": 1,
  "username": "string",
  "email": "string",
  "avatarUrl": "string",
  "role": "USER"
}
```

### 1.4 更新用户信息

```
PUT /api/auth/profile
Authorization: Bearer {token}
```

**请求体**:
```json
{
  "username": "string",
  "email": "string"
}
```

### 1.5 修改密码

```
PUT /api/auth/password
Authorization: Bearer {token}
```

**请求体**:
```json
{
  "currentPassword": "string",
  "newPassword": "string"
}
```

### 1.6 上传头像

```
POST /api/auth/avatar
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**请求体**: `file` (MultipartFile)

**响应**:
```json
{
  "avatarUrl": "http://localhost:9000/avatars/avatar/1/uuid.jpg"
}
```

### 1.7 管理员接口

**基础路径**: `/api/auth/admin`（需要 ADMIN 权限）

#### 1.7.1 禁言用户

```
POST /api/auth/admin/mute
```

**请求体**:
```json
{
  "userId": 1,
  "days": 7,
  "reason": "string"
}
```

#### 1.7.2 解除禁言

```
POST /api/auth/admin/unmute/{userId}
```

#### 1.7.3 封禁用户

```
POST /api/auth/admin/ban
```

**请求体**:
```json
{
  "userId": 1,
  "reason": "string"
}
```

#### 1.7.4 解封用户

```
POST /api/auth/admin/unban/{userId}
```

#### 1.7.5 变更角色

```
POST /api/auth/admin/role
```

**请求体**:
```json
{
  "userId": 1,
  "role": "ADMIN"  // USER, ADMIN
}
```

---

## 2. 爬虫服务 (Crawler Service)

**基础路径**: `/api/crawler`

### 2.1 绑定平台账号

```
POST /api/crawler/handles/{userId}
Authorization: Bearer {token}
```

**请求体**:
```json
{
  "platform": "CODEFORCES",  // CODEFORCES, ATCODER, NOWCODER(暂未启用)
  "handle": "tourist"
}
```

**说明**: 绑定时会自动验证账号有效性并触发同步

**响应**:
```json
{
  "userId": 1,
  "platform": "CODEFORCES",
  "handle": "tourist",
  "lastFetched": "2025-01-01T00:00:00",
  "rating": 2000,
  "maxRating": 2100,
  "rank": "candidate master"
}
```

### 2.2 解绑平台账号

```
DELETE /api/crawler/handles/{userId}/{platform}
Authorization: Bearer {token}
```

### 2.3 获取绑定账号列表

```
GET /api/crawler/handles/{userId}
```

**响应**:
```json
[
  {
    "userId": 1,
    "platform": "CODEFORCES",
    "handle": "tourist",
    "lastFetched": "2025-01-01T00:00:00",
    "rating": 2000,
    "maxRating": 2100,
    "rank": "candidate master"
  }
]
```

### 2.4 手动同步指定用户

```
POST /api/crawler/sync/user/{userId}
```

**说明**: 触发指定用户的数据同步

### 2.5 手动同步全部用户

```
POST /api/crawler/sync
```

**说明**: 触发全量同步（通常由定时任务执行）

---

## 3. 分析服务 (Analysis Service)

**基础路径**: `/api/analysis`

### 3.1 获取热力图数据
```
GET /api/analysis/heatmap/{userId}
```

**请求参数**:
- `days`: 天数，默认 365

**响应**:
```json
[
  {
    "date": "2025-01-01",
    "count": 5,
    "platformBreakdown": {
      "CODEFORCES": 3,
      "ATCODER": 2
    }
  }
]
```

### 3.2 获取技能雷达数据
```
GET /api/analysis/skills/{userId}
```

**响应**:
```json
[
  {
    "tag": "dp",
    "rating": 85.5,
    "solvedCount": 120
  },
  {
    "tag": "graphs",
    "rating": 72.3,
    "solvedCount": 80
  }
]
```

### 3.3 获取统一 Rating

```
GET /api/analysis/rating/{userId}
```

**响应**:
```json
{
  "unifiedRating": 1850,
  "cfRating": 2000,
  "atRating": 1500,
  "nkRating": null,
  "updatedAt": "2025-01-01T00:00:00"
}
```

**说明**: 用户无 Rating 数据时返回仅包含 `userId` 的空对象。

---

## 4. 核心服务 (Core Service)

**基础路径**: `/api/core`

### 4.1 博客

#### 4.1.1 获取已发布博客列表

```
GET /api/core/blogs
```

**请求参数**:
- `page`: 页码，默认 0
- `size`: 每页大小，默认 10

#### 4.1.2 创建博客（草稿）

```
POST /api/core/blogs
X-User-Id: {userId}
```

**请求体**:
```json
{
  "title": "string",
  "summary": "string",
  "content": "string (Markdown)",
  "coverUrl": "string"
}
```

#### 4.1.3 获取当前用户博客

```
GET /api/core/blogs/my
X-User-Id: {userId}
```

#### 4.1.4 获取当前用户草稿

```
GET /api/core/blogs/my/drafts
X-User-Id: {userId}
```

#### 4.1.5 博客详情

```
GET /api/core/blogs/{id}
```

#### 4.1.6 更新博客

```
PUT /api/core/blogs/{id}
X-User-Id: {userId}
```

#### 4.1.7 删除博客

```
DELETE /api/core/blogs/{id}
X-User-Id: {userId}
```

#### 4.1.8 提交审核

```
POST /api/core/blogs/{id}/submit
```

### 4.2 审核（管理员）

#### 4.2.1 获取待审核博客

```
GET /api/core/admin/blogs/pending
```

#### 4.2.2 审核博客

```
POST /api/core/admin/blogs/review
X-User-Id: {reviewerId}
```

**请求体**:
```json
{
  "blogId": 1,
  "action": "APPROVE",  // APPROVE, REJECT
  "comment": "string"
}
```

### 4.3 评论

#### 4.3.1 获取博客评论列表

```
GET /api/core/blogs/{blogId}/comments
```

**请求参数**:
- `page`: 页码，默认 0
- `size`: 每页大小，默认 10

#### 4.3.2 获取顶级评论

```
GET /api/core/blogs/{blogId}/comments/top
```

#### 4.3.3 获取评论回复

```
GET /api/core/comments/{commentId}/replies
```

#### 4.3.4 发表评论

```
POST /api/core/blogs/{blogId}/comments
X-User-Id: {userId}
```

**请求体**:
```json
{
  "content": "string",
  "parentId": 1
}
```

#### 4.3.5 删除评论

```
DELETE /api/core/comments/{commentId}
X-User-Id: {userId}
```

### 4.4 点赞

#### 4.4.1 点赞博客

```
POST /api/core/blogs/{id}/like
X-User-Id: {userId}
```

#### 4.4.2 取消点赞

```
DELETE /api/core/blogs/{id}/like
X-User-Id: {userId}
```

#### 4.4.3 获取点赞状态

```
GET /api/core/blogs/{id}/like/status
X-User-Id: {userId} (可选)
```

**响应**:
```json
{
  "hasLiked": true,
  "likeCount": 10
}
```

### 4.5 标签

#### 4.5.1 获取所有标签

```
GET /api/core/tags
```

#### 4.5.2 创建标签（管理员）

```
POST /api/core/admin/tags
```

**请求体**:
```json
{
  "name": "string"
}
```

#### 4.5.3 删除标签（管理员）

```
DELETE /api/core/admin/tags/{id}
```

#### 4.5.4 获取博客标签

```
GET /api/core/blogs/{blogId}/tags
```

#### 4.5.5 给博客添加标签

```
POST /api/core/blogs/{blogId}/tags/{tagId}
```

#### 4.5.6 移除博客标签

```
DELETE /api/core/blogs/{blogId}/tags/{tagId}
```

#### 4.5.7 批量设置博客标签

```
PUT /api/core/blogs/{blogId}/tags
```

**请求体**:
```json
[1, 2, 3]
```

#### 4.5.8 按标签筛选博客

```
GET /api/core/blogs/by-tag/{tagId}
```

**请求参数**:
- `page`: 页码，默认 0
- `size`: 每页大小，默认 10

---

## 5. 错误响应格式

所有接口的错误响应遵循统一格式：

```json
{
  "timestamp": "2025-01-01T00:00:00",
  "status": 400,
  "error": "Bad Request",
  "message": "错误描述",
  "path": "/api/xxx"
}
```

**常见状态码**:

| 状态码 | 说明 |
|-------|------|
| 200 | 成功 |
| 400 | 请求参数错误 |
| 401 | 未认证 |
| 403 | 无权限 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

---

## 6. Swagger UI

各服务启动后可访问 Swagger UI 查看完整 API 文档：

| 服务 | Swagger UI 地址 |
|------|----------------|
| Auth Service | http://localhost:8081/swagger-ui.html |
| Crawler Service | http://localhost:8082/swagger-ui.html |
| Analysis Service | http://localhost:8083/swagger-ui.html |
| Core Service | http://localhost:8084/swagger-ui.html |

**Gateway 聚合文档**: http://localhost:8080/swagger-ui.html

---

*最后更新: 2026-01*