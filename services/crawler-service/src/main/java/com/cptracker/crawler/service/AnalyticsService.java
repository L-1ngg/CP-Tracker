package com.cptracker.crawler.service;

import com.cptracker.crawler.config.CrawlerConstants;
import com.cptracker.crawler.entity.DailyActivity;
import com.cptracker.crawler.entity.SkillRadar;
import com.cptracker.crawler.entity.UserRating;
import com.cptracker.crawler.fetcher.SubmissionDTO;
import com.cptracker.crawler.fetcher.UserInfoDTO;
import com.cptracker.crawler.repository.DailyActivityRepository;
import com.cptracker.crawler.repository.SkillRadarRepository;
import com.cptracker.crawler.repository.UserRatingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.ArrayList;

@Slf4j
@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final UserRatingRepository userRatingRepository;
    private final DailyActivityRepository dailyActivityRepository;
    private final SkillRadarRepository skillRadarRepository;

    /**
     * 获取用户 Rating
     */
    public UserRating getUserRating(Long userId) {
        return userRatingRepository.findById(userId).orElse(null);
    }

    /**
     * 更新用户 Rating
     */
    @Transactional
    public void updateUserRating(Long userId, String platform, UserInfoDTO userInfo) {
        if (userInfo == null || userInfo.getRating() == null) {
            return;
        }

        UserRating rating = userRatingRepository.findById(userId)
                .orElseGet(() -> {
                    UserRating r = new UserRating();
                    r.setUserId(userId);
                    return r;
                });

        // 根据平台更新对应的 rating
        switch (platform.toUpperCase()) {
            case "CODEFORCES" -> rating.setCfRating(userInfo.getRating());
            case "ATCODER" -> rating.setAtRating(userInfo.getRating());
            case "NOWCODER" -> rating.setNkRating(userInfo.getRating());
        }

        // 计算统一 Rating（加权平均：CF 70%, AT 30%）
        Integer unified = calculateWeightedRating(
                rating.getCfRating(),
                rating.getAtRating()
        );
        rating.setUnifiedRating(unified);
        rating.setUpdatedAt(LocalDateTime.now());

        userRatingRepository.save(rating);
        log.info("更新用户 {} Rating: {}", userId, rating);
    }

    /**
     * 更新每日活跃度
     * 支持多平台数据合并，会先清理旧数据
     */
    @Transactional
    public void updateDailyActivity(Long userId, String platform, List<SubmissionDTO> submissions) {
        if (submissions == null || submissions.isEmpty()) {
            return;
        }

        // 清理旧数据
        LocalDate cutoffDate = LocalDate.now().minusDays(CrawlerConstants.DATA_RETENTION_DAYS);
        dailyActivityRepository.deleteByUserIdAndDateBefore(userId, cutoffDate);

        // 按日期分组统计
        Map<LocalDate, Long> dailyCounts = submissions.stream()
                .filter(s -> s.getSubmissionTime() != null)
                .collect(Collectors.groupingBy(
                        s -> s.getSubmissionTime().toLocalDate(),
                        Collectors.counting()
                ));

        // 保存每日活跃度（合并多平台数据）
        List<DailyActivity> activitiesToSave = new ArrayList<>();
        for (Map.Entry<LocalDate, Long> entry : dailyCounts.entrySet()) {
            LocalDate date = entry.getKey();
            int count = entry.getValue().intValue();

            // 查询已有记录，合并平台数据
            DailyActivity activity = dailyActivityRepository
                    .findByUserIdAndDate(userId, date)
                    .orElseGet(() -> {
                        DailyActivity a = new DailyActivity();
                        a.setUserId(userId);
                        a.setDate(date);
                        return a;
                    });

            // 合并平台数据
            Map<String, Integer> breakdown = activity.getPlatformBreakdown();
            if (breakdown == null) {
                breakdown = new java.util.HashMap<>();
            } else {
                breakdown = new java.util.HashMap<>(breakdown);
            }
            breakdown.put(platform, count);
            activity.setPlatformBreakdown(breakdown);

            // 更新总数
            int total = breakdown.values().stream().mapToInt(Integer::intValue).sum();
            activity.setCount(total);

            activitiesToSave.add(activity);
        }

        // 批量保存
        dailyActivityRepository.saveAll(activitiesToSave);

        log.info("更新用户 {} ({}) 每日活跃度: {} 天", userId, platform, dailyCounts.size());
    }

    /**
     * 更新技能雷达图数据
     * 只统计 AC 的提交，按题目难度加权计算评分
     */
    @Transactional
    public void updateSkillRadar(Long userId, List<SubmissionDTO> submissions) {
        if (submissions == null || submissions.isEmpty()) {
            return;
        }

        // 删除该用户旧的技能数据
        skillRadarRepository.deleteByUserId(userId);

        // 过滤只保留 AC 的提交，并且有 tags 的
        List<SubmissionDTO> acSubmissions = submissions.stream()
                .filter(s -> "OK".equals(s.getVerdict()))
                .filter(s -> s.getTags() != null && !s.getTags().isEmpty())
                .toList();

        if (acSubmissions.isEmpty()) {
            log.info("用户 {} 没有 AC 的提交记录", userId);
            return;
        }

        // 按 tag 分组统计
        Map<String, List<SubmissionDTO>> tagGroups = acSubmissions.stream()
                .flatMap(s -> s.getTags().stream()
                        .map(tag -> Map.entry(tag, s)))
                .collect(Collectors.groupingBy(
                        Map.Entry::getKey,
                        Collectors.mapping(Map.Entry::getValue, Collectors.toList())
                ));

        // 计算每个 tag 的评分和解题数
        List<SkillRadar> newSkills = new ArrayList<>();
        for (Map.Entry<String, List<SubmissionDTO>> entry : tagGroups.entrySet()) {
            String tag = entry.getKey();
            List<SubmissionDTO> tagSubmissions = entry.getValue();

            int solvedCount = tagSubmissions.size();
            double avgRating = tagSubmissions.stream()
                    .filter(s -> s.getProblemRating() != null)
                    .mapToInt(SubmissionDTO::getProblemRating)
                    .average()
                    .orElse(0.0);

            SkillRadar skill = new SkillRadar();
            skill.setUserId(userId);
            skill.setTag(tag);
            skill.setSolvedCount(solvedCount);
            skill.setRating(avgRating);

            newSkills.add(skill);
        }


        skillRadarRepository.saveAll(newSkills);
        log.info("更新用户 {} 技能雷达: {} 个标签", userId, tagGroups.size());
    }

    /**
     * 计算加权平均 Rating
     * 只有一个平台时直接使用该平台 rating
     */
    private Integer calculateWeightedRating(Integer cfRating, Integer atRating) {
        boolean hasCf = cfRating != null && cfRating > 0;
        boolean hasAt = atRating != null && atRating > 0;

        if (hasCf && hasAt) {
            // 两个平台都有：加权平均
            return (int) (cfRating * CrawlerConstants.CF_RATING_WEIGHT + atRating * CrawlerConstants.AT_RATING_WEIGHT);
        } else if (hasCf) {
            // 只有 CF
            return cfRating;
        } else if (hasAt) {
            // 只有 AT
            return atRating;
        }
        return 0;
    }
}
