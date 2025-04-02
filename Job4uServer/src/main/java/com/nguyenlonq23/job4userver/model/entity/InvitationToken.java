package com.nguyenlonq23.job4userver.model.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Data
@Entity
@Table(name = "invitation_tokens")
public class InvitationToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "token", nullable = false, unique = true)
    private String token;

    @Column(name = "email", nullable = false)
    private String email; // Email của user được mời

    @ManyToOne
    @JoinColumn(name = "company_id", nullable = false)
    private Company company; // Công ty của EMPLOYER_OWNER

    @Column(name = "created_at", nullable = false)
    private Date createdAt;

    @Column(name = "expires_at", nullable = false)
    private Date expiresAt;

    @Column(name = "used", nullable = false)
    private boolean used = false; // Token đã được sử dụng hay chưa

    @PrePersist
    protected void onCreate() {
        createdAt = new Date();
        expiresAt = new Date(createdAt.getTime() + 24 * 60 * 60 * 1000); // 1 ngày
    }
}