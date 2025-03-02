package com.nguyenlonq23.job4userver.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "worktypes")
public class WorkType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "worktype_name", nullable = false, unique = true)
    private String worktypeName;
}