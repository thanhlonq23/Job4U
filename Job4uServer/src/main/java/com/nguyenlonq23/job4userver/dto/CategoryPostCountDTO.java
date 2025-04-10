package com.nguyenlonq23.job4userver.dto;

import lombok.Data;

@Data
public class CategoryPostCountDTO {
    private int id;
    private String name;
    private String image;
    private Long postCount;

    public CategoryPostCountDTO(int id, String name, String image, Long postCount) {
        this.id = id;
        this.name = name;
        this.image = image;
        this.postCount = postCount;
    }
}