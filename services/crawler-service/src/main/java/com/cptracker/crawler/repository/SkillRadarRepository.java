package com.cptracker.crawler.repository;

import com.cptracker.crawler.entity.SkillRadar;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface SkillRadarRepository extends JpaRepository<SkillRadar, Long> {

    @Modifying
    @Query("DELETE FROM SkillRadar s WHERE s.userId = :userId")
    void deleteByUserId(@Param("userId") Long userId);
}
