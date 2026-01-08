package com.cptracker.crawler.fetcher;

import lombok.Data;
import java.util.List;

@Data
public class CodeforcesSubmissionResponse {
    private String status;
    private List<CfSubmission> result;

    @Data
    public static class CfSubmission {
        private Long id;
        private Long creationTimeSeconds;
        private CfProblem problem;
        private String verdict;
        private String programmingLanguage;
    }

    @Data
    public static class CfProblem {
        private Integer contestId;
        private String index;
        private Integer rating;      // 题目难度
        private List<String> tags;   // 题目标签
    }
}
