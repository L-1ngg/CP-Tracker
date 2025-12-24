package com.cptracker.analysis.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "daily_activity", schema = "analytics")
@IdClass(DailyActivityId.class)
public class DailyActivity {

    @Id
    @Column(name = "user_id")
    private Long userId;

    @Id
    private LocalDate date;

    private Integer count = 0;

    @Column(name = "platform_breakdown", columnDefinition = "jsonb")
    private String platformBreakdown;
}
