# 数据库设计

> CP-Tracker 数据库 Schema 与表结构

---

## 1. Schema 划分

采用 PostgreSQL Schema 隔离业务：

| Schema | 用途 |
|--------|------|
| `public` | 用户、博客等核心业务表 |
| `crawler` | 爬虫原始数据（账号绑定、提交记录） |
| `analytics` | 分析结果（热力图、技能雷达、Rating） |

---

## 2. Schema: public

### 2.1 用户表 (users)

```sql
CREATE TABLE public.users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(500),
    role VARCHAR(20) DEFAULT 'USER',       -- USER, ADMIN
    status VARCHAR(20) DEFAULT 'ACTIVE',   -- ACTIVE, MUTED, BANNED
    mute_until TIMESTAMP,
    ban_reason VARCHAR(500),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_username ON public.users(username);
CREATE INDEX idx_users_email ON public.users(email);
```

### 2.2 博客表 (blogs)

```sql
CREATE TABLE public.blogs (
    id BIGSERIAL PRIMARY KEY,
    author_id BIGINT REFERENCES public.users(id),
    title VARCHAR(255) NOT NULL,
    summary VARCHAR(500),
    content TEXT NOT NULL,
    cover_url VARCHAR(500),
    status VARCHAR(20) DEFAULT 'DRAFT',    -- DRAFT, PENDING, PUBLISHED, REJECTED
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    published_at TIMESTAMP
);

CREATE INDEX idx_blogs_author ON public.blogs(author_id);
CREATE INDEX idx_blogs_status ON public.blogs(status);
```

---

## 3. Schema: crawler

### 3.1 外部账号映射表 (user_handles)

```sql
CREATE TABLE crawler.user_handles (
    user_id BIGINT REFERENCES public.users(id),
    platform VARCHAR(20),                  -- CODEFORCES, ATCODER, NOWCODER
    handle VARCHAR(100),                   -- 用户的平台 ID
    last_fetched TIMESTAMP,                -- 上次爬取时间
    PRIMARY KEY (user_id, platform)
);

CREATE INDEX idx_handles_platform ON crawler.user_handles(platform);
```

### 3.2 题目表 (problems)

```sql
CREATE TABLE crawler.problems (
    id BIGSERIAL PRIMARY KEY,
    platform VARCHAR(20) NOT NULL,
    remote_id VARCHAR(50) NOT NULL,        -- 平台原始ID，如 '118A'
    title VARCHAR(255),
    url VARCHAR(500),
    difficulty INTEGER,                    -- 转换后的难度分
    tags TEXT,                             -- 标签数组
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(platform, remote_id)
);

CREATE INDEX idx_problems_platform ON crawler.problems(platform);
```

### 3.3 提交记录表 (submissions) - 分区表

```sql
CREATE TABLE crawler.submissions (
    id BIGSERIAL,
    user_id BIGINT NOT NULL,
    platform VARCHAR(20) NOT NULL,
    problem_id BIGINT REFERENCES crawler.problems(id),
    remote_id VARCHAR(100),
    verdict VARCHAR(50),                   -- AC, WA, TLE 等
    language VARCHAR(50),
    submission_time TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (id, submission_time)
) PARTITION BY RANGE (submission_time);

-- 按年分区
CREATE TABLE crawler.submissions_2024 PARTITION OF crawler.submissions
    FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');

CREATE TABLE crawler.submissions_2025 PARTITION OF crawler.submissions
    FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');

CREATE INDEX idx_submissions_user ON crawler.submissions(user_id);
CREATE INDEX idx_submissions_time ON crawler.submissions(submission_time);
```

---

## 4. Schema: analytics

### 4.1 每日活动表 (daily_activity)

用于生成 GitHub 风格的热力图。

```sql
CREATE TABLE analytics.daily_activity (
    user_id BIGINT,
    "date" DATE,                           -- 注意：date 是保留字，需转义
    count INTEGER,
    platform_breakdown JSONB,              -- {"CODEFORCES": 5, "ATCODER": 2}
    PRIMARY KEY (user_id, "date")
);

CREATE INDEX idx_activity_user ON analytics.daily_activity(user_id);
```

### 4.2 技能雷达表 (skill_radar)

用于生成能力雷达图。

```sql
CREATE TABLE analytics.skill_radar (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    tag VARCHAR(50),                       -- dp, graphs, math 等
    rating DOUBLE PRECISION,               -- 计算后的能力值 (0-100)
    solved_count INTEGER,
    UNIQUE(user_id, tag)
);

CREATE INDEX idx_radar_user ON analytics.skill_radar(user_id);
```

### 4.3 用户综合评分表 (user_rating)

```sql
CREATE TABLE analytics.user_rating (
    user_id BIGINT PRIMARY KEY,
    unified_rating INTEGER,                -- 统一评分 (CF*0.7 + AT*0.3)
    cf_rating INTEGER,                     -- Codeforces Rating
    at_rating INTEGER,                     -- AtCoder Rating
    nk_rating INTEGER,                     -- NowCoder Rating (暂未使用)
    updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## 5. 索引策略

| 表 | 索引 | 用途 |
|----|------|------|
| users | username, email | 登录查询 |
| blogs | author_id, status | 列表查询 |
| user_handles | platform | 按平台查询 |
| submissions | user_id, submission_time | 热力图查询 |
| daily_activity | user_id | 热力图查询 |
| skill_radar | user_id | 雷达图查询 |

---

## 6. 注意事项

### 6.1 PostgreSQL 保留字

`date` 是 PostgreSQL 保留字，在 JPA 实体中需要转义：

```java
@Column(name = "\"date\"")
private LocalDate date;
```

### 6.2 JSONB 类型

`platform_breakdown` 字段使用 JSONB 类型，JPA 映射需要：

```java
@Type(JsonType.class)
@Column(columnDefinition = "jsonb")
private Map<String, Integer> platformBreakdown;
```

### 6.3 分区表维护

每年需要创建新的分区：

```sql
CREATE TABLE crawler.submissions_2026 PARTITION OF crawler.submissions
    FOR VALUES FROM ('2026-01-01') TO ('2027-01-01');
```

---

*最后更新: 2025-01*
