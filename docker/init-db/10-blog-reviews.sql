-- 博客审核记录表
CREATE TABLE IF NOT EXISTS public.blog_reviews (
    id BIGSERIAL PRIMARY KEY,
    blog_id BIGINT NOT NULL REFERENCES public.blogs(id),
    reviewer_id BIGINT NOT NULL REFERENCES public.users(id),
    action VARCHAR(20) NOT NULL,
    comment VARCHAR(500),
    created_at TIMESTAMP DEFAULT NOW()
);

-- 操作说明: APPROVE(通过), REJECT(打回), DELETE(删除)

CREATE INDEX idx_blog_reviews_blog ON public.blog_reviews(blog_id);
