-- crawler.user_handles 外部账号映射表
CREATE TABLE IF NOT EXISTS crawler.user_handles (
    user_id BIGINT REFERENCES public.users(id),
    platform VARCHAR(20) NOT NULL,
    handle VARCHAR(100) NOT NULL,
    last_fetched TIMESTAMP,
    PRIMARY KEY (user_id, platform)
);
