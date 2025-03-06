package com.nguyenlonq23.job4userver.model.entity;

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

    @Column(name = "description_HTML", columnDefinition = "LONGTEXT")
    private String description_HTML;

    @Column(name = "description_Markdown", columnDefinition = "LONGTEXT")
    private String description_Markdown;

    @ManyToOne
    @JoinColumn(name = "status_id")
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
    @JoinColumn(name = "user_id")
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

    public Post(String post_name, String descriptionHTML, String descriptionMarkdown, Status status, Category category, Location location, Salary salary, JobLevel jobLevel, WorkType workType, Experience experience, User user, Company company) {
        this.name = post_name;
        this.description_HTML = descriptionHTML;
        this.description_Markdown = descriptionMarkdown;
        this.status = status;
        this.category = category;
        this.location = location;
        this.salary = salary;
        this.jobLevel = jobLevel;
        this.workType = workType;
        this.experience = experience;
        this.user = user;
        this.company = company;
    }
}
