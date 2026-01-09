package com.cptracker.core.service;

import com.cptracker.core.entity.Blog;
import com.cptracker.core.entity.BlogLike;
import com.cptracker.core.repository.BlogLikeRepository;
import com.cptracker.core.repository.BlogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class BlogLikeService {

    private final BlogLikeRepository blogLikeRepository;
    private final BlogRepository blogRepository;

    /**
     * 点赞博客
     */
    @Transactional
    public void likeBlog(Long blogId, Long userId) {
        // 检查博客是否存在
        Blog blog = blogRepository.findById(blogId)
                .orElseThrow(() -> new RuntimeException("博客不存在"));

        // 检查是否已点赞
        if (blogLikeRepository.existsByBlogIdAndUserId(blogId, userId)) {
            throw new RuntimeException("已经点赞过了");
        }

        // 创建点赞记录
        BlogLike like = new BlogLike();
        like.setBlogId(blogId);
        like.setUserId(userId);
        blogLikeRepository.save(like);

        // 更新博客点赞数
        blog.setLikeCount(blog.getLikeCount() + 1);
        blogRepository.save(blog);
    }

    /**
     * 取消点赞
     */
    @Transactional
    public void unlikeBlog(Long blogId, Long userId) {
        // 检查博客是否存在
        Blog blog = blogRepository.findById(blogId)
                .orElseThrow(() -> new RuntimeException("博客不存在"));

        // 检查是否已点赞
        BlogLike like = blogLikeRepository.findByBlogIdAndUserId(blogId, userId)
                .orElseThrow(() -> new RuntimeException("尚未点赞"));

        // 删除点赞记录
        blogLikeRepository.delete(like);

        // 更新博客点赞数
        blog.setLikeCount(Math.max(0, blog.getLikeCount() - 1));
        blogRepository.save(blog);
    }

    /**
     * 检查用户是否已点赞
     */
    public boolean hasLiked(Long blogId, Long userId) {
        return blogLikeRepository.existsByBlogIdAndUserId(blogId, userId);
    }

    /**
     * 获取博客点赞数
     */
    public long getLikeCount(Long blogId) {
        return blogLikeRepository.countByBlogId(blogId);
    }
}
