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
  "email": "string",
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

---

## 2. 爬虫服务 (Crawler Service)

**基础路径**: `/api/crawler`

### 2.1 绑定平台账号

```
POST /api/crawler/handles
Authorization: Bearer {token}
```

**请求体**:
```json
{
  "platform": "CODEFORCES",  // CODEFORCES, ATCODER
  "handle": "tourist"
}
```

**说明**: 绑定时会自动验证账号有效性并同步数据

### 2.2 解绑平台账号

```
DELETE /api/crawler/handles
Authorization: Bearer {token}
```

**请求参数**:
- `platform`: 平台名称 (CODEFORCES, ATCODER)

### 2.3 获取绑定账号列表

```
GET /api/crawler/handles/{userId}
```

**响应**:
```json
[
  {
    "platform": "CODEFORCES",
    "handle": "tourist",
    "lastFetched": "2025-01-01T00:00:00"
  },
  {
    "platform": "ATCODER",
    "handle": "tourist",
    "lastFetched": "2025-01-01T00:00:00"
  }
]
```

### 2.4 手动同步数据

```
POST /api/crawler/sync/{userId}
Authorization: Bearer {token}
```

**说明**: 触发指定用户的数据同步

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

---

## 4. 核心服务 (Core Service)

**基础路径**: `/api/core`

### 4.1 博客列表

```
GET /api/core/blogs
```

**请求参数**:
- `page`: 页码，默认 0
- `size`: 每页大小，默认 10
- `status`: 状态筛选 (PUBLISHED)

### 4.2 创建博客

```
POST /api/core/blogs
Authorization: Bearer {token}
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

### 4.3 博客详情

```
GET /api/core/blogs/{id}
```

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

*最后更新: 2025-01*
