package com.cptracker.crawler.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "user_handles", schema = "crawler")
@IdClass(UserHandleId.class)
public class UserHandle {

    @Id
    @Column(name = "user_id")
    private Long userId;

    @Id
    private String platform;

    private String handle;

    @Column(name = "last_fetched")
    private LocalDateTime lastFetched;
}
