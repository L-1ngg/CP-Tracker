package com.cptracker.analysis.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.Filter;
import org.hibernate.annotations.FilterDef;
import org.hibernate.annotations.ParamDef;

import java.time.LocalDate;

@Data
@Entity
@Table(name = "daily_activity", schema = "analytics")
@IdClass(DailyActivityId.class)
@FilterDef(name = "userFilter", parameters = @ParamDef(name = "userId", type = Long.class))
@Filter(name = "userFilter", condition = "user_id = :userId")
public class DailyActivity {

    @Id
    @Column(name = "user_id")
    private Long userId;

    @Id
    @Column(name = "\"date\"")
    private LocalDate date;

    private Integer count = 0;

    @Column(name = "platform_breakdown", columnDefinition = "jsonb")
    private String platformBreakdown;
}
