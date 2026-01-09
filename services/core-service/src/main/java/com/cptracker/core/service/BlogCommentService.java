package com.cptracker.core.service;

import com.cptracker.core.dto.CreateCommentRequest;
import com.cptracker.core.entity.BlogComment;
import com.cptracker.core.repository.BlogCommentRepository;
import com.cptracker.core.repository.BlogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BlogCommentService {

    private final BlogCommentRepository blogCommentRepository;
    private final BlogRepository blogRepository;

    /**
     * 发表评论
     */
    @Transactional
    public BlogComment createComment(Long blogId, Long userId, CreateCommentRequest request) {
        // 检查博客是否存在
        blogRepository.findById(blogId)
                .orElseThrow(() -> new RuntimeException("博客不存在"));

        // 如果是回复，检查父评论是否存在
        if (request.getParentId() != null) {
            blogCommentRepository.findById(request.getParentId())
                    .orElseThrow(() -> new RuntimeException("父评论不存在"));
        }

        BlogComment comment = new BlogComment();
        comment.setBlogId(blogId);
        comment.setUserId(userId);
        comment.setContent(request.getContent());
        comment.setParentId(request.getParentId());

        return blogCommentRepository.save(comment);
    }

    /**
     * 获取博客的评论列表（分页）
     */
    public Page<BlogComment> getComments(Long blogId, Pageable pageable) {
        return blogCommentRepository.findByBlogIdOrderByCreatedAtDesc(blogId, pageable);
    }

    /**
     * 获取博客的顶级评论（不包含回复）
     */
    public List<BlogComment> getTopLevelComments(Long blogId) {
        return blogCommentRepository.findByBlogIdAndParentIdIsNullOrderByCreatedAtDesc(blogId);
    }

    /**
     * 获取评论的回复
     */
    public List<BlogComment> getReplies(Long parentId) {
        return blogCommentRepository.findByParentIdOrderByCreatedAtAsc(parentId);
    }

    /**
     * 删除评论
     */
    @Transactional
    public void deleteComment(Long commentId, Long userId) {
        BlogComment comment = blogCommentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("评论不存在"));

        // 验证作者权限
        if (!comment.getUserId().equals(userId)) {
            throw new RuntimeException("无权删除此评论");
        }

        blogCommentRepository.delete(comment);
    }

    /**
     * 管理员删除评论
     */
    @Transactional
    public void adminDeleteComment(Long commentId) {
        BlogComment comment = blogCommentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("评论不存在"));
        blogCommentRepository.delete(comment);
    }

    /**
     * 获取博客评论数
     */
    public long getCommentCount(Long blogId) {
        return blogCommentRepository.countByBlogId(blogId);
    }
}
