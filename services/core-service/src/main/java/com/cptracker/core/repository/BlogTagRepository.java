package com.cptracker.core.repository;

import com.cptracker.core.entity.BlogTag;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BlogTagRepository extends JpaRepository<BlogTag, Long> {

    Optional<BlogTag> findByName(String name);

    boolean existsByName(String name);
}
