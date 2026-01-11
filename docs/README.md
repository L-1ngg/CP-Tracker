# CP-Tracker

> 算法竞赛数据聚合与分析平台

![Java](https://img.shields.io/badge/Java-21-blue)
![Spring%20Boot](https://img.shields.io/badge/Spring%20Boot-3.3.x-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-15.x-black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue)
![Redis](https://img.shields.io/badge/Redis-7.2-red)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## 项目简介

CP-Tracker 是一个面向算法竞赛用户的数据聚合与分析平台。系统通过爬虫同步 Codeforces/AtCoder 等平台数据，并在统一视图下提供热力图、技能雷达、统一 Rating 等分析能力，同时内置博客系统用于技术分享。

---

## 核心特性

- 多平台账号绑定与数据同步
- 热力图 / 技能雷达 / 统一 Rating 分析
- 博客系统：草稿、审核、发布、评论、点赞、标签
- 网关统一鉴权与路由
- Redis 缓存与分布式锁

---

## 技术栈

**后端**: Java 21, Spring Boot 3.3, Spring Cloud 2023, JPA, PostgreSQL, Redis, Nacos, MinIO

**前端**: Next.js 15, React 19, TypeScript, Tailwind CSS, Shadcn/ui, TanStack Query

**基础设施**: Docker Compose, Adminer

---

## 项目结构

```
CP-Tracker/
├── api-gateway/              # API 网关
├── services/
│   ├── auth-service/         # 认证服务
│   ├── crawler-service/      # 爬虫服务
│   ├── analysis-service/     # 分析服务
│   └── core-service/         # 博客与核心业务
├── frontend/                 # Next.js 前端
├── docker/                   # Docker 初始化脚本
└── docs/                     # 项目文档
```

---

## 快速开始

### 1. 环境要求

- JDK 21
- Node.js 20+
- Docker & Docker Compose

### 2. 配置环境变量

复制 `.env.example` 为 `.env`，按需填写：

```
POSTGRES_USER
POSTGRES_PASSWORD
POSTGRES_DB
REDIS_PASSWORD
MINIO_ROOT_USER
MINIO_ROOT_PASSWORD
JWT_SECRET
```

### 3. 启动基础设施

建议按依赖顺序启动，避免 Nacos 连接 MySQL 失败：

```bash
# 1) 启动 Nacos 的 MySQL
docker-compose up -d nacos-mysql

# 2) 启动数据库、缓存与对象存储
docker-compose up -d postgres redis minio

# 3) 启动 Nacos 集群与 Adminer
docker-compose up -d nacos1 nacos2 nacos3 adminer
```

### 4. 启动后端服务

```bash
# 按顺序启动
./mvnw spring-boot:run -pl api-gateway               # :8080
./mvnw spring-boot:run -pl services/auth-service     # :8081
./mvnw spring-boot:run -pl services/crawler-service  # :8082
./mvnw spring-boot:run -pl services/analysis-service # :8083
./mvnw spring-boot:run -pl services/core-service     # :8084
```

### 5. 启动前端

```bash
cd frontend
npm install
npm run dev  # :3000
```

---

## 服务端口

| 服务 | 端口 | 说明 |
|------|------|------|
| Frontend | 3000 | Next.js 开发服务器 |
| Gateway | 8080 | API 统一入口 |
| Auth Service | 8081 | 认证服务 |
| Crawler Service | 8082 | 爬虫服务 |
| Analysis Service | 8083 | 分析服务 |
| Core Service | 8084 | 核心业务 |
| PostgreSQL | 5432 | 数据库 |
| Redis | 6379 | 缓存 |
| Nacos | 8848 | 服务发现 |
| MinIO | 9000/9001 | 对象存储 |
| Adminer | 8088 | 数据库管理 |

---

## 文档索引

| 文档 | 说明 |
|------|------|
| [ARCHITECTURE.md](./ARCHITECTURE.md) | 系统架构设计、服务拆分、数据流向 |
| [DEVELOPMENT.md](./DEVELOPMENT.md) | 功能开发实现细节、技术方案 |
| [DATABASE.md](./DATABASE.md) | 数据库设计、Schema 结构、建表语句 |
| [API.md](./API.md) | API 接口文档 |
| [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) | 常见问题与解决方案 |

---

## API 文档

- Gateway 聚合文档: http://localhost:8080/swagger-ui.html
- Auth Service: http://localhost:8081/swagger-ui.html
- Crawler Service: http://localhost:8082/swagger-ui.html
- Analysis Service: http://localhost:8083/swagger-ui.html
- Core Service: http://localhost:8084/swagger-ui.html

---

## License

本项目采用 MIT License，详见 [LICENSE](../LICENSE)。

---

*最后更新: 2026-01*
