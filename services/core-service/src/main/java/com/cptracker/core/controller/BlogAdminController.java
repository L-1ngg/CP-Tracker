package com.cptracker.core.controller;

import com.cptracker.core.dto.ReviewBlogRequest;
import com.cptracker.core.entity.Blog;
import com.cptracker.core.service.BlogReviewService;
import com.cptracker.core.service.BlogService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/core/admin/blogs")
@RequiredArgsConstructor
public class BlogAdminController {

    private final BlogService blogService;
    private final BlogReviewService blogReviewService;

    @GetMapping("/pending")
    public ResponseEntity<Page<Blog>> getPending(Pageable pageable) {
        return ResponseEntity.ok(blogService.getPendingBlogs(pageable));
    }

    @PostMapping("/review")
    public ResponseEntity<Void> review(
            @RequestHeader("X-User-Id") Long reviewerId,
            @RequestBody ReviewBlogRequest request) {
        blogReviewService.reviewBlog(reviewerId, request);
        return ResponseEntity.ok().build();
    }
}
