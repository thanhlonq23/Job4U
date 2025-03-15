package com.nguyenlonq23.job4userver.model.entity;

import com.nguyenlonq23.job4userver.model.enums.PostStatus;
import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Data
@Entity
@Table(name = "posts")
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description_Markdown", columnDefinition = "LONGTEXT")
    private String description_Markdown;

    @Column(name = "amount", nullable = false)
    private int amount;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private PostStatus status;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    @ManyToOne
    @JoinColumn(name = "address_id")
    private Location location;

    @ManyToOne
    @JoinColumn(name = "salary_id")
    private Salary salary;

    @ManyToOne
    @JoinColumn(name = "joblevel_id")
    private JobLevel jobLevel;

    @ManyToOne
    @JoinColumn(name = "worktype_id")
    private WorkType workType;

    @ManyToOne
    @JoinColumn(name = "experience_id")
    private Experience experience;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "company_id")
    private Company company;

    @Column(name = "expiration_date", nullable = false)
    private Date expiration_date;

    @Column(name = "createdAt", nullable = false)
    private Date createdAt;

    @Column(name = "updatedAt", nullable = false)
    private Date updatedAt;
}
