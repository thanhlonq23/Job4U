package com.nguyenlonq23.job4userver.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.nguyenlonq23.job4userver.model.enums.Gender;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserCompanyDTO {
    private int id;
    private String firstName;
    private String lastName;
    private String fullName;
    private String email;
    private String phoneNumber;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private Date dob;

    private Gender gender;
    private String roleName;
}