package com.cptracker.crawler.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class UserHandleDTO {

    private Long userId;
    private String platform;
    private String handle;
    private LocalDateTime lastFetched;

    // 平台用户信息（可选）
    private Integer rating;
    private Integer maxRating;
    private String rank;
}
