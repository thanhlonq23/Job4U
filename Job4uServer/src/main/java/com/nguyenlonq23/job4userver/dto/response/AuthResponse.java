package com.nguyenlonq23.job4userver.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private int userId;
    private String email;
    private String fullName;
    private String role;
}