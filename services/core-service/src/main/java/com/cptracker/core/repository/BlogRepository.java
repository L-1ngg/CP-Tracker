package com.cptracker.core.repository;

import com.cptracker.core.entity.Blog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BlogRepository extends JpaRepository<Blog, Long> {

    List<Blog> findByAuthorId(Long authorId);

    Page<Blog> findByStatus(String status, Pageable pageable);

    Page<Blog> findByAuthorIdAndStatus(Long authorId, String status, Pageable pageable);
}
