package com.nguyenlonq23.job4userver.dto;

import com.nguyenlonq23.job4userver.model.enums.PostStatus;
import lombok.Data;

import java.util.Date;

@Data
public class PostAdminDTO {
    private int id;
    private String name;
    private String userName;
    private String conpanyName;
    private Date expirationDate;
    private PostStatus status;

    public PostAdminDTO() {
    }

    public PostAdminDTO(int id, String name, String userName, String conpanyName, Date expirationDate, PostStatus status) {
        this.id = id;
        this.name = name;
        this.userName = userName;
        this.conpanyName = conpanyName;
        this.expirationDate = expirationDate;
        this.status = status;
    }
}
