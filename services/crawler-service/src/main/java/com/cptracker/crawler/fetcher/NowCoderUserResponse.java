package com.cptracker.crawler.fetcher;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

/**
 * NowCoder 用户信息响应模型
 */
@Data
public class NowCoderUserResponse {

    private Integer code;
    private String msg;
    private NowCoderUserData data;

    @Data
    public static class NowCoderUserData {
        private String nickname;
        private Integer rating;
        private Integer maxRating;
        private String rank;
        private Integer acNum;
        private Integer submitNum;
    }
}
