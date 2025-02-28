package com.nguyenlonq23.job4uapi.model;

import jakarta.persistence.*;

import java.util.Objects;

@Entity
@Table(name = "salaries")
public class Salary {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "salary_range", nullable = false)
    private String salaryRange;

    // Getters and Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getSalaryRange() {
        return salaryRange;
    }

    public void setSalaryRange(String salaryRange) {
        this.salaryRange = salaryRange;
    }

    @Override
    public String toString() {
        return "Salary{" +
                "id=" + id +
                ", salaryRange='" + salaryRange + '\'' +
                '}';
    }
}