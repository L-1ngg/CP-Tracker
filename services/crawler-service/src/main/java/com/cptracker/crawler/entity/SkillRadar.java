package com.cptracker.crawler.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.Filter;

@Data
@Entity
@Table(name = "skill_radar", schema = "analytics")
@Filter(name = "userFilter", condition = "user_id = :userId")
public class SkillRadar {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    private String tag;

    private Double rating = 0.0;

    @Column(name = "solved_count")
    private Integer solvedCount = 0;
}
