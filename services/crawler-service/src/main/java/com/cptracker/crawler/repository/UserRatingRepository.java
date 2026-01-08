package com.cptracker.crawler.repository;

import com.cptracker.crawler.entity.UserRating;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRatingRepository extends JpaRepository<UserRating, Long> {
}
