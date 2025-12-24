-- analytics.skill_radar 技能雷达图数据
CREATE TABLE IF NOT EXISTS analytics.skill_radar (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT,
    tag VARCHAR(50),
    rating DOUBLE PRECISION DEFAULT 0,
    solved_count INTEGER DEFAULT 0,
    UNIQUE(user_id, tag)
);

-- analytics.user_rating 用户综合评分
CREATE TABLE IF NOT EXISTS analytics.user_rating (
    user_id BIGINT PRIMARY KEY,
    unified_rating INTEGER DEFAULT 0,
    cf_rating INTEGER,
    nk_rating INTEGER,
    at_rating INTEGER,
    updated_at TIMESTAMP DEFAULT NOW()
);
