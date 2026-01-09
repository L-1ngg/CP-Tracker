package com.cptracker.core.controller;

import com.cptracker.core.dto.CreateTagRequest;
import com.cptracker.core.entity.Blog;
import com.cptracker.core.entity.BlogTag;
import com.cptracker.core.service.BlogTagService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class BlogTagController {

    private final BlogTagService blogTagService;

    /**
     * 获取所有标签
     */
    @GetMapping("/api/core/tags")
    public ResponseEntity<List<BlogTag>> getAllTags() {
        return ResponseEntity.ok(blogTagService.getAllTags());
    }

    /**
     * 创建标签（管理员）
     */
    @PostMapping("/api/core/admin/tags")
    public ResponseEntity<BlogTag> createTag(@RequestBody CreateTagRequest request) {
        return ResponseEntity.ok(blogTagService.createTag(request));
    }

    /**
     * 删除标签（管理员）
     */
    @DeleteMapping("/api/core/admin/tags/{id}")
    public ResponseEntity<Void> deleteTag(@PathVariable("id") Long id) {
        blogTagService.deleteTag(id);
        return ResponseEntity.ok().build();
    }

    /**
     * 获取博客的标签
     */
    @GetMapping("/api/core/blogs/{blogId}/tags")
    public ResponseEntity<List<BlogTag>> getBlogTags(@PathVariable("blogId") Long blogId) {
        return ResponseEntity.ok(blogTagService.getTagsByBlogId(blogId));
    }

    /**
     * 为博客添加标签
     */
    @PostMapping("/api/core/blogs/{blogId}/tags/{tagId}")
    public ResponseEntity<Void> addTagToBlog(
            @PathVariable("blogId") Long blogId,
            @PathVariable("tagId") Long tagId) {
        blogTagService.addTagToBlog(blogId, tagId);
        return ResponseEntity.ok().build();
    }

    /**
     * 移除博客的标签
     */
    @DeleteMapping("/api/core/blogs/{blogId}/tags/{tagId}")
    public ResponseEntity<Void> removeTagFromBlog(
            @PathVariable("blogId") Long blogId,
            @PathVariable("tagId") Long tagId) {
        blogTagService.removeTagFromBlog(blogId, tagId);
        return ResponseEntity.ok().build();
    }

    /**
     * 设置博客的标签（批量）
     */
    @PutMapping("/api/core/blogs/{blogId}/tags")
    public ResponseEntity<Void> setBlogTags(
            @PathVariable("blogId") Long blogId,
            @RequestBody List<Long> tagIds) {
        blogTagService.setBlogTags(blogId, tagIds);
        return ResponseEntity.ok().build();
    }

    /**
     * 按标签筛选博客
     */
    @GetMapping("/api/core/blogs/by-tag/{tagId}")
    public ResponseEntity<Page<Blog>> getBlogsByTag(
            @PathVariable("tagId") Long tagId,
            Pageable pageable) {
        return ResponseEntity.ok(blogTagService.getBlogsByTagId(tagId, pageable));
    }
}
