package com.cptracker.core.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreateBlogRequest {

    @NotBlank(message = "标题不能为空")
    @Size(max = 200, message = "标题长度不能超过200")
    private String title;

    @Size(max = 500, message = "摘要长度不能超过500")
    private String summary;

    @NotBlank(message = "内容不能为空")
    private String content;

    @Size(max = 500, message = "封面URL长度不能超过500")
    private String coverUrl;
}
