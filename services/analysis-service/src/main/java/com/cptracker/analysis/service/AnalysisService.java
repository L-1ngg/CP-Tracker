package com.cptracker.analysis.service;

import com.cptracker.analysis.entity.DailyActivity;
import com.cptracker.analysis.entity.SkillRadar;
import com.cptracker.analysis.entity.UserRating;
import com.cptracker.analysis.repository.DailyActivityRepository;
import com.cptracker.analysis.repository.SkillRadarRepository;
import com.cptracker.analysis.repository.UserRatingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

/**
 * 分析服务 - 提供用户活跃度、技能雷达、Rating 查询功能
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AnalysisService {

    private final DailyActivityRepository dailyActivityRepository;
    private final SkillRadarRepository skillRadarRepository;
    private final UserRatingRepository userRatingRepository;

    /**
     * 获取用户热力图数据
     */
    @Cacheable(cacheNames = "analysis:heatmap", key = "#userId + ':' + #days")
    public List<DailyActivity> getHeatmapData(Long userId, int days) {
        log.debug("获取用户热力图数据, userId={}, days={}", userId, days);
        LocalDate end = LocalDate.now();
        LocalDate start = end.minusDays(days);
        return dailyActivityRepository.findByUserIdAndDateBetween(userId, start, end);
    }

    /**
     * 获取用户技能雷达数据
     */
    @Cacheable(cacheNames = "analysis:skills", key = "#userId")
    public List<SkillRadar> getSkillRadar(Long userId) {
        log.debug("获取用户技能雷达数据, userId={}", userId);
        return skillRadarRepository.findByUserId(userId);
    }

    /**
     * 获取用户 Rating
     * 注意：返回 UserRating 而非 Optional，避免缓存序列化问题
     * 如果用户不存在返回 null
     */
    @Cacheable(cacheNames = "analysis:rating", key = "#userId", unless = "#result == null")
    public UserRating getUserRating(Long userId) {
        log.debug("获取用户Rating, userId={}", userId);
        return userRatingRepository.findById(userId).orElse(null);
    }
}
