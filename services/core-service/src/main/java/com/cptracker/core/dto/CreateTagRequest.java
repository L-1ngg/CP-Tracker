package com.cptracker.core.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreateTagRequest {

    @NotBlank(message = "标签名不能为空")
    @Size(max = 50, message = "标签名不能超过50字")
    private String name;
}
