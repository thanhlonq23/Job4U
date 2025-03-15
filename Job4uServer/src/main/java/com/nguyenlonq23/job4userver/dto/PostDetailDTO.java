package com.nguyenlonq23.job4userver.dto;

import com.nguyenlonq23.job4userver.model.entity.*;
import com.nguyenlonq23.job4userver.model.enums.PostStatus;
import lombok.Data;

import java.util.Date;

@Data
public class PostDetailDTO {
    private int id;
    private String name;
    private int amount;
    private String description;
    private Location location;
    private Category category;
    private JobLevel jobLevel;
    private WorkType workType;
    private Salary salary;
    private Experience experience;
    private String posterFistName;
    private String posterLastName;
    private Date expirationDate;
    private PostStatus status;

    public PostDetailDTO(int id, String name, int amount, String description, Location location, Category category, JobLevel jobLevel, WorkType workType, Salary salary, Experience experience, String posterFistName, String posterLastName, Date expirationDate, PostStatus status) {
        this.id = id;
        this.name = name;
        this.amount = amount;
        this.description = description;
        this.location = location;
        this.category = category;
        this.jobLevel = jobLevel;
        this.workType = workType;
        this.salary = salary;
        this.experience = experience;
        this.posterFistName = posterFistName;
        this.posterLastName = posterLastName;
        this.expirationDate = expirationDate;
        this.status = status;
    }
}
