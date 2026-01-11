# 系统架构设计

> CP-Tracker 系统架构与技术选型

---

## 1. 项目定位

CP-Tracker 是一个**算法竞赛数据聚合与分析平台**。系统不负责判题，而是作为"连接器"，抓取 Codeforces (CF)、AtCoder (AT) 等主流平台的用户提交记录，经过清洗后为用户提供数据分析服务与技术社区能力。NowCoder 接入因反爬限制暂时停用，接口预留。

### 核心功能

| 功能模块 | 描述 |
|---------|------|
| **统一竞赛日历** | 当前前端为 mock/占位，后端接口预留 |
| **全网能力画像** | 基于用户在多个平台的表现，生成统一的能力雷达图和积分曲线 |
| **可视化训练分析** | 每日提交热力图、标签专项分析、补题进度追踪 |
| **极客博客** | 支持 Markdown/LaTeX 的技术分享社区 |

---

## 2. 系统架构

架构重点为 **I/O 密集型（爬虫）** 和 **数据分析密集型**。

### 2.1 服务拆分

| 服务名称 | 端口 | 核心职责 | 技术关键点 |
|---------|------|---------|-----------|
| **Gateway** | 8080 | 流量入口、鉴权、限流 | Spring Cloud Gateway, JWT 解析 |
| **Auth Service** | 8081 | 用户注册、登录、资料维护、后台管理 | Spring Security, JWT |
| **Crawler Service** | 8082 | 平台账号绑定、数据抓取、清洗入库 | Spring Schedule, Redis 分布式锁, Jsoup |
| **Analysis Service** | 8083 | 数据聚合查询、图表数据输出 | Redis 缓存, 只读查询 |
| **Core Service** | 8084 | 博客系统（草稿/审核/评论/点赞/标签） | CRUD, 状态流转 |
| **Nacos** | 8848 | 配置中心、服务注册与发现 | 动态调整爬虫频率、代理 IP 池配置 |

### 2.2 架构图

```
┌─────────────────┐
│   Frontend      │ :3000
│   (Next.js)     │
└────────┬────────┘
         │
┌────────▼────────┐
│   API Gateway   │ :8080 - 统一入口、路由、CORS
└────────┬────────┘
         │
   ┌─────┼─────┬─────────┬────────────┐
   │     │     │         │            │
┌──▼──┐ ┌▼────┐ ┌▼────┐ ┌───▼────┐ ┌──────▼──────┐
│Auth │ │Core │ │Craw │ │Analysis│ │Infrastructure│
│:8081│ │:8084│ │:8082│ │ :8083  │ │PostgreSQL    │
└─────┘ └─────┘ └─────┘ └────────┘ │Redis, MinIO  │
                                   │Nacos         │
                                   └──────────────┘
```

### 2.3 数据流向

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              数据采集流程                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────┐    定时抓取    ┌──────────────┐    写入    ┌───────────┐ │
│  │  Codeforces  │ ─────────────► │              │ ─────────► │           │ │
│  │  AtCoder     │                │   Crawler    │            │ PostgreSQL│ │
│  │  (预留)      │                │   Service    │            │ (原始数据) │ │
│  └──────────────┘                └──────────────┘            └───────────┘ │
│                                         │                                   │
│                                         │ 触发分析                          │
│                                         ▼                                   │
│  ┌──────────────┐    读取缓存    ┌──────────────┐    更新    ┌───────────┐ │
│  │   Frontend   │ ◄───────────── │   Analysis   │ ─────────► │ PostgreSQL│ │
│  │   (Next.js)  │                │   Service    │            │ (分析结果) │ │
│  └──────────────┘                └──────────────┘            └───────────┘ │
│         │                               │                                   │
│         │                               │ 缓存                              │
│         │                               ▼                                   │
│         │                        ┌──────────────┐                          │
│         └───────────────────────►│    Redis     │                          │
│              请求 Gateway         │   (缓存)     │                          │
│                                  └──────────────┘                          │
└─────────────────────────────────────────────────────────────────────────────┘
```

博客与评论/标签数据由 Core Service 直接写入 `public` schema，与爬虫/分析数据分离。

---

## 3. 技术栈

### 3.1 后端

| 组件 | 版本 | 说明 |
|-----|------|------|
| Java | 21 (LTS) | 2023.09 发布，长期支持至 2031 |
| Spring Boot | 3.3.x | 兼容 Java 21，Spring Cloud 2023.x |
| Spring Cloud | 2023.0.x | 与 Spring Boot 3.3 兼容 |
| Spring Cloud Alibaba | 2023.0.x | 与 Spring Cloud 2023.0 兼容 |
| Nacos | 2.3.x | 服务发现 + 配置中心 |
| PostgreSQL | 16 | 2023.09 发布，性能提升显著 |
| Redis | 7.2 | 2023.08 发布，Stream 功能完善 |
| MinIO | RELEASE.2024-xx | 对象存储 |
| Jsoup | 1.17.x | HTML 解析 |

### 3.2 前端

| 组件 | 版本 | 说明 |
|-----|------|------|
| Node.js | 20 (LTS) | 2023.10 进入 LTS，支持至 2026 |
| Next.js | 15.x | 2024.10 发布，App Router 稳定 |
| React | 19.x | 与 Next.js 15 兼容 |
| TypeScript | 5.x | 类型安全 |
| Tailwind CSS | 4.x | 原子化 CSS |
| Shadcn/ui | latest | 基于 Radix UI，按需安装 |
| Recharts | 2.x | React 图表库 |
| TanStack Query | 5.x | 数据请求管理 |
| Zustand | 5.x | 轻量状态管理 |

### 3.3 版本兼容性矩阵

```
Spring Boot 3.3.x
    ├── Spring Cloud 2023.0.x
    │       └── Spring Cloud Alibaba 2023.0.x
    │               └── Nacos Client 2.3.x
    ├── Java 21 (LTS)
    └── Spring Data JPA (Hibernate 6.x)

