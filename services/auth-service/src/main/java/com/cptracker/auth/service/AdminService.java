package com.cptracker.auth.service;

import com.cptracker.auth.dto.admin.*;
import com.cptracker.auth.entity.User;
import com.cptracker.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;

    @Transactional
    public void muteUser(MuteUserRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("用户不存在"));

        user.setMuteUntil(LocalDateTime.now().plusDays(request.getDays()));
        userRepository.save(user);
    }

    @Transactional
    public void unmuteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("用户不存在"));

        user.setMuteUntil(null);
        userRepository.save(user);
    }

    @Transactional
    public void banUser(BanUserRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("用户不存在"));

        user.setStatus("BANNED");
        user.setBanReason(request.getReason());
        userRepository.save(user);
    }

    @Transactional
    public void unbanUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("用户不存在"));

        user.setStatus("ACTIVE");
        user.setBanReason(null);
        userRepository.save(user);
    }

    @Transactional
    public void changeRole(ChangeRoleRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("用户不存在"));

        user.setRole(request.getRole());
        userRepository.save(user);
    }
}
