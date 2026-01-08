# CP-Tracker 文档索引

> 算法竞赛数据聚合与分析平台

---

## 文档目录

| 文档 | 说明 |
|------|------|
| [ARCHITECTURE.md](./ARCHITECTURE.md) | 系统架构设计、服务拆分、数据流向 |
| [DEVELOPMENT.md](./DEVELOPMENT.md) | 功能开发实现细节、技术方案 |
| [DATABASE.md](./DATABASE.md) | 数据库设计、Schema 结构、建表语句 |
| [API.md](./API.md) | API 接口文档 |
| [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) | 常见问题与解决方案 |

---

## 快速开始

### 1. 启动基础设施

```bash
docker-compose up -d
```

### 2. 启动后端服务

```bash
# 按顺序启动
./mvnw spring-boot:run -pl api-gateway          # :8080
./mvnw spring-boot:run -pl services/auth-service     # :8081
./mvnw spring-boot:run -pl services/crawler-service  # :8082
./mvnw spring-boot:run -pl services/analysis-service # :8083
./mvnw spring-boot:run -pl services/core-service     # :8084
```

### 3. 启动前端

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

*最后更新: 2025-01*
