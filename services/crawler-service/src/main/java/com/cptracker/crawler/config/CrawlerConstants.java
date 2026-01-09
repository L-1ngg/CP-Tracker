package com.cptracker.crawler.config;

/**
 * 爬虫服务常量配置
 */
public final class CrawlerConstants {

    private CrawlerConstants() {
        // 防止实例化
    }

    /** 数据保留天数 */
    public static final int DATA_RETENTION_DAYS = 365;

    /** Codeforces Rating 权重 */
    public static final double CF_RATING_WEIGHT = 0.7;

    /** AtCoder Rating 权重 */
    public static final double AT_RATING_WEIGHT = 0.3;

    /** NowCoder AC 状态码 */
    public static final int NOWCODER_AC_STATUS = 5;
}
