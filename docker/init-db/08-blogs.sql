-- 博客文章表
CREATE TABLE IF NOT EXISTS public.blogs (
    id BIGSERIAL PRIMARY KEY,
    author_id BIGINT NOT NULL REFERENCES public.users(id),
    title VARCHAR(200) NOT NULL,
    summary VARCHAR(500),
    content TEXT NOT NULL,
    cover_url VARCHAR(500),
    status VARCHAR(20) DEFAULT 'DRAFT',
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    published_at TIMESTAMP
);

-- 状态说明: DRAFT(草稿), PENDING(待审核), PUBLISHED(已发布), REJECTED(已打回)

-- 索引
CREATE INDEX idx_blogs_author ON public.blogs(author_id);
CREATE INDEX idx_blogs_status ON public.blogs(status);
CREATE INDEX idx_blogs_published_at ON public.blogs(published_at);
