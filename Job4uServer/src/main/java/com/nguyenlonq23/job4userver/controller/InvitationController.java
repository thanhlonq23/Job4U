package com.nguyenlonq23.job4userver.controller;

import com.nguyenlonq23.job4userver.dto.response.ApiResponse;
import com.nguyenlonq23.job4userver.service.InvitationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/invitation")
public class InvitationController {

    private final InvitationService invitationService;

    public InvitationController(InvitationService invitationService) {
        this.invitationService = invitationService;
    }

    @PostMapping("/invite-staff")
    public ResponseEntity<ApiResponse<String>> inviteStaff(@Valid @RequestBody Map<String, String> request) {
        try {
            String ownerEmail = request.get("ownerEmail");
            String staffEmail = request.get("staffEmail");
            invitationService.inviteStaff(ownerEmail, staffEmail);
            return buildResponse("SUCCESS", "Lời mời đã được gửi!", null, HttpStatus.OK);
        } catch (Exception e) {
            return buildResponse("ERROR", e.getMessage(), null, HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/confirm-invitation")
    public ResponseEntity<ApiResponse<String>> confirmInvitation(@RequestBody Map<String, String> request) {
        try {
            String token = request.get("token");
            boolean accept = Boolean.parseBoolean(request.get("accept"));
            invitationService.confirmInvitation(token, accept);
            String message = accept ? "Bạn đã gia nhập công ty thành công!" : "Bạn đã từ chối lời mời.";
            return buildResponse("SUCCESS", message, null, HttpStatus.OK);
        } catch (Exception e) {
            return buildResponse("ERROR", e.getMessage(), null, HttpStatus.BAD_REQUEST);
        }
    }

    private <T> ResponseEntity<ApiResponse<T>> buildResponse(String status, String message, T data, HttpStatus httpStatus) {
        ApiResponse<T> response = new ApiResponse<>(status, message, data);
        return ResponseEntity.status(httpStatus).body(response);
    }
}