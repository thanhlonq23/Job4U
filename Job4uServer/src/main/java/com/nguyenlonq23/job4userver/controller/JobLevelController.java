package com.nguyenlonq23.job4userver.controller;

import com.nguyenlonq23.job4userver.model.entity.JobLevel;
import com.nguyenlonq23.job4userver.dto.response.ApiResponse;
import com.nguyenlonq23.job4userver.service.JobLevelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/job-levels")
public class JobLevelController {
    @Autowired
    private JobLevelService jobLevelService;

    // Get all job levels
    @GetMapping
    public ResponseEntity<ApiResponse<Page<JobLevel>>> getAllWorkTypes(
            @RequestParam(value = "keyword", required = false, defaultValue = "") String keyword, // Từ khóa tìm kiếm
            Pageable pageable // Thông tin phân trang và sắp xếp từ URL
    ) {
        try {
            Page<JobLevel> workTypes = jobLevelService.getJobLevels(keyword, pageable);

            if (workTypes.isEmpty()) {
                return ResponseEntity.ok(new ApiResponse<>(
                        "SUCCESS",
                        "No job levels found matching the criteria",
                        workTypes // Trả về đối tượng rỗng
                ));
            }

            return ResponseEntity.ok(new ApiResponse<>(
                    "SUCCESS",
                    "Successfully retrieved the list of job levels",
                    workTypes // Trả về toàn bộ đối tượng Page
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ApiResponse<>(
                    "ERROR",
                    "An error occurred while retrieving job levels: " + e.getMessage(),
                    null // Không trả về dữ liệu khi lỗi
            ));
        }
    }


    // Get job level by ID
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<JobLevel>> getJobLevelById(@PathVariable int id) {
        JobLevel jobLevel = jobLevelService.getJobLevelById(id);
        if (jobLevel != null) {
            return ResponseEntity.ok(new ApiResponse<>(
                    "SUCCESS",
                    "Successfully retrieved the job level",
                    jobLevel
            ));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse<>(
                    "ERROR",
                    "Job level with ID: " + id + " not found",
                    null
            ));
        }
    }

    // Create a new job level
    @PostMapping
    public ResponseEntity<ApiResponse<JobLevel>> createJobLevel(@RequestBody JobLevel jobLevel) {
        if (jobLevel.getName() == null || jobLevel.getName().isEmpty()) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(
                    "ERROR",
                    "Job level name is required",
                    null
            ));
        }

        JobLevel savedJobLevel = jobLevelService.saveJobLevel(jobLevel);
        return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponse<>(
                "SUCCESS",
                "Successfully created the job level",
                savedJobLevel
        ));
    }

    // Update a job level
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<JobLevel>> updateJobLevel(
            @PathVariable int id,
            @RequestBody JobLevel jobLevel
    ) {
        JobLevel existingJobLevel = jobLevelService.getJobLevelById(id);

        if (existingJobLevel == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse<>(
                    "ERROR",
                    "Job level with ID: " + id + " not found",
                    null
            ));
        }

        jobLevel.setId(id);
        JobLevel updatedJobLevel = jobLevelService.saveJobLevel(jobLevel);
        return ResponseEntity.ok(new ApiResponse<>(
                "SUCCESS",
                "Successfully updated the job level",
                updatedJobLevel
        ));
    }

    // Delete a job level
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteJobLevel(@PathVariable int id) {
        JobLevel existingJobLevel = jobLevelService.getJobLevelById(id);

        if (existingJobLevel == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse<>(
                    "ERROR",
                    "Job level with ID: " + id + " not found",
                    null
            ));
        }

        jobLevelService.deleteJobLevel(id);
        return ResponseEntity.ok(new ApiResponse<>(
                "SUCCESS",
                "Successfully deleted the job level",
                null
        ));
    }
}
