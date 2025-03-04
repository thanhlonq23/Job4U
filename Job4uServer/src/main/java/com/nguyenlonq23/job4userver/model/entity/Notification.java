package com.nguyenlonq23.job4userver.model.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Data
@Entity
@Table(name = "notifications")
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "info")
    private String info;

    @Column(name = "isChecked")
    private boolean isChecked;

    @Column(name = "createdAt", nullable = false)
    private Date createdAt;

    @Column(name = "updatedAt", nullable = false)
    private Date updatedAt;

    public Notification() {
    }

    public Notification(Date createdAt, User user, String info, boolean isChecked, Date updatedAt) {
        this.createdAt = createdAt;
        this.user = user;
        this.info = info;
        this.isChecked = isChecked;
        this.updatedAt = updatedAt;
    }
}