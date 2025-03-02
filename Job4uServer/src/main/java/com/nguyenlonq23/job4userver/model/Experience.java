package com.nguyenlonq23.job4userver.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "experiences")
public class Experience {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "experience_name", nullable = false, unique = true)
    private String experienceName;

}