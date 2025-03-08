package com.nguyenlonq23.job4userver.controller;

import com.nguyenlonq23.job4userver.dto.response.ApiResponse;
import com.nguyenlonq23.job4userver.dto.response.AuthResponse;
import com.nguyenlonq23.job4userver.dto.request.LoginRequest;
import com.nguyenlonq23.job4userver.dto.request.RegisterRequest;
import com.nguyenlonq23.job4userver.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@RequestBody RegisterRequest registerRequest) {
        try {
            AuthResponse authResponse = authService.register(registerRequest);
            ApiResponse<AuthResponse> apiResponse = new ApiResponse<>(
                    "SUCCESS",
                    "User registered successfully",
                    authResponse
            );
            return ResponseEntity.ok(apiResponse);
        } catch (Exception e) {
            ApiResponse<AuthResponse> apiResponse = new ApiResponse<>(
                    "ERROR",
                    e.getMessage(),
                    null
            );
            return ResponseEntity.badRequest().body(apiResponse);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@RequestBody LoginRequest loginRequest) {
        try {
            AuthResponse authResponse = authService.login(loginRequest);
            ApiResponse<AuthResponse> apiResponse = new ApiResponse<>(
                    "SUCCESS",
                    "User logged in successfully",
                    authResponse
            );
            return ResponseEntity.ok(apiResponse);
        } catch (Exception e) {
            ApiResponse<AuthResponse> apiResponse = new ApiResponse<>(
                    "ERROR",
                    e.getMessage(),
                    null
            );
            return ResponseEntity.status(401).body(apiResponse); // 401 Unauthorized
        }
    }


}