package com.cptracker.core.dto;

import lombok.Data;

@Data
public class ReviewBlogRequest {
    private Long blogId;
    private String action;
    private String comment;
}
