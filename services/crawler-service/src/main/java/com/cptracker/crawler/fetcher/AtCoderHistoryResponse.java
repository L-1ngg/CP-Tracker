package com.cptracker.crawler.fetcher;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

/**
 * AtCoder 用户比赛历史响应模型
 * API: https://atcoder.jp/users/{handle}/history/json
 */
@Data
public class AtCoderHistoryResponse {

    @JsonProperty("IsRated")
    private Boolean isRated;

    @JsonProperty("Place")
    private Integer place;

    @JsonProperty("OldRating")
    private Integer oldRating;

    @JsonProperty("NewRating")
    private Integer newRating;

    @JsonProperty("Performance")
    private Integer performance;

    @JsonProperty("ContestName")
    private String contestName;

    @JsonProperty("ContestScreenName")
    private String contestScreenName;

    @JsonProperty("EndTime")
    private String endTime;
}
