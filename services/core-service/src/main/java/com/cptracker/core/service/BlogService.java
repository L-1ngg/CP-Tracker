package com.cptracker.core.service;

import com.cptracker.core.dto.CreateBlogRequest;
import com.cptracker.core.dto.UpdateBlogRequest;
import com.cptracker.core.entity.Blog;
import com.cptracker.core.enums.BlogStatus;
import com.cptracker.core.repository.BlogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class BlogService {

    private final BlogRepository blogRepository;

    @Transactional
    public Blog createBlog(Long authorId, CreateBlogRequest request) {
        Blog blog = new Blog();
        blog.setAuthorId(authorId);
        blog.setTitle(request.getTitle());
        blog.setSummary(request.getSummary());
        blog.setContent(request.getContent());
        blog.setCoverUrl(request.getCoverUrl());
        blog.setStatus(BlogStatus.DRAFT);
        return blogRepository.save(blog);
    }

    public Page<Blog> getPublishedBlogs(Pageable pageable) {
        return blogRepository.findByStatus(BlogStatus.PUBLISHED, pageable);
    }

    /**
     * 获取博客详情并增加浏览量
     */
    @Transactional
    public Blog getBlogById(Long id) {
        Blog blog = blogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("博客不存在"));
        // 增加浏览量
        blog.setViewCount(blog.getViewCount() + 1);
        blogRepository.save(blog);
        return blog;
    }

    /**
     * 获取博客详情（不增加浏览量，用于编辑等场景）
     */
    public Blog getBlogByIdWithoutView(Long id) {
        return blogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("博客不存在"));
    }

    /**
     * 更新博客
     */
    @Transactional
    public Blog updateBlog(Long blogId, Long userId, UpdateBlogRequest request) {
        Blog blog = blogRepository.findById(blogId)
                .orElseThrow(() -> new RuntimeException("博客不存在"));

        // 验证作者权限
        if (!blog.getAuthorId().equals(userId)) {
            throw new RuntimeException("无权修改此博客");
        }

        // 只有草稿和被拒绝的博客可以编辑
        if (blog.getStatus() != BlogStatus.DRAFT && blog.getStatus() != BlogStatus.REJECTED) {
            throw new RuntimeException("当前状态不允许编辑");
        }

        if (request.getTitle() != null) {
            blog.setTitle(request.getTitle());
        }
        if (request.getSummary() != null) {
            blog.setSummary(request.getSummary());
        }
        if (request.getContent() != null) {
            blog.setContent(request.getContent());
        }
        if (request.getCoverUrl() != null) {
            blog.setCoverUrl(request.getCoverUrl());
        }

        return blogRepository.save(blog);
    }

    /**
     * 删除博客
     */
    @Transactional
    public void deleteBlog(Long blogId, Long userId) {
        Blog blog = blogRepository.findById(blogId)
                .orElseThrow(() -> new RuntimeException("博客不存在"));

        // 验证作者权限
        if (!blog.getAuthorId().equals(userId)) {
            throw new RuntimeException("无权删除此博客");
        }

        blogRepository.delete(blog);
    }

    @Transactional
    public void submitForReview(Long blogId) {
        Blog blog = blogRepository.findById(blogId)
                .orElseThrow(() -> new RuntimeException("博客不存在"));
        blog.setStatus(BlogStatus.PENDING);
        blogRepository.save(blog);
    }

    public Page<Blog> getPendingBlogs(Pageable pageable) {
        return blogRepository.findByStatus(BlogStatus.PENDING, pageable);
    }

    /**
     * 获取用户的所有博客（分页）
     */
    public Page<Blog> getMyBlogs(Long userId, Pageable pageable) {
        return blogRepository.findByAuthorId(userId, pageable);
    }

    /**
     * 获取用户的草稿博客（分页）
     */
    public Page<Blog> getMyDrafts(Long userId, Pageable pageable) {
        return blogRepository.findByAuthorIdAndStatus(userId, BlogStatus.DRAFT, pageable);
    }

    /**
     * 管理员删除博客（无需验证作者）
     */
    @Transactional
    public void adminDeleteBlog(Long blogId) {
        Blog blog = blogRepository.findById(blogId)
                .orElseThrow(() -> new RuntimeException("博客不存在"));
        blogRepository.delete(blog);
    }
}
