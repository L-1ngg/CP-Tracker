package com.cptracker.core.service;

import com.cptracker.core.dto.ReviewBlogRequest;
import com.cptracker.core.entity.Blog;
import com.cptracker.core.entity.BlogReview;
import com.cptracker.core.repository.BlogRepository;
import com.cptracker.core.repository.BlogReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class BlogReviewService {

    private final BlogRepository blogRepository;
    private final BlogReviewRepository blogReviewRepository;

    @Transactional
    public void reviewBlog(Long reviewerId, ReviewBlogRequest request) {
        Blog blog = blogRepository.findById(request.getBlogId())
                .orElseThrow(() -> new RuntimeException("博客不存在"));

        // 更新博客状态
        if ("APPROVE".equals(request.getAction())) {
            blog.setStatus("PUBLISHED");
            blog.setPublishedAt(LocalDateTime.now());
        } else if ("REJECT".equals(request.getAction())) {
            blog.setStatus("REJECTED");
        }
        blogRepository.save(blog);

        // 记录审核日志
        BlogReview review = new BlogReview();
        review.setBlogId(request.getBlogId());
        review.setReviewerId(reviewerId);
        review.setAction(request.getAction());
        review.setComment(request.getComment());
        blogReviewRepository.save(review);
    }
}
