package com.cptracker.core.service;

import com.cptracker.core.dto.CreateTagRequest;
import com.cptracker.core.entity.Blog;
import com.cptracker.core.entity.BlogTag;
import com.cptracker.core.entity.BlogTagRelation;
import com.cptracker.core.enums.BlogStatus;
import com.cptracker.core.repository.BlogRepository;
import com.cptracker.core.repository.BlogTagRelationRepository;
import com.cptracker.core.repository.BlogTagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BlogTagService {

    private final BlogTagRepository blogTagRepository;
    private final BlogTagRelationRepository blogTagRelationRepository;
    private final BlogRepository blogRepository;

    /**
     * 获取所有标签
     */
    public List<BlogTag> getAllTags() {
        return blogTagRepository.findAll();
    }

    /**
     * 创建标签（管理员）
     */
    @Transactional
    public BlogTag createTag(CreateTagRequest request) {
        if (blogTagRepository.existsByName(request.getName())) {
            throw new RuntimeException("标签已存在");
        }

        BlogTag tag = new BlogTag();
        tag.setName(request.getName());
        return blogTagRepository.save(tag);
    }

    /**
     * 删除标签（管理员）
     */
    @Transactional
    public void deleteTag(Long tagId) {
        BlogTag tag = blogTagRepository.findById(tagId)
                .orElseThrow(() -> new RuntimeException("标签不存在"));
        blogTagRepository.delete(tag);
    }

    /**
     * 为博客添加标签
     */
    @Transactional
    public void addTagToBlog(Long blogId, Long tagId) {
        // 验证博客和标签存在
        blogRepository.findById(blogId)
                .orElseThrow(() -> new RuntimeException("博客不存在"));
        blogTagRepository.findById(tagId)
                .orElseThrow(() -> new RuntimeException("标签不存在"));

        BlogTagRelation relation = new BlogTagRelation();
        relation.setBlogId(blogId);
        relation.setTagId(tagId);
        blogTagRelationRepository.save(relation);
    }

    /**
     * 移除博客的标签
     */
    @Transactional
    public void removeTagFromBlog(Long blogId, Long tagId) {
        BlogTagRelation.BlogTagRelationId id = new BlogTagRelation.BlogTagRelationId();
        id.setBlogId(blogId);
        id.setTagId(tagId);
        blogTagRelationRepository.deleteById(id);
    }

    /**
     * 获取博客的所有标签
     */
    public List<BlogTag> getTagsByBlogId(Long blogId) {
        List<BlogTagRelation> relations = blogTagRelationRepository.findByBlogId(blogId);
        return relations.stream()
                .map(r -> blogTagRepository.findById(r.getTagId()).orElse(null))
                .filter(t -> t != null)
                .collect(Collectors.toList());
    }

    /**
     * 按标签筛选已发布的博客
     */
    public Page<Blog> getBlogsByTagId(Long tagId, Pageable pageable) {
        List<Long> blogIds = blogTagRelationRepository.findBlogIdsByTagId(tagId);

        if (blogIds.isEmpty()) {
            return Page.empty(pageable);
        }

        // 获取已发布的博客
        List<Blog> blogs = blogRepository.findAllById(blogIds).stream()
                .filter(b -> b.getStatus() == BlogStatus.PUBLISHED)
                .collect(Collectors.toList());

        // 手动分页
        int start = (int) pageable.getOffset();
        int end = Math.min(start + pageable.getPageSize(), blogs.size());

        if (start >= blogs.size()) {
            return Page.empty(pageable);
        }

        return new PageImpl<>(blogs.subList(start, end), pageable, blogs.size());
    }

    /**
     * 设置博客的标签（替换现有标签）
     */
    @Transactional
    public void setBlogTags(Long blogId, List<Long> tagIds) {
        // 删除现有关联
        blogTagRelationRepository.deleteByBlogId(blogId);

        // 添加新关联
        for (Long tagId : tagIds) {
            BlogTagRelation relation = new BlogTagRelation();
            relation.setBlogId(blogId);
            relation.setTagId(tagId);
            blogTagRelationRepository.save(relation);
        }
    }
}
