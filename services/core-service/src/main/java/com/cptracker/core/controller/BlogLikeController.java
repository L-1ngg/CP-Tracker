package com.cptracker.core.controller;

import com.cptracker.core.service.BlogLikeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/core/blogs")
@RequiredArgsConstructor
public class BlogLikeController {

    private final BlogLikeService blogLikeService;

    /**
     * 点赞博客
     */
    @PostMapping("/{id}/like")
    public ResponseEntity<Void> like(
            @PathVariable("id") Long blogId,
            @RequestHeader("X-User-Id") Long userId) {
        blogLikeService.likeBlog(blogId, userId);
        return ResponseEntity.ok().build();
    }

    /**
     * 取消点赞
     */
    @DeleteMapping("/{id}/like")
    public ResponseEntity<Void> unlike(
            @PathVariable("id") Long blogId,
            @RequestHeader("X-User-Id") Long userId) {
        blogLikeService.unlikeBlog(blogId, userId);
        return ResponseEntity.ok().build();
    }

    /**
     * 获取点赞状态
     */
    @GetMapping("/{id}/like/status")
    public ResponseEntity<Map<String, Object>> getLikeStatus(
            @PathVariable("id") Long blogId,
            @RequestHeader(value = "X-User-Id", required = false) Long userId) {
        boolean hasLiked = userId != null && blogLikeService.hasLiked(blogId, userId);
        long likeCount = blogLikeService.getLikeCount(blogId);
        return ResponseEntity.ok(Map.of(
                "hasLiked", hasLiked,
                "likeCount", likeCount
        ));
    }
}
