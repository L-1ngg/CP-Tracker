package com.cptracker.core.repository;

import com.cptracker.core.entity.Blog;
import com.cptracker.core.enums.BlogStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BlogRepository extends JpaRepository<Blog, Long> {

    List<Blog> findByAuthorId(Long authorId);

    Page<Blog> findByStatus(BlogStatus status, Pageable pageable);

    Page<Blog> findByAuthorIdAndStatus(Long authorId, BlogStatus status, Pageable pageable);

    Page<Blog> findByAuthorId(Long authorId, Pageable pageable);
}
