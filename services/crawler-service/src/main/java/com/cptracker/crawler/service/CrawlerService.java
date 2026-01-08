package com.cptracker.crawler.service;

import com.cptracker.crawler.dto.UserHandleDTO;
import com.cptracker.crawler.entity.UserHandle;
import com.cptracker.crawler.entity.UserHandleId;
import com.cptracker.crawler.entity.UserRating;
import com.cptracker.crawler.fetcher.PlatformFetcher;
import com.cptracker.crawler.fetcher.UserInfoDTO;
import com.cptracker.crawler.repository.UserHandleRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class CrawlerService {

    private final UserHandleRepository userHandleRepository;
    private final List<PlatformFetcher> fetchers;
    private final AnalyticsService analyticsService;
    private final AsyncCrawlerService asyncCrawlerService;

    // 缓存 FetcherMap，避免每次调用都重建
    private Map<String, PlatformFetcher> fetcherMap;

    @PostConstruct
    public void init() {
        this.fetcherMap = fetchers.stream()
                .collect(Collectors.toMap(PlatformFetcher::getPlatform, Function.identity()));
        log.info("初始化 FetcherMap，支持平台: {}", fetcherMap.keySet());
    }

    private Map<String, PlatformFetcher> getFetcherMap() {
        return fetcherMap;
    }

    public void syncAllUsers() {
        Map<String, PlatformFetcher> fetcherMap = getFetcherMap();
        List<UserHandle> handles = userHandleRepository.findAll();

        for (UserHandle handle : handles) {
            syncUserHandle(handle, fetcherMap.get(handle.getPlatform()));
        }
    }

    private void syncUserHandle(UserHandle handle, PlatformFetcher fetcher) {
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
            var submissions = fetcher.fetchUserSubmissions(handle.getHandle());
            log.info("同步用户 {} 提交记录: {} 条", handle.getHandle(), submissions.size());

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
        } catch (Exception e) {
            log.error("同步用户数据失败: {}", handle.getHandle(), e);
        }
    }

    public void syncUser(Long userId) {
        Map<String, PlatformFetcher> fetcherMap = getFetcherMap();
        List<UserHandle> handles = userHandleRepository.findByUserId(userId);

        for (UserHandle handle : handles) {
            syncUserHandle(handle, fetcherMap.get(handle.getPlatform()));
        }
    }

    /**
     * 绑定平台账号
     */
    @Transactional
    public UserHandleDTO bindHandle(Long userId, String platform, String handle) {
        String normalizedPlatform = platform.toUpperCase();

        // 检查是否已绑定
        UserHandleId id = new UserHandleId();
        id.setUserId(userId);
        id.setPlatform(normalizedPlatform);
        if (userHandleRepository.existsById(id)) {
            throw new IllegalStateException("该平台已绑定账号");
        }

        // 验证账号是否存在
        PlatformFetcher fetcher = getFetcherMap().get(normalizedPlatform);
        if (fetcher == null) {
            throw new IllegalArgumentException("不支持的平台: " + platform);
        }

        UserInfoDTO userInfo = fetcher.fetchUserInfo(handle);
        if (userInfo == null) {
            throw new IllegalArgumentException("账号不存在或无法访问: " + handle);
        }

        // 保存绑定
        UserHandle userHandle = new UserHandle();
        userHandle.setUserId(userId);
        userHandle.setPlatform(normalizedPlatform);
        userHandle.setHandle(handle);
        userHandleRepository.save(userHandle);

        log.info("用户 {} 绑定 {} 账号: {}", userId, normalizedPlatform, handle);

        // 立即保存 Rating 到 analytics 表
        analyticsService.updateUserRating(userId, normalizedPlatform, userInfo);

        // 异步爬取提交记录（通过独立服务确保 AOP 代理生效）
        asyncCrawlerService.asyncSyncUserHandle(userHandle, fetcher);

        return UserHandleDTO.builder()
                .userId(userId)
                .platform(normalizedPlatform)
                .handle(handle)
                .rating(userInfo.getRating())
                .maxRating(userInfo.getMaxRating())
                .rank(userInfo.getRank())
                .build();
    }

    /**
     * 解绑平台账号
     */
    @Transactional
    public void unbindHandle(Long userId, String platform) {
        String normalizedPlatform = platform.toUpperCase();
        UserHandleId id = new UserHandleId();
        id.setUserId(userId);
        id.setPlatform(normalizedPlatform);

        if (!userHandleRepository.existsById(id)) {
            throw new IllegalStateException("未绑定该平台账号");
        }

        userHandleRepository.deleteById(id);
        log.info("用户 {} 解绑 {} 账号", userId, normalizedPlatform);
    }

    /**
     * 获取用户所有绑定的账号（从数据库读取，不调用外部API）
     */
    public List<UserHandleDTO> getUserHandles(Long userId) {
        // 从数据库获取 rating
        UserRating rating = analyticsService.getUserRating(userId);

        return userHandleRepository.findByUserId(userId).stream()
                .map(handle -> {
                    UserHandleDTO.UserHandleDTOBuilder builder = UserHandleDTO.builder()
                            .userId(handle.getUserId())
                            .platform(handle.getPlatform())
                            .handle(handle.getHandle())
                            .lastFetched(handle.getLastFetched());

                    // 从数据库获取 rating
                    if (rating != null) {
                        switch (handle.getPlatform()) {
                            case "CODEFORCES" -> builder.rating(rating.getCfRating());
                            case "ATCODER" -> builder.rating(rating.getAtRating());
                            case "NOWCODER" -> builder.rating(rating.getNkRating());
                        }
                    }

                    return builder.build();
                })
                .collect(Collectors.toList());
    }
}
