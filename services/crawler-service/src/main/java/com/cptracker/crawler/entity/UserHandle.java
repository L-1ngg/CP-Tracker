package com.cptracker.crawler.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.Filter;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "user_handles", schema = "crawler")
@IdClass(UserHandleId.class)
@Filter(name = "userFilter", condition = "user_id = :userId")
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
