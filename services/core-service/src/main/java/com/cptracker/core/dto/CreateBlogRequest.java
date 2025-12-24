package com.cptracker.core.dto;

import lombok.Data;

@Data
public class CreateBlogRequest {
    private String title;
    private String summary;
    private String content;
    private String coverUrl;
}
