package com.cptracker.auth.controller.admin;

import com.cptracker.auth.dto.admin.*;
import com.cptracker.auth.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @PostMapping("/mute")
    public ResponseEntity<Void> muteUser(@RequestBody MuteUserRequest request) {
        adminService.muteUser(request);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/unmute/{userId}")
    public ResponseEntity<Void> unmuteUser(@PathVariable Long userId) {
        adminService.unmuteUser(userId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/ban")
    public ResponseEntity<Void> banUser(@RequestBody BanUserRequest request) {
        adminService.banUser(request);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/unban/{userId}")
    public ResponseEntity<Void> unbanUser(@PathVariable Long userId) {
        adminService.unbanUser(userId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/role")
    public ResponseEntity<Void> changeRole(@RequestBody ChangeRoleRequest request) {
        adminService.changeRole(request);
        return ResponseEntity.ok().build();
    }
}
