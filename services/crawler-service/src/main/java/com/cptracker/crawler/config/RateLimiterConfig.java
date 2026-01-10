package com.cptracker.crawler.config;

import com.google.common.util.concurrent.RateLimiter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * API 限流配置
 * 使用 Guava RateLimiter 实现令牌桶限流
 */
@Configuration
public class RateLimiterConfig {

    /**
     * Codeforces API 限流器
     * 限制：5 次/秒
     */
    @Bean
    public RateLimiter codeforcesRateLimiter(
            @Value("${crawler.codeforces.rate-limit:5}") double rateLimit) {
        return RateLimiter.create(rateLimit);
    }

    /**
     * AtCoder API 限流器
     * 限制：2 次/秒（AtCoder 限制更严格）
     */
    @Bean
    public RateLimiter atcoderRateLimiter(
            @Value("${crawler.atcoder.rate-limit:2}") double rateLimit) {
        return RateLimiter.create(rateLimit);
    }

    /**
     * NowCoder API 限流器
     * 限制：3 次/秒
     */
    @Bean
    public RateLimiter nowcoderRateLimiter(
            @Value("${crawler.nowcoder.rate-limit:3}") double rateLimit) {
        return RateLimiter.create(rateLimit);
    }
}
