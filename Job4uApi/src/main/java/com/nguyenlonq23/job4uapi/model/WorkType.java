package com.nguyenlonq23.job4uapi.model;

import jakarta.persistence.*;

import java.util.Objects;

@Entity
@Table(name = "worktypes")
public class WorkType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "worktype_name", nullable = false)
    private String worktypeName;

    // Getters and Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getWorktypeName() {
        return worktypeName;
    }

    public void setWorktypeName(String worktypeName) {
        this.worktypeName = worktypeName;
    }

    // toString, equals, and hashCode
    @Override
    public String toString() {
        return "WorkType{" +
                "id=" + id +
                ", worktypeName='" + worktypeName + '\'' +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        WorkType workType = (WorkType) o;
        return id == workType.id && Objects.equals(worktypeName, workType.worktypeName);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, worktypeName);
    }
}