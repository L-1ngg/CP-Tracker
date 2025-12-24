-- 博客标签表
CREATE TABLE IF NOT EXISTS public.blog_tags (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

-- 博客-标签关联表
CREATE TABLE IF NOT EXISTS public.blog_tag_relations (
    blog_id BIGINT REFERENCES public.blogs(id) ON DELETE CASCADE,
    tag_id BIGINT REFERENCES public.blog_tags(id) ON DELETE CASCADE,
    PRIMARY KEY (blog_id, tag_id)
);
