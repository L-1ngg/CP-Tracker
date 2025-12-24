package com.cptracker.auth.dto.admin;

import lombok.Data;

@Data
public class ChangeRoleRequest {
    private Long userId;
    private String role;
}
