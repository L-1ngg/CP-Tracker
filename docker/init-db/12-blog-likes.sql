-- 博客点赞表
CREATE TABLE IF NOT EXISTS blog_likes (
    id BIGSERIAL PRIMARY KEY,
    blog_id BIGINT NOT NULL REFERENCES blogs(id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(blog_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_blog_likes_blog_id ON blog_likes(blog_id);
CREATE INDEX IF NOT EXISTS idx_blog_likes_user_id ON blog_likes(user_id);
