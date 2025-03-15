package com.nguyenlonq23.job4userver.dto;

import com.nguyenlonq23.job4userver.model.enums.PostStatus;
import lombok.Data;

import java.util.Date;

@Data
public class PostAdminDTO {
    private int id;
    private String name;
    private String jobType;
    private String conpanyName;
    private Date expirationDate;
    private PostStatus status;

    public PostAdminDTO() {
    }


}
