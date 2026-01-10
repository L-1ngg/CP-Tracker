package com.cptracker.analysis.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.Filter;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "user_rating", schema = "analytics")
@Filter(name = "userFilter", condition = "user_id = :userId")
public class UserRating {

    @Id
    @Column(name = "user_id")
    private Long userId;

    @Column(name = "unified_rating")
    private Integer unifiedRating = 0;

    @Column(name = "cf_rating")
    private Integer cfRating;

    @Column(name = "nk_rating")
    private Integer nkRating;

    @Column(name = "at_rating")
    private Integer atRating;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
