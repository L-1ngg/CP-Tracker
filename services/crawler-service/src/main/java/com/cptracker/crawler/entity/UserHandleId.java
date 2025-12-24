package com.cptracker.crawler.entity;

import lombok.Data;
import java.io.Serializable;

@Data
public class UserHandleId implements Serializable {
    private Long userId;
    private String platform;
}