Next.js 15.x
    ├── React 19.x
    ├── Node.js 20 (LTS)
    └── Tailwind CSS 4.x
```

---

## 4. 目录结构

```
CP-Tracker/
├── api-gateway/              # API 网关服务
├── services/
│   ├── auth-service/         # 认证服务
│   ├── crawler-service/      # 爬虫服务
│   ├── analysis-service/     # 分析服务
│   └── core-service/         # 核心业务服务
├── frontend/                 # Next.js 前端
├── docker/                   # Docker 配置
│   └── init-db/              # 数据库初始化 SQL
└── docs/                     # 文档
```

---

## 5. 核心模块设计

### 5.1 爬虫服务 (Crawler Service)

采用 **策略模式 (Strategy Pattern)** 设计，统一 Fetcher 接口。

```java
public interface PlatformFetcher {
    List<ContestDTO> fetchContests();
    List<SubmissionDTO> fetchUserSubmissions(String handle);
    ProblemDTO fetchProblem(String problemId);
}
```

**平台实现策略**

| 平台 | 数据获取方式 | 注意事项 |
|-----|-------------|---------|
| **Codeforces** | 官方 REST API | API 限制 5次/秒，需实现令牌桶限流 |
| **AtCoder** | kenkoooo API + HTML 解析 | 使用第三方 API |
| **NowCoder** | Jsoup 解析 HTML | 反爬限制，暂时停用 |

**定时任务**
- 每天凌晨 2 点同步全量用户
- 使用 Redis 分布式锁 + 本地 AtomicBoolean 防止多实例重复执行

### 5.2 分析服务 (Analysis Service)

负责将原始的"提交记录"转化为"可视化指标"，并提供 Redis 缓存。

**统一能力评分计算**

```
统一Rating = CF × 0.7 + AT × 0.3
```

- 只有 CF：直接使用 CF Rating
- 只有 AT：直接使用 AT Rating
- 两者都有：加权平均

### 5.3 核心服务 (Core Service)

围绕博客系统实现内容社区能力。

- 状态流转：`DRAFT -> PENDING -> PUBLISHED/REJECTED`
- 交互能力：评论、点赞、标签绑定
- 审核记录：管理员操作写入 `blog_reviews`

### 5.4 文件存储 (MinIO)

**存储路径规范**: `avatar/{userId}/{uuid}.{ext}`

**上传流程**:
1. 前端发送 MultipartFile 到 AuthController
2. MinioService 上传到 MinIO
3. 返回公开访问 URL
4. 更新数据库用户头像字段

---

## 6. 参考资源

- [Codeforces API 文档](https://codeforces.com/apiHelp)
- [AtCoder Problems API](https://github.com/kenkoooo/AtCoderProblems)
- [Recharts 官方文档](https://recharts.org/)
- [Shadcn/ui 组件库](https://ui.shadcn.com/)

---

*最后更新: 2026-01*