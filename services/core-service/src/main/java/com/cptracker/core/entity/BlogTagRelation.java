package com.cptracker.core.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.io.Serializable;

@Data
@Entity
@Table(name = "blog_tag_relations")
@IdClass(BlogTagRelation.BlogTagRelationId.class)
public class BlogTagRelation {

    @Id
    @Column(name = "blog_id")
    private Long blogId;

    @Id
    @Column(name = "tag_id")
    private Long tagId;

    @Data
    public static class BlogTagRelationId implements Serializable {
        private Long blogId;
        private Long tagId;
    }
}
