package com.cptracker.crawler.repository;

import com.cptracker.crawler.entity.DailyActivity;
import com.cptracker.crawler.entity.DailyActivityId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface DailyActivityRepository extends JpaRepository<DailyActivity, DailyActivityId> {
    List<DailyActivity> findByUserId(Long userId);

    /**
     * 按用户ID和日期查询
     */
    Optional<DailyActivity> findByUserIdAndDate(Long userId, LocalDate date);

    /**
     * 删除用户指定日期之前的活动数据
     */
    @Modifying
    @Query("DELETE FROM DailyActivity d WHERE d.userId = :userId AND d.date < :cutoffDate")
    void deleteByUserIdAndDateBefore(@Param("userId") Long userId, @Param("cutoffDate") LocalDate cutoffDate);
}
