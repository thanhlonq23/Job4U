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

import java.util.List;

@RestController
@RequestMapping("/api/cv")
public class CVController {

    private final CVService cvService;

    public CVController(CVService cvService) {
        this.cvService = cvService;
    }

    // Get a list of CVInfoDTO by post ID
    @GetMapping("/post/{postId}")
    public ResponseEntity<ApiResponse<List<CVInfoDTO>>> getCVInfoByPostId(@PathVariable("postId") Integer postId) {
        List<CVInfoDTO> cvInfoList = cvService.getCVInfoByPostId(postId);
        return buildResponse("SUCCESS", "Successfully retrieved CV list for post", cvInfoList, HttpStatus.OK);
    }

    // Get a paginated list of CVInfoDTO with optional filtering
    @GetMapping("/page")
    public ResponseEntity<ApiResponse<Page<CVInfoDTO>>> getCVInfoWithPaginationAndFilter(
            @RequestParam(value = "postId", required = true) Integer postId,
            @RequestParam(value = "keyword", required = false, defaultValue = "") String keyword,
            Pageable pageable
    ) {
        Page<CVInfoDTO> cvInfoPage = cvService.getCVInfoWithPaginationAndFilter(postId, keyword, pageable);
        String message = cvInfoPage.isEmpty() ? "No CVs found matching the criteria" : "Successfully retrieved the list of CVs";
        return buildResponse("SUCCESS", message, cvInfoPage, HttpStatus.OK);
    }

    // Get a paginated list of CVCandidateDTO by user ID
    @GetMapping("/get-all-cv-by-userId")
    public ResponseEntity<ApiResponse<Page<CVCandidateDTO>>> getAllCVsByUserId(
            @RequestParam Integer userId,
            Pageable pageable) {
        if (userId == null || userId <= 0) {
            return buildResponse("ERROR", "Invalid userId", null, HttpStatus.BAD_REQUEST);
        }

        Page<CVCandidateDTO> cvPage = cvService.getAllCVsByUserId(userId, pageable);
        String message = cvPage.isEmpty() ? "No CVs found for this user" : "Successfully retrieved CVs for userId: " + userId;
        return buildResponse("SUCCESS", message, cvPage, HttpStatus.OK);
    }

    // Get detailed information of a CV by its ID
    @GetMapping("/get-detail-cv-by-id")
    public ResponseEntity<ApiResponse<CVDetailDTO>> getDetailCVById(@RequestParam int id) {
        CVDetailDTO cvDetail = cvService.getCVDetailById(id);
        if (cvDetail == null) {
            return buildResponse("ERROR", "CV with ID: " + id + " not found", null, HttpStatus.NOT_FOUND);
        }
        return buildResponse("SUCCESS", "Successfully retrieved the CV details", cvDetail, HttpStatus.OK);
    }

    // Create a new CV
    @PostMapping("/create")
    public ResponseEntity<ApiResponse<CV>> createCV(
            @RequestParam("userId") Integer userId,
            @RequestParam("postId") Integer postId,
            @RequestParam("file") String file,
            @RequestParam(value = "description", required = false) String description) {

        if (userId == null || postId == null || file == null || file.isEmpty()) {
            return buildResponse("ERROR", "Missing required parameters", null, HttpStatus.BAD_REQUEST);
        }

        try {
            CV savedCV = cvService.saveCV(new CV(), userId, postId, file, description);
            return buildResponse("SUCCESS", "Successfully created the CV", savedCV, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return buildResponse("ERROR", e.getMessage(), null, HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return buildResponse("ERROR", "Failed to process CV: " + e.getMessage(), null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Build a ResponseEntity for API responses
    private <T> ResponseEntity<ApiResponse<T>> buildResponse(String status, String message, T data, HttpStatus httpStatus) {
        return ResponseEntity.status(httpStatus).body(new ApiResponse<>(status, message, data));
    }
}
