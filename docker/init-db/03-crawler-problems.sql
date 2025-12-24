-- crawler.problems 题目表
CREATE TABLE IF NOT EXISTS crawler.problems (
    id BIGSERIAL PRIMARY KEY,
    platform VARCHAR(20) NOT NULL,
    remote_id VARCHAR(50) NOT NULL,
    title VARCHAR(255),
    url VARCHAR(500),
    difficulty INTEGER,
    tags TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(platform, remote_id)
);

CREATE INDEX idx_problems_platform ON crawler.problems(platform);
