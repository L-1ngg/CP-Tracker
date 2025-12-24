package com.cptracker.crawler.fetcher;

import lombok.Data;

@Data
public class UserInfoDTO {
    private String handle;
    private Integer rating;
    private Integer maxRating;
    private String rank;
}
