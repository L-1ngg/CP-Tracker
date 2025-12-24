# CP-Tracker 项目指南

> 算法竞赛数据聚合与分析平台 - 微服务架构

## 项目概述

CP-Tracker 是一个聚合 Codeforces、AtCoder、NowCoder 等平台数据的竞赛分析系统。

**技术栈**：
- 后端：Java 21 + Spring Boot 3.3.x + Spring Cloud 2023.0.x
- 前端：Next.js 15 + React 19 + TypeScript
- 数据库：PostgreSQL 16 + Redis 7.2
- 基础设施：Docker + Nacos 2.3 + MinIO

---

## 构建命令

### 基础设施启动

```bash
# 启动所有基础设施（PostgreSQL, Redis, Nacos, MinIO）
docker-compose up -d

# 仅启动数据库
docker-compose up -d postgres redis

# 查看服务状态
docker-compose ps

# 停止所有服务
docker-compose down
```

### 后端构建

```bash
# 根目录执行 - 构建所有模块
./mvnw clean package -DskipTests

# 构建并运行测试
./mvnw clean package

# 构建单个服务（示例：auth-service）
./mvnw clean package -pl services/auth-service -am

# 本地运行单个服务
./mvnw spring-boot:run -pl services/auth-service
```

### 各服务启动顺序

```bash
# 1. 启动 API Gateway（端口 8080）
./mvnw spring-boot:run -pl api-gateway

# 2. 启动 Auth Service（端口 8081）
./mvnw spring-boot:run -pl services/auth-service

# 3. 启动 Core Service（端口 8084）
./mvnw spring-boot:run -pl services/core-service

# 4. 启动 Crawler Service（端口 8082）
./mvnw spring-boot:run -pl services/crawler-service

# 5. 启动 Analysis Service（端口 8083）
./mvnw spring-boot:run -pl services/analysis-service
```

### 前端构建

```bash
cd frontend

# 安装依赖
npm install

# 开发模式
npm run dev

# 生产构建
npm run build

# 启动生产服务
npm run start

# 代码检查
npm run lint
```

---

## 测试命令

### 后端测试

```bash
# 运行所有测试
./mvnw test

# 运行单个服务的测试
./mvnw test -pl services/auth-service

# 运行指定测试类
./mvnw test -Dtest=UserServiceTest

# 运行集成测试
./mvnw verify -P integration-test

# 生成测试覆盖率报告
./mvnw jacoco:report
```

### 前端测试

```bash
cd frontend

# 运行单元测试
npm run test

# 监听模式
npm run test:watch

# 生成覆盖率报告
npm run test:coverage

# E2E 测试（Playwright）
npm run test:e2e
```

---

## 代码风格指南

### Java 代码规范

**基本原则**：遵循阿里巴巴 Java 开发手册

**命名规范**：
- 类名：`UpperCamelCase`（如 `UserService`）
- 方法/变量：`lowerCamelCase`（如 `getUserById`）
- 常量：`UPPER_SNAKE_CASE`（如 `MAX_RETRY_COUNT`）
- 包名：全小写（如 `com.cptracker.auth`）

**代码结构**：

```java
@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * 根据ID查询用户
     *
     * @param id 用户ID
     * @return 用户信息
     * @throws ResourceNotFoundException 用户不存在时抛出
     */
    public UserDTO getUserById(Long id) {
        return userRepository.findById(id)
            .map(this::toDTO)
            .orElseThrow(() -> new ResourceNotFoundException("用户不存在"));
    }
}
```

**日志规范**：
- `DEBUG`：详细调试信息
- `INFO`：关键业务节点（如用户登录、选课成功）
- `WARN`：可恢复的异常
- `ERROR`：系统错误，需要关注

```java
log.info("用户登录成功, userId={}", user.getId());
log.error("调用 CF API 失败, handle={}", handle, e);
```

### TypeScript/React 代码规范

**命名规范**：
- 组件：`PascalCase`（如 `SkillRadar.tsx`）
- hooks：`camelCase` + use 前缀（如 `useContests.ts`）
- 工具函数：`camelCase`（如 `formatDate.ts`）
- 类型/接口：`PascalCase` + 后缀（如 `UserDTO`, `ContestResponse`）

**组件结构**：

```tsx
'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

interface Props {
  userId: string;
}

export function UserProfile({ userId }: Props) {
  const { data, isLoading } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });

  if (isLoading) return <Skeleton />;

  return (
    <Card>
      <CardHeader>{data?.name}</CardHeader>
    </Card>
  );
}
```

### 数据库命名规范

- 表名：小写下划线（如 `user_handles`, `daily_activity`）
- 列名：小写下划线（如 `user_id`, `created_at`）
- 索引：`idx_表名_列名`（如 `idx_submissions_user_id`）
- 外键：`fk_表名_引用表`（如 `fk_submissions_problem`）

---

## 项目结构

```
CP-Tracker/
├── api-gateway/                 # API 网关
├── services/
│   ├── auth-service/            # 认证服务
│   ├── core-service/            # 核心业务
│   ├── crawler-service/         # 爬虫服务
│   └── analysis-service/        # 分析服务
├── frontend/                    # Next.js 前端
├── docker/                      # Docker 配置
└── docs/                        # 文档
```

### 服务端口

| 服务 | 端口 |
|-----|------|
| Gateway | 8080 |
| Auth Service | 8081 |
| Crawler Service | 8082 |
| Analysis Service | 8083 |
| Core Service | 8084 |
| Nacos | 8848 |
| PostgreSQL | 5432 |
| Redis | 6379 |
| MinIO | 9000 |

---

## 注意事项

1. **爬虫限流**：Codeforces API 限制 5次/秒，必须实现令牌桶限流
2. **敏感信息**：禁止将密码、Token 等写入日志或提交到 Git
3. **数据库事务**：涉及多表操作必须使用 `@Transactional`
4. **测试覆盖**：核心业务逻辑测试覆盖率 ≥ 80%
5. **单文件行数**：单个文件不超过 500 行，超过则拆分
