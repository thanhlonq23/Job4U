package com.nguyenlonq23.job4userver.model;

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

    @Column(name = "descriptionHTML")
    private String descriptionHTML;

    @Column(name = "descriptionMarkdown", columnDefinition = "LONGTEXT")
    private String descriptionMarkdown;

    @ManyToOne
    @JoinColumn(name = "statusId")
    private Status status;

    @ManyToOne
    @JoinColumn(name = "category_job_id")
    private Category category;

    @ManyToOne
    @JoinColumn(name = "address_id")
    private Location location;

    @ManyToOne
    @JoinColumn(name = "salary_job_id")
    private Salary salary;

    @ManyToOne
    @JoinColumn(name = "category_joblevel_id")
    private JobLevel jobLevel;

    @ManyToOne
    @JoinColumn(name = "category_worktype_id")
    private WorkType workType;

    @ManyToOne
    @JoinColumn(name = "experience_job_id")
    private Experience experience;

    @ManyToOne
    @JoinColumn(name = "userId")
    private User user;

    @ManyToOne
    @JoinColumn(name = "company_id")
    private Company company;

    @Column(name = "createdAt", nullable = false)
    private Date createdAt;

    @Column(name = "updatedAt", nullable = false)
    private Date updatedAt;

    public Post() {
    }

    public Post(String name, String descriptionHTML, Status status, Category category, Location location, Salary salary, JobLevel jobLevel, WorkType workType, Experience experience, User user, Company company, Date createdAt, Date updatedAt) {
        this.name = name;
        this.descriptionHTML = descriptionHTML;
        this.status = status;
        this.category = category;
        this.location = location;
        this.salary = salary;
        this.jobLevel = jobLevel;
        this.workType = workType;
        this.experience = experience;
        this.user = user;
        this.company = company;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
