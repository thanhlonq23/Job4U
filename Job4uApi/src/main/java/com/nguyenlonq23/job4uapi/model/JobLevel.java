package com.nguyenlonq23.job4uapi.model;

import jakarta.persistence.*;

import java.util.Objects;

@Entity
@Table(name = "joblevels")
public class JobLevel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "joblevel_name", nullable = false)
    private String joblevelName;

    // Getters and Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getJoblevelName() {
        return joblevelName;
    }

    public void setJoblevelName(String joblevelName) {
        this.joblevelName = joblevelName;
    }

    @Override
    public String toString() {
        return "JobLevel{" +
                "id=" + id +
                ", joblevelName='" + joblevelName + '\'' +
                '}';
    }

}