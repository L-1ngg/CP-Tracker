package com.cptracker.core.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "blog_likes", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"blog_id", "user_id"})
})
public class BlogLike {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "blog_id", nullable = false)
    private Long blogId;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
