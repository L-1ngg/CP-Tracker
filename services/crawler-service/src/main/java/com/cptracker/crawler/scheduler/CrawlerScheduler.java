package com.cptracker.crawler.scheduler;

import com.cptracker.crawler.service.CrawlerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class CrawlerScheduler {

    private final CrawlerService crawlerService;

    /**
     * 每天凌晨2点同步所有用户数据
     */
    @Scheduled(cron = "0 0 2 * * ?")
    public void syncAllUsers() {
        log.info("开始全量同步用户数据");
        crawlerService.syncAllUsers();
        log.info("全量同步完成");
    }
}
