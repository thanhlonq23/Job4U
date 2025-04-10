package com.nguyenlonq23.job4userver.dto;

import lombok.Data;

@Data
public class CompanyDTO {
    private int id;
    private String name;
    private String thumbnail;
    private String coverImage;
    private String description_Markdown;

    public CompanyDTO(int id, String name, String thumbnail, String coverImage, String description_Markdown) {
        this.id = id;
        this.name = name;
        this.thumbnail = thumbnail;
        this.coverImage = coverImage;
        this.description_Markdown = description_Markdown;
    }
}