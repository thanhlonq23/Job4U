package com.nguyenlonq23.job4userver.dto.request;

import com.nguyenlonq23.job4userver.model.enums.Gender;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {
    private String email;
    private String password;
    private String firstName;
    private String lastName;
    private String address;
    private Date dob;
    private Gender gender;
    private boolean isEmployer;
    private String companyName;
}