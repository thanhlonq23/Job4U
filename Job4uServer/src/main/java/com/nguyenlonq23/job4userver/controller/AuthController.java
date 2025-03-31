package com.nguyenlonq23.job4userver.controller;

import com.nguyenlonq23.job4userver.dto.response.ApiResponse;
import com.nguyenlonq23.job4userver.dto.response.AuthResponse;
import com.nguyenlonq23.job4userver.dto.request.LoginRequest;
import com.nguyenlonq23.job4userver.dto.request.RegisterRequest;
import com.nguyenlonq23.job4userver.service.AuthService;
import com.nguyenlonq23.job4userver.service.EmailService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@Validated
public class AuthController {

    private final AuthService authService;
    private final EmailService emailService;

    public AuthController(AuthService authService, EmailService emailService) {
        this.authService = authService;
        this.emailService = emailService;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest registerRequest) {
        try {
            // Kiểm tra xem email đã được xác minh OTP chưa (có thể dùng một flag hoặc kiểm tra logic khác)
            AuthResponse authResponse = authService.register(registerRequest);
            return buildResponse("SUCCESS", "User registered successfully", authResponse, HttpStatus.OK);
        } catch (Exception e) {
            return buildResponse("ERROR", e.getMessage(), null, HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            AuthResponse authResponse = authService.login(loginRequest);
            return buildResponse("SUCCESS", "User logged in successfully", authResponse, HttpStatus.OK);
        } catch (Exception e) {
            return buildResponse("ERROR", e.getMessage(), null, HttpStatus.UNAUTHORIZED);
        }
    }

    @PostMapping("/email")
    public ResponseEntity<ApiResponse<Void>> sendEmail() {
        try {
            emailService.sendEmail("longdaz2003@gmail.com", "Email Subject", "Hello world!!!");
            return buildResponse("SUCCESS", "Email sent successfully", null, HttpStatus.OK);
        } catch (Exception e) {
            return buildResponse("ERROR", "Failed to send email", null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/send-otp")
    public ResponseEntity<ApiResponse<String>> sendOTP(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            authService.generateAndSendOTP(email);
            return buildResponse("SUCCESS", "OTP đã được gửi đến email của bạn.", null, HttpStatus.OK);
        } catch (Exception e) {
            return buildResponse("ERROR", e.getMessage(), null, HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<ApiResponse<String>> verifyOTP(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String otp = request.get("otp");
            boolean isValid = authService.verifyOTP(email, otp);
            if (isValid) {
                return buildResponse("SUCCESS", "Xác minh OTP thành công.", null, HttpStatus.OK);
            }
            return buildResponse("ERROR", "Xác minh OTP thất bại.", null, HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return buildResponse("ERROR", e.getMessage(), null, HttpStatus.BAD_REQUEST);
        }
    }

    private <T> ResponseEntity<ApiResponse<T>> buildResponse(String status, String message, T data, HttpStatus httpStatus) {
        ApiResponse<T> response = new ApiResponse<>(status, message, data);
        return ResponseEntity.status(httpStatus).body(response);
    }
}
