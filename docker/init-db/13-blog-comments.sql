-- 博客评论表
CREATE TABLE IF NOT EXISTS blog_comments (
    id BIGSERIAL PRIMARY KEY,
    blog_id BIGINT NOT NULL REFERENCES blogs(id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL,
    content TEXT NOT NULL,
    parent_id BIGINT REFERENCES blog_comments(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_blog_comments_blog_id ON blog_comments(blog_id);
CREATE INDEX IF NOT EXISTS idx_blog_comments_user_id ON blog_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_blog_comments_parent_id ON blog_comments(parent_id);
