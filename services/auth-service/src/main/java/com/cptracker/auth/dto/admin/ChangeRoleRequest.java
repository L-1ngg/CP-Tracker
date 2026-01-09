package com.cptracker.auth.dto.admin;

import com.cptracker.auth.enums.UserRole;
import lombok.Data;

@Data
public class ChangeRoleRequest {
    private Long userId;
    private UserRole role;
}
