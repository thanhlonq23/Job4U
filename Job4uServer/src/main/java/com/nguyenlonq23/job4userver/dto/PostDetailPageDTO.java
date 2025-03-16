package com.nguyenlonq23.job4userver.dto;

import lombok.Data;

import java.util.Date;

@Data
public class PostDetailPageDTO {
    private String name;
    private String descriptionMarkdown;
    private LocationDTO location;
    private SalaryDTO salary;
    private JobLevelDTO jobLevel;
    private WorkTypeDTO workType;
    private ExperienceDTO experience;
    private Date expirationDate;
    private int amount;
    private CompanyDTO company;

    @Data
    public static class LocationDTO {
        private Integer id;
        private String name;
    }

    @Data
    public static class SalaryDTO {
        private Integer id;
        private String name;
    }

    @Data
    public static class JobLevelDTO {
        private Integer id;
        private String name;
    }

    @Data
    public static class WorkTypeDTO {
        private Integer id;
        private String name;
    }

    @Data
    public static class ExperienceDTO {
        private Integer id;
        private String name;
    }

    @Data
    public static class CompanyDTO {
        private Integer id;
        private String name;
        private String thumbnail;
        private String coverImage;
        private String website;
        private String address;
        private String email;
    }
}