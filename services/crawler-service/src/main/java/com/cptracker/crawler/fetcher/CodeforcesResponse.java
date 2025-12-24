package com.cptracker.crawler.fetcher;

import lombok.Data;
import java.util.List;

@Data
public class CodeforcesResponse {
    private String status;
    private List<CfUser> result;

    @Data
    public static class CfUser {
        private String handle;
        private Integer rating;
        private Integer maxRating;
        private String rank;
    }
}
