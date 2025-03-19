package com.nguyenlonq23.job4userver.controller;

import com.nguyenlonq23.job4userver.dto.CVCandidateDTO;
import com.nguyenlonq23.job4userver.dto.CVDetailDTO;
import com.nguyenlonq23.job4userver.dto.CVInfoDTO;
import com.nguyenlonq23.job4userver.dto.response.ApiResponse;
import com.nguyenlonq23.job4userver.model.entity.CV;
import com.nguyenlonq23.job4userver.service.CVService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/cv")
public class CVController {

    private final CVService cvService;

    @Autowired
    public CVController(CVService cvService) {
        this.cvService = cvService;
    }

    // Lấy danh sách CV theo postId không phân trang
    @GetMapping("/post/{postId}")
    public ResponseEntity<ApiResponse<List<CVInfoDTO>>> getCVInfoByPostId(@PathVariable("postId") Integer postId) {
        List<CVInfoDTO> cvInfoList = cvService.getCVInfoByPostId(postId);
        return ResponseEntity.ok(new ApiResponse<>(
                "SUCCESS",
                "Successfully retrieved CV list for post",
                cvInfoList
        ));
    }

    // Lấy danh sách CV theo postId với phân trang và lọc
    @GetMapping("/page")
    public ResponseEntity<ApiResponse<Page<CVInfoDTO>>> getCVInfoWithPaginationAndFilter(
            @RequestParam(value = "postId", required = true) Integer postId,
            @RequestParam(value = "keyword", required = false, defaultValue = "") String keyword,
            Pageable pageable
    ) {
        try {
            Page<CVInfoDTO> cvInfoPage = cvService.getCVInfoWithPaginationAndFilter(postId, keyword, pageable);

            if (cvInfoPage.isEmpty()) {
                return ResponseEntity.ok(new ApiResponse<>(
                        "SUCCESS",
                        "No CVs found matching the criteria",
                        cvInfoPage
                ));
            }

            return ResponseEntity.ok(new ApiResponse<>(
                    "SUCCESS",
                    "Successfully retrieved the list of CVs",
                    cvInfoPage
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ApiResponse<>(
                    "ERROR",
                    "An error occurred while retrieving CVs: " + e.getMessage(),
                    null
            ));
        }
    }

    @GetMapping("/get-all-cv-by-userId")
    public ResponseEntity<ApiResponse<Page<CVCandidateDTO>>> getAllCVsByUserId(
            @RequestParam Integer userId,
            Pageable pageable) {
        try {
            if (userId == null || userId <= 0) {
                return ResponseEntity.badRequest().body(new ApiResponse<>(
                        "ERROR",
                        "Invalid userId",
                        null
                ));
            }

            Page<CVCandidateDTO> cvPage = cvService.getAllCVsByUserId(userId, pageable);

            if (cvPage.isEmpty()) {
                return ResponseEntity.ok(new ApiResponse<>(
                        "SUCCESS",
                        "No CVs found for this user",
                        cvPage
                ));
            }

            return ResponseEntity.ok(new ApiResponse<>(
                    "SUCCESS",
                    "Successfully retrieved CVs for userId: " + userId,
                    cvPage
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ApiResponse<>(
                    "ERROR",
                    "An error occurred while retrieving CVs: " + e.getMessage(),
                    null
            ));
        }
    }

    @GetMapping("/get-detail-cv-by-id")
    public ResponseEntity<ApiResponse<CVDetailDTO>> getDetailCVById(@RequestParam int id) {
        CVDetailDTO cvDetail = cvService.getCVDetailById(id);

        if (cvDetail == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse<>(
                    "ERROR",
                    "CV with ID: " + id + " not found",
                    null
            ));
        }

        return ResponseEntity.ok(new ApiResponse<>(
                "SUCCESS",
                "Successfully retrieved the CV details",
                cvDetail
        ));
    }

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<CV>> createCV(
            @RequestParam("userId") Integer userId,
            @RequestParam("postId") Integer postId,
            @RequestParam("file") String file,
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
            CV cv = new CV();

            CV savedCV = cvService.saveCV(cv, userId, postId, file, description);

            return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponse<>(
                    "SUCCESS",
                    "Successfully created the CV",
                    savedCV
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(
                    "ERROR",
                    e.getMessage(),
                    null
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiResponse<>(
                    "ERROR",
                    "Failed to process CV: " + e.getMessage(),
                    null
            ));
        }
    }
}