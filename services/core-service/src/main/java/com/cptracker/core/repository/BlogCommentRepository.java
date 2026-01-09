package com.cptracker.core.repository;

import com.cptracker.core.entity.BlogComment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BlogCommentRepository extends JpaRepository<BlogComment, Long> {

    Page<BlogComment> findByBlogIdOrderByCreatedAtDesc(Long blogId, Pageable pageable);

    List<BlogComment> findByBlogIdAndParentIdIsNullOrderByCreatedAtDesc(Long blogId);

    List<BlogComment> findByParentIdOrderByCreatedAtAsc(Long parentId);

    long countByBlogId(Long blogId);
}
