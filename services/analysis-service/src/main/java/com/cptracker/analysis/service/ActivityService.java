package com.cptracker.analysis.service;

import com.cptracker.analysis.entity.DailyActivity;
import com.cptracker.analysis.repository.DailyActivityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ActivityService {

    private final DailyActivityRepository dailyActivityRepository;

    public List<DailyActivity> getHeatmapData(Long userId, int days) {
        LocalDate end = LocalDate.now();
        LocalDate start = end.minusDays(days);
        return dailyActivityRepository.findByUserIdAndDateBetween(userId, start, end);
    }
}
