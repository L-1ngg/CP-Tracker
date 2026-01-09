package com.cptracker.auth.entity;

import com.cptracker.auth.enums.UserRole;
import com.cptracker.auth.enums.UserStatus;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String username;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(name = "avatar_url", length = 500)
    private String avatarUrl;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private UserRole role = UserRole.USER;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private UserStatus status = UserStatus.ACTIVE;

    @Column(name = "mute_until")
    private LocalDateTime muteUntil;

    @Column(name = "ban_reason")
    private String banReason;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public boolean isMuted() {
        return muteUntil != null && muteUntil.isAfter(LocalDateTime.now());
    }

    public boolean isBanned() {
        return UserStatus.BANNED == status;
    }

    public boolean isAdmin() {
        return UserRole.ADMIN == role;
    }

    public boolean isModerator() {
        return UserRole.MODERATOR == role || isAdmin();
    }
}
