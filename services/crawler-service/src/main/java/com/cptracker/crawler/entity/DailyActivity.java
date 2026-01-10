package com.cptracker.crawler.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.Filter;
import org.hibernate.annotations.FilterDef;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.ParamDef;
import org.hibernate.type.SqlTypes;

import java.time.LocalDate;
import java.util.Map;

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

    private Integer count;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "platform_breakdown", columnDefinition = "jsonb")
    private Map<String, Integer> platformBreakdown;
}
