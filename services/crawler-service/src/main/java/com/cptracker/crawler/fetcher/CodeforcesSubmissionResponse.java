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
        private CfProblem problem;
        private String verdict;
        private String programmingLanguage;
    }

    @Data
    public static class CfProblem {
        private Integer contestId;
        private String index;
    }
}
