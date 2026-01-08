package com.cptracker.crawler.fetcher;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class SubmissionDTO {
    private String remoteId;
    private String problemId;
    private String verdict;
    private String language;
    private LocalDateTime submissionTime;
    private Integer problemRating;  // 题目难度
    private List<String> tags;      // 题目标签
}
