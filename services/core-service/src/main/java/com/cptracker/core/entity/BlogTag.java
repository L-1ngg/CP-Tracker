package com.cptracker.core.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "blog_tags")
public class BlogTag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String name;
}
