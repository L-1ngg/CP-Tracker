package com.cptracker.crawler.scheduler;

import com.cptracker.crawler.service.CrawlerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.script.DefaultRedisScript;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.Collections;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicBoolean;

@Slf4j
@Component
@RequiredArgsConstructor
public class CrawlerScheduler {

    private final CrawlerService crawlerService;
    private final StringRedisTemplate redisTemplate;

    private static final String SYNC_LOCK_KEY = "crawler:sync:lock";
    private static final Duration LOCK_TIMEOUT = Duration.ofHours(2);
    private static final DefaultRedisScript<Long> UNLOCK_SCRIPT = new DefaultRedisScript<>(
            "if redis.call('get', KEYS[1]) == ARGV[1] then " +
                    "return redis.call('del', KEYS[1]) " +
                    "else return 0 end",
            Long.class);

    // 本地标记，防止同一实例重复执行
    private final AtomicBoolean isSyncing = new AtomicBoolean(false);

    /**
     * 每天凌晨2点同步所有用户数据
     * 使用 Redis 分布式锁防止多实例重复执行
     */
    @Scheduled(cron = "0 0 2 * * ?")
    public void syncAllUsers() {
        // 本地锁检查
        if (!isSyncing.compareAndSet(false, true)) {
            log.warn("同步任务已在本实例运行中，跳过");
            return;
        }

        // 尝试获取分布式锁
        String lockValue = UUID.randomUUID().toString();
        Boolean acquired = redisTemplate.opsForValue()
                .setIfAbsent(SYNC_LOCK_KEY, lockValue, LOCK_TIMEOUT);

        if (Boolean.TRUE.equals(acquired)) {
            try {
                log.info("获取分布式锁成功，开始全量同步用户数据");
                long startTime = System.currentTimeMillis();

                crawlerService.syncAllUsers();

                long duration = System.currentTimeMillis() - startTime;
                log.info("全量同步完成，耗时 {} 秒", duration / 1000);
            } catch (Exception e) {
                log.error("全量同步失败", e);
            } finally {
                // 仅释放自己持有的锁
                releaseLock(lockValue);
                isSyncing.set(false);
            }
        } else {
            log.warn("获取分布式锁失败，其他实例正在执行同步任务");
            isSyncing.set(false);
        }
    }

    private void releaseLock(String lockValue) {
        try {
            redisTemplate.execute(UNLOCK_SCRIPT, Collections.singletonList(SYNC_LOCK_KEY), lockValue);
        } catch (Exception e) {
            log.warn("释放分布式锁失败", e);
        }
    }
}
