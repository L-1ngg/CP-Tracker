-- analytics.daily_activity 每日活跃度
CREATE TABLE IF NOT EXISTS analytics.daily_activity (
    user_id BIGINT,
    date DATE,
    count INTEGER DEFAULT 0,
    platform_breakdown JSONB,
    PRIMARY KEY (user_id, date)
);
