-- CP-Tracker 数据库初始化脚本
-- 创建 Schema

CREATE SCHEMA IF NOT EXISTS crawler;
CREATE SCHEMA IF NOT EXISTS analytics;

-- 授权
GRANT ALL ON SCHEMA crawler TO cptracker;
GRANT ALL ON SCHEMA analytics TO cptracker;
