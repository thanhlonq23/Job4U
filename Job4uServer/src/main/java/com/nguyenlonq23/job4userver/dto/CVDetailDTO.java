package com.nguyenlonq23.job4userver.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CVDetailDTO {
    private int id;
    private String file;
    private String description;
}