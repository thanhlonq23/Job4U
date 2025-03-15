package com.nguyenlonq23.job4userver.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PostDTO {
    private int id;
    private String name;
    private String description_Markdown;
    private int amount;
    private String categoryName;
    private String locationName;
    private String salaryRange;
    private String jobLevelName;
    private String workTypeName;
    private String experienceName;
    private String companyName;
    private String companyLogo;
    private Date expirationDate;
    private Date createdAt;
    private Date updatedAt;
}