package com.cptracker.crawler.service;

import com.cptracker.crawler.entity.UserHandle;
import com.cptracker.crawler.fetcher.PlatformFetcher;
import com.cptracker.crawler.fetcher.SubmissionDTO;
import com.cptracker.crawler.fetcher.UserInfoDTO;
import com.cptracker.crawler.repository.UserHandleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 异步爬虫服务
 * 独立类以确保 Spring AOP 代理正确生效
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AsyncCrawlerService {

    private final UserHandleRepository userHandleRepository;
    private final AnalyticsService analyticsService;

    /**
     * 异步同步用户数据
     */
    @Async
    public void asyncSyncUserHandle(UserHandle handle, PlatformFetcher fetcher) {
        if (fetcher == null) {
            log.warn("未找到平台fetcher: {}", handle.getPlatform());
            return;
        }
        try {
            // 获取用户信息并更新 Rating
            UserInfoDTO userInfo = fetcher.fetchUserInfo(handle.getHandle());
            if (userInfo != null) {
                analyticsService.updateUserRating(
                        handle.getUserId(),
                        handle.getPlatform(),
                        userInfo
                );
            }

            // 获取提交记录并更新每日活跃度
            List<SubmissionDTO> submissions = fetcher.fetchUserSubmissions(handle.getHandle());
            log.info("异步同步用户 {} 提交记录: {} 条", handle.getHandle(), submissions.size());

            if (!submissions.isEmpty()) {
                analyticsService.updateDailyActivity(
                        handle.getUserId(),
                        handle.getPlatform(),
                        submissions
                );
                // 只有 Codeforces 才更新技能雷达（AtCoder 没有 tags）
                if ("CODEFORCES".equals(handle.getPlatform())) {
                    analyticsService.updateSkillRadar(handle.getUserId(), submissions);
                }
            }

            handle.setLastFetched(LocalDateTime.now());
            userHandleRepository.save(handle);
            log.info("异步同步用户 {} 完成", handle.getHandle());
        } catch (Exception e) {
            log.error("异步同步用户数据失败: {}", handle.getHandle(), e);
        }
    }
}
