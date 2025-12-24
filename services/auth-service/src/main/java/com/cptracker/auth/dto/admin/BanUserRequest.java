package com.cptracker.auth.dto.admin;

import lombok.Data;

@Data
public class BanUserRequest {
    private Long userId;
    private String reason;
}
