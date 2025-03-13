package com.nguyenlonq23.job4userver.dto;

import com.nguyenlonq23.job4userver.model.enums.PostStatus;
import lombok.Data;

import java.util.Date;

@Data
public class PostSummaryDTO {
    private int id;
    private String name;
    private String conpanyName;
    private String companyLogo;
    private String jobLevel;
    private String workType;
    private String salary;
    private String address;
    private Date createAt;
    private PostStatus status;

    // Constructors
    public PostSummaryDTO() {
    }

    public PostSummaryDTO(int id, String name, String conpanyName, String companyLogo, String jobLevel, String workType, String salary, String address, Date createAt, PostStatus status) {
        this.id = id;
        this.name = name;
        this.conpanyName = conpanyName;
        this.companyLogo = companyLogo;
        this.jobLevel = jobLevel;
        this.workType = workType;
        this.salary = salary;
        this.address = address;
        this.createAt = createAt;
        this.status = status;
    }
}