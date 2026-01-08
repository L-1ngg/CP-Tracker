package com.cptracker.crawler.entity;

import lombok.Data;

import java.io.Serializable;
import java.time.LocalDate;

@Data
public class DailyActivityId implements Serializable {
    private Long userId;
    private LocalDate date;
}
