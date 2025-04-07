package com.nguyenlonq23.job4userver.dto;

import com.nguyenlonq23.job4userver.model.enums.PostStatus;
import lombok.Data;

import java.util.Date;

@Data
public class PostAdminPageDTO {
    private int id;
    private String name;
    private String companyName;
    private String category;
    private String jobLevel;
    private String workType;
    private Date expirationDate;
    private PostStatus status;

    public PostAdminPageDTO(int id, String name, String companyName, String category, String jobLevel, String workType, Date expirationDate, PostStatus status) {
        this.id = id;
        this.name = name;
        this.companyName = companyName;
        this.category = category;
        this.jobLevel = jobLevel;
        this.workType = workType;
        this.expirationDate = expirationDate;
        this.status = status;
    }
}
