package com.cptracker.core.repository;

import com.cptracker.core.entity.BlogReview;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BlogReviewRepository extends JpaRepository<BlogReview, Long> {

    List<BlogReview> findByBlogIdOrderByCreatedAtDesc(Long blogId);
}
