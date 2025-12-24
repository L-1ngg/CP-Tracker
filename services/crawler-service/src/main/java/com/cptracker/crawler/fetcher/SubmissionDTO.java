package com.cptracker.crawler.fetcher;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class SubmissionDTO {
    private String remoteId;
    private String problemId;
    private String verdict;
    private String language;
    private LocalDateTime submissionTime;
}
