package com.cptracker.auth.dto.admin;

import lombok.Data;

@Data
public class MuteUserRequest {
    private Long userId;
    private Integer days;
    private String reason;
}
