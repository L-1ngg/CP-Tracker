package com.cptracker.core.controller;

import com.cptracker.core.dto.CreateCommentRequest;
import com.cptracker.core.entity.BlogComment;
import com.cptracker.core.service.BlogCommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class BlogCommentController {

    private final BlogCommentService blogCommentService;

    /**
     * 获取博客的评论列表
     */
    @GetMapping("/api/core/blogs/{blogId}/comments")
    public ResponseEntity<Page<BlogComment>> getComments(
            @PathVariable("blogId") Long blogId,
            Pageable pageable) {
        return ResponseEntity.ok(blogCommentService.getComments(blogId, pageable));
    }

    /**
     * 获取博客的顶级评论
     */
    @GetMapping("/api/core/blogs/{blogId}/comments/top")
    public ResponseEntity<List<BlogComment>> getTopLevelComments(
            @PathVariable("blogId") Long blogId) {
        return ResponseEntity.ok(blogCommentService.getTopLevelComments(blogId));
    }

    /**
     * 获取评论的回复
     */
    @GetMapping("/api/core/comments/{commentId}/replies")
    public ResponseEntity<List<BlogComment>> getReplies(
            @PathVariable("commentId") Long commentId) {
        return ResponseEntity.ok(blogCommentService.getReplies(commentId));
    }

    /**
     * 发表评论
     */
    @PostMapping("/api/core/blogs/{blogId}/comments")
    public ResponseEntity<BlogComment> createComment(
            @PathVariable("blogId") Long blogId,
            @RequestHeader("X-User-Id") Long userId,
            @RequestBody CreateCommentRequest request) {
        return ResponseEntity.ok(blogCommentService.createComment(blogId, userId, request));
    }

    /**
     * 删除评论
     */
    @DeleteMapping("/api/core/comments/{commentId}")
    public ResponseEntity<Void> deleteComment(
            @PathVariable("commentId") Long commentId,
            @RequestHeader("X-User-Id") Long userId) {
        blogCommentService.deleteComment(commentId, userId);
        return ResponseEntity.ok().build();
    }
}
