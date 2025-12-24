package com.cptracker.core.controller;

import com.cptracker.core.dto.CreateBlogRequest;
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

    @PostMapping
    public ResponseEntity<Blog> create(
            @RequestHeader("X-User-Id") Long userId,
            @RequestBody CreateBlogRequest request) {
        return ResponseEntity.ok(blogService.createBlog(userId, request));
    }

    @GetMapping
    public ResponseEntity<Page<Blog>> list(Pageable pageable) {
        return ResponseEntity.ok(blogService.getPublishedBlogs(pageable));
    }

    @PostMapping("/{id}/submit")
    public ResponseEntity<Void> submit(@PathVariable("id") Long id) {
        blogService.submitForReview(id);
        return ResponseEntity.ok().build();
    }
}
