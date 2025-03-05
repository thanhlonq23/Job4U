package com.nguyenlonq23.job4userver.controller;

import com.nguyenlonq23.job4userver.model.entity.JobLevel;
import com.nguyenlonq23.job4userver.model.response.ApiResponse;
import com.nguyenlonq23.job4userver.service.JobLevelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/job-levels")
public class JobLevelController {
    @Autowired
    private JobLevelService jobLevelService;

    // Get all job levels
    @GetMapping
    public ResponseEntity<ApiResponse<Page<JobLevel>>> getAllWorkTypes(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size
    ) {
        Page<JobLevel> workTypes = jobLevelService.getJobLevelWithPagination(page, size);

        return ResponseEntity.ok(new ApiResponse<>(
                "SUCCESS",
                "Successfully retrieved the list of job levels",
                workTypes // Trả về toàn bộ đối tượng Page
        ));
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
        if (jobLevel.getJobLevel_name() == null || jobLevel.getJobLevel_name().isEmpty()) {
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
