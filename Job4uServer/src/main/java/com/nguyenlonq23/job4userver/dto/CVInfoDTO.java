package com.nguyenlonq23.job4userver.dto;

import com.nguyenlonq23.job4userver.model.entity.CV;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CVInfoDTO {
    private int id;
    private String firstName;
    private String lastName;
    private String email;
    private String address;
    private boolean isChecked;

    public CVInfoDTO(CV cv) {
        this.id = cv.getId();
        this.firstName = cv.getUser().getFirst_name();
        this.lastName = cv.getUser().getLast_name();
        this.email = cv.getUser().getEmail();
        this.address = cv.getUser().getAddress();
        this.isChecked = cv.isChecked();
    }
}