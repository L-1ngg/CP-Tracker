package com.cptracker.crawler.fetcher;

import java.util.List;

/**
 * 平台数据抓取策略接口
 */
public interface PlatformFetcher {

    /**
     * 获取平台标识
     */
    String getPlatform();

    /**
     * 获取用户提交记录
     */
    List<SubmissionDTO> fetchUserSubmissions(String handle);

    /**
     * 获取用户信息
     */
    UserInfoDTO fetchUserInfo(String handle);
}
