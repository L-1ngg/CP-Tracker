package com.cptracker.crawler.service;

import com.cptracker.crawler.entity.UserHandle;
import com.cptracker.crawler.fetcher.PlatformFetcher;
import com.cptracker.crawler.repository.UserHandleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

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

    private Map<String, PlatformFetcher> getFetcherMap() {
        return fetchers.stream()
                .collect(Collectors.toMap(PlatformFetcher::getPlatform, Function.identity()));
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
            var submissions = fetcher.fetchUserSubmissions(handle.getHandle());
            log.info("同步用户 {} 提交记录: {} 条", handle.getHandle(), submissions.size());
            // TODO: 保存提交记录到数据库

            handle.setLastFetched(LocalDateTime.now());
            userHandleRepository.save(handle);
        } catch (Exception e) {
            log.error("同步用户数据失败: {}", handle.getHandle(), e);
        }
    }

    public void syncUser(Long userId) {
        Map<String, PlatformFetcher> fetcherMap = getFetcherMap();
        List<UserHandle> handles = userHandleRepository.findAll()
                .stream()
                .filter(h -> h.getUserId().equals(userId))
                .toList();

        for (UserHandle handle : handles) {
            syncUserHandle(handle, fetcherMap.get(handle.getPlatform()));
        }
    }
}
