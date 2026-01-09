package com.cptracker.core.controller;

import com.cptracker.core.dto.CreateBlogRequest;
import com.cptracker.core.dto.UpdateBlogRequest;
import com.cptracker.core.entity.Blog;
import com.cptracker.core.service.BlogService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/core/blogs")
@RequiredArgsConstructor
public class BlogController {

    private final BlogService blogService;

    /**
     * 创建博客（草稿）
     */
    @PostMapping
    public ResponseEntity<Blog> create(
            @RequestHeader("X-User-Id") Long userId,
            @RequestBody CreateBlogRequest request) {
        return ResponseEntity.ok(blogService.createBlog(userId, request));
    }

    /**
     * 获取已发布的博客列表
     */
    @GetMapping
    public ResponseEntity<Page<Blog>> list(Pageable pageable) {
        return ResponseEntity.ok(blogService.getPublishedBlogs(pageable));
    }

    /**
     * 获取当前用户的所有博客（必须放在 /{id} 之前）
     */
    @GetMapping("/my")
    public ResponseEntity<Page<Blog>> getMyBlogs(
            @RequestHeader("X-User-Id") Long userId,
            Pageable pageable) {
        return ResponseEntity.ok(blogService.getMyBlogs(userId, pageable));
    }

    /**
     * 获取当前用户的草稿
     */
    @GetMapping("/my/drafts")
    public ResponseEntity<Page<Blog>> getMyDrafts(
            @RequestHeader("X-User-Id") Long userId,
            Pageable pageable) {
        return ResponseEntity.ok(blogService.getMyDrafts(userId, pageable));
    }

    /**
     * 获取博客详情（增加浏览量）- 使用正则限制只匹配数字
     */
    @GetMapping("/{id:\\d+}")
    public ResponseEntity<Blog> getById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(blogService.getBlogById(id));
    }

    /**
     * 更新博客
     */
    @PutMapping("/{id:\\d+}")
    public ResponseEntity<Blog> update(
            @PathVariable("id") Long id,
            @RequestHeader("X-User-Id") Long userId,
            @RequestBody UpdateBlogRequest request) {
        return ResponseEntity.ok(blogService.updateBlog(id, userId, request));
    }

    /**
     * 删除博客
     */
    @DeleteMapping("/{id:\\d+}")
    public ResponseEntity<Void> delete(
            @PathVariable("id") Long id,
            @RequestHeader("X-User-Id") Long userId) {
        blogService.deleteBlog(id, userId);
        return ResponseEntity.ok().build();
    }

    /**
     * 提交博客进行审核
     */
    @PostMapping("/{id:\\d+}/submit")
    public ResponseEntity<Void> submit(@PathVariable("id") Long id) {
        blogService.submitForReview(id);
        return ResponseEntity.ok().build();
    }
}
