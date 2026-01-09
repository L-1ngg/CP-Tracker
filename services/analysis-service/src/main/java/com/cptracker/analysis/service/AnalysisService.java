package com.cptracker.analysis.service;

import com.cptracker.analysis.entity.DailyActivity;
import com.cptracker.analysis.entity.SkillRadar;
import com.cptracker.analysis.entity.UserRating;
import com.cptracker.analysis.repository.DailyActivityRepository;
import com.cptracker.analysis.repository.SkillRadarRepository;
import com.cptracker.analysis.repository.UserRatingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * 分析服务 - 提供用户活跃度、技能雷达、Rating 查询功能
 */
@Service
@RequiredArgsConstructor
public class AnalysisService {

    private final DailyActivityRepository dailyActivityRepository;
    private final SkillRadarRepository skillRadarRepository;
    private final UserRatingRepository userRatingRepository;

    /**
     * 获取用户热力图数据
     */
    public List<DailyActivity> getHeatmapData(Long userId, int days) {
        LocalDate end = LocalDate.now();
        LocalDate start = end.minusDays(days);
        return dailyActivityRepository.findByUserIdAndDateBetween(userId, start, end);
    }

    /**
     * 获取用户技能雷达数据
     */
    public List<SkillRadar> getSkillRadar(Long userId) {
        return skillRadarRepository.findByUserId(userId);
    }

    /**
     * 获取用户 Rating
     */
    public Optional<UserRating> getUserRating(Long userId) {
        return userRatingRepository.findById(userId);
    }
}
