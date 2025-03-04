package com.nguyenlonq23.job4userver.model.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Data
@Entity
@Table(name = "cvs")
public class CV {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "post_id")
    private Post post;

    @Lob
    @Column(name = "file")
    private byte[] file;

    @Column(name = "description")
    private String description;

    @Column(name = "isChecked", nullable = false)
    private boolean isChecked;

    @Column(name = "createdAt", nullable = false)
    private Date createdAt;

    @Column(name = "updatedAt", nullable = false)
    private Date updatedAt;

    public CV() {
    }

    public CV(User user, Post post, byte[] file, String description, Date createdAt, Date updatedAt) {
        this.user = user;
        this.post = post;
        this.file = file;
        this.description = description;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}