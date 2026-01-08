package com.cptracker.crawler.fetcher;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import java.util.List;

/**
 * NowCoder 提交记录响应模型
 */
@Data
public class NowCoderSubmissionResponse {

    private Integer code;
    private String msg;
    private NowCoderSubmissionData data;

    @Data
    public static class NowCoderSubmissionData {
        private List<NowCoderSubmission> list;
        private Integer totalCount;
    }

    @Data
    public static class NowCoderSubmission {
        private Long submissionId;
        private String oderId;
        private String problemId;
        private String problemName;
        private Integer status;
        private String statusMessage;
        private String language;
        private Long submitTime;
    }
}
