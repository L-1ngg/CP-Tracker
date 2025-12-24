package com.cptracker.analysis.repository;

import com.cptracker.analysis.entity.DailyActivity;
import com.cptracker.analysis.entity.DailyActivityId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface DailyActivityRepository extends JpaRepository<DailyActivity, DailyActivityId> {

    List<DailyActivity> findByUserIdAndDateBetween(Long userId, LocalDate start, LocalDate end);
}
