-- crawler.submissions 提交记录表（分区表）
CREATE TABLE IF NOT EXISTS crawler.submissions (
    id BIGSERIAL,
    user_id BIGINT NOT NULL,
    platform VARCHAR(20) NOT NULL,
    problem_id BIGINT,
    remote_submission_id VARCHAR(50),
    verdict VARCHAR(50),
    language VARCHAR(50),
    submission_time TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (id, submission_time)
) PARTITION BY RANGE (submission_time);

-- 创建 2024-2025 年分区
CREATE TABLE crawler.submissions_2024 PARTITION OF crawler.submissions
    FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');

CREATE TABLE crawler.submissions_2025 PARTITION OF crawler.submissions
    FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');

-- 索引
CREATE INDEX idx_submissions_user_id ON crawler.submissions(user_id);
CREATE INDEX idx_submissions_platform ON crawler.submissions(platform);
