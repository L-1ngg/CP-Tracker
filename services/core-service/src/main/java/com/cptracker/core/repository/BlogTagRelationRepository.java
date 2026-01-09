package com.cptracker.core.repository;

import com.cptracker.core.entity.BlogTagRelation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BlogTagRelationRepository extends JpaRepository<BlogTagRelation, BlogTagRelation.BlogTagRelationId> {

    List<BlogTagRelation> findByBlogId(Long blogId);

    List<BlogTagRelation> findByTagId(Long tagId);

    void deleteByBlogId(Long blogId);

    @Query("SELECT btr.blogId FROM BlogTagRelation btr WHERE btr.tagId = :tagId")
    List<Long> findBlogIdsByTagId(@Param("tagId") Long tagId);
}
