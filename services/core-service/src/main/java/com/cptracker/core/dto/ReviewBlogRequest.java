package com.cptracker.core.dto;

import com.cptracker.core.enums.ReviewAction;
import lombok.Data;

@Data
public class ReviewBlogRequest {
    private Long blogId;
    private ReviewAction action;
    private String comment;
}
