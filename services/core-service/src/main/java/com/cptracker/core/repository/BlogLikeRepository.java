package com.cptracker.core.repository;

import com.cptracker.core.entity.BlogLike;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BlogLikeRepository extends JpaRepository<BlogLike, Long> {

    Optional<BlogLike> findByBlogIdAndUserId(Long blogId, Long userId);

    boolean existsByBlogIdAndUserId(Long blogId, Long userId);

    long countByBlogId(Long blogId);

    void deleteByBlogIdAndUserId(Long blogId, Long userId);
}
