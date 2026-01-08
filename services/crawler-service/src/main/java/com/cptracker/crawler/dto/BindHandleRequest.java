package com.cptracker.crawler.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class BindHandleRequest {

    @NotBlank(message = "平台不能为空")
    private String platform;

    @NotBlank(message = "账号不能为空")
    private String handle;
}
