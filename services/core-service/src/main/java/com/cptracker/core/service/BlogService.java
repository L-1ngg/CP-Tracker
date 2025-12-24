package com.cptracker.core.service;

import com.cptracker.core.dto.CreateBlogRequest;
import com.cptracker.core.entity.Blog;
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
        blog.setStatus("DRAFT");
        return blogRepository.save(blog);
    }

    public Page<Blog> getPublishedBlogs(Pageable pageable) {
        return blogRepository.findByStatus("PUBLISHED", pageable);
    }

    @Transactional
    public void submitForReview(Long blogId) {
        Blog blog = blogRepository.findById(blogId)
                .orElseThrow(() -> new RuntimeException("博客不存在"));
        blog.setStatus("PENDING");
        blogRepository.save(blog);
    }

    public Page<Blog> getPendingBlogs(Pageable pageable) {
        return blogRepository.findByStatus("PENDING", pageable);
    }
}
