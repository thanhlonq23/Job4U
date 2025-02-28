package com.nguyenlonq23.job4uapi.model;

import jakarta.persistence.*;

import java.util.Date;

@Entity
@Table(name = "posts")
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "name")
    private String name;

    @Column(name = "descriptionHTML")
    private String descriptionHTML;

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

    @Column(name = "genderPostCode")
    private int genderPostCode;

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

    public Post(String name, String descriptionHTML, Status status, Category category, Location location, Salary salary, JobLevel jobLevel, WorkType workType, Experience experience, int genderPostCode, User user, Company company, Date createdAt, Date updatedAt) {
        this.name = name;
        this.descriptionHTML = descriptionHTML;
        this.status = status;
        this.category = category;
        this.location = location;
        this.salary = salary;
        this.jobLevel = jobLevel;
        this.workType = workType;
        this.experience = experience;
        this.genderPostCode = genderPostCode;
        this.user = user;
        this.company = company;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescriptionHTML() {
        return descriptionHTML;
    }

    public void setDescriptionHTML(String descriptionHTML) {
        this.descriptionHTML = descriptionHTML;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public Location getLocation() {
        return location;
    }

    public void setLocation(Location location) {
        this.location = location;
    }

    public Salary getSalary() {
        return salary;
    }

    public void setSalary(Salary salary) {
        this.salary = salary;
    }

    public JobLevel getJobLevel() {
        return jobLevel;
    }

    public void setJobLevel(JobLevel jobLevel) {
        this.jobLevel = jobLevel;
    }

    public WorkType getWorkType() {
        return workType;
    }

    public void setWorkType(WorkType workType) {
        this.workType = workType;
    }

    public Experience getExperience() {
        return experience;
    }

    public void setExperience(Experience experience) {
        this.experience = experience;
    }

    public int getGenderPostCode() {
        return genderPostCode;
    }

    public void setGenderPostCode(int genderPostCode) {
        this.genderPostCode = genderPostCode;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Company getCompany() {
        return company;
    }

    public void setCompany(Company company) {
        this.company = company;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Date getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Date updatedAt) {
        this.updatedAt = updatedAt;
    }
}
