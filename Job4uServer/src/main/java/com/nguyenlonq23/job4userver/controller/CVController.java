package com.nguyenlonq23.job4userver.controller;

import com.nguyenlonq23.job4userver.dto.response.ApiResponse;
import com.nguyenlonq23.job4userver.model.entity.CV;
import com.nguyenlonq23.job4userver.service.CVService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/cv")
public class CVController {

    private CVService cvService;

    @Autowired
    public CVController(CVService cvService) {
        this.cvService = cvService;
    }

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<CV>> createCV(
            @RequestParam("userId") Integer userId,
            @RequestParam("postId") Integer postId,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "description", required = false) String description) {

        // Kiểm tra các tham số bắt buộc
        if (userId == null) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(
                    "ERROR",
                    "User ID cannot be empty",
                    null
            ));
        }

        if (postId == null) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(
                    "ERROR",
                    "Post ID cannot be empty",
                    null
            ));
        }

        if (file == null || file.isEmpty()) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(
                    "ERROR",
                    "CV file cannot be empty",
                    null
            ));
        }

        try {
            // Chuyển đổi MultipartFile thành byte[]
            byte[] fileData = file.getBytes();

            // Tạo mới đối tượng CV
            CV cv = new CV();

            // Lưu CV với dữ liệu đã cung cấp
            CV savedCV = cvService.saveCV(cv, userId, postId, fileData, description);

            return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponse<>(
                    "SUCCESS",
                    "Successfully created the CV",
                    savedCV
            ));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiResponse<>(
                    "ERROR",
                    "Failed to process file: " + e.getMessage(),
                    null
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(
                    "ERROR",
                    e.getMessage(),
                    null
            ));
        }
    }
}