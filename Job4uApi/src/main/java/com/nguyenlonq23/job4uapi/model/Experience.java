package com.nguyenlonq23.job4uapi.model;

import jakarta.persistence.*;

import java.util.Objects;

@Entity
@Table(name = "experiences")
public class Experience {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "experience_name", nullable = false)
    private String experienceName;

    // Getters and Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getExperienceName() {
        return experienceName;
    }

    public void setExperienceName(String experienceName) {
        this.experienceName = experienceName;
    }

    @Override
    public String toString() {
        return "Experience{" +
                "id=" + id +
                ", experienceName='" + experienceName + '\'' +
                '}';
    }
}