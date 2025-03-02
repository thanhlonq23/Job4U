package com.nguyenlonq23.job4userver.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "joblevels")
public class JobLevel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "joblevel_name", nullable = false, unique = true)
    private String joblevelName;
}