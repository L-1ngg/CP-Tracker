package com.cptracker.crawler.fetcher;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

/**
 * AtCoder Problems API 提交记录响应模型
 * API: https://kenkoooo.com/atcoder/atcoder-api/v3/user/submissions?user={handle}
 */
@Data
public class AtCoderSubmissionResponse {

    private Long id;

    @JsonProperty("epoch_second")
    private Long epochSecond;

    @JsonProperty("problem_id")
    private String problemId;

    @JsonProperty("contest_id")
    private String contestId;

    @JsonProperty("user_id")
    private String userId;

    private String language;

    private Double point;

    private Integer length;

    private String result;

    @JsonProperty("execution_time")
    private Integer executionTime;
}
