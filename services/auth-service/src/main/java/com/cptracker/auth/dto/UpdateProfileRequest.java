package com.cptracker.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateProfileRequest {

    @Size(min = 2, max = 50, message = "用户名长度必须在2-50之间")
    private String username;

    @Email(message = "邮箱格式不正确")
    private String email;
}
