package com.nguyenlonq23.job4userver.controller;

import com.nguyenlonq23.job4userver.model.entity.JobLevel;
import com.nguyenlonq23.job4userver.dto.response.ApiResponse;
import com.nguyenlonq23.job4userver.service.JobLevelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/job-levels")
public class JobLevelController {

    private final JobLevelService jobLevelService;

    public JobLevelController(JobLevelService jobLevelService) {
        this.jobLevelService = jobLevelService;
    }

    // Get all job levels
    @GetMapping
    public ResponseEntity<ApiResponse<List<JobLevel>>> getAllJobLevels() {
        try {
            List<JobLevel> jobLevels = jobLevelService.getAllJobLevels();
            String message = jobLevels.isEmpty() ? "No job levels found matching the criteria" : "Successfully retrieved the list of job levels";
            return buildResponse("SUCCESS", message, jobLevels, HttpStatus.OK);
        } catch (Exception e) {
            return buildResponse("ERROR", "An error occurred while retrieving job levels: " + e.getMessage(), null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get paginated and filtered job levels
    @GetMapping("/page")
    public ResponseEntity<ApiResponse<Page<JobLevel>>> getJobLevelsWithPagination(
            @RequestParam(value = "keyword", required = false, defaultValue = "") String keyword,
            Pageable pageable) {
        try {
            Page<JobLevel> jobLevels = jobLevelService.getJobLevels(keyword, pageable);
            String message = jobLevels.isEmpty() ? "No job levels found matching the criteria" : "Successfully retrieved the list of job levels";
            return buildResponse("SUCCESS", message, jobLevels, HttpStatus.OK);
        } catch (Exception e) {
            return buildResponse("ERROR", "An error occurred while retrieving job levels: " + e.getMessage(), null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get job level by ID
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<JobLevel>> getJobLevelById(@PathVariable int id) {
        JobLevel jobLevel = jobLevelService.getJobLevelById(id);
        if (jobLevel == null) {
            return buildResponse("ERROR", "Job level with ID: " + id + " not found", null, HttpStatus.NOT_FOUND);
        }
        return buildResponse("SUCCESS", "Successfully retrieved the job level", jobLevel, HttpStatus.OK);
    }

    // Create a new job level
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<JobLevel>> createJobLevel(@RequestBody JobLevel jobLevel) {
        if (jobLevel.getName() == null || jobLevel.getName().isEmpty()) {
            return buildResponse("ERROR", "Job level name cannot be empty", null, HttpStatus.BAD_REQUEST);
        }
        JobLevel createdJobLevel = jobLevelService.saveJobLevel(jobLevel);
        return buildResponse("SUCCESS", "Successfully created the job level", createdJobLevel, HttpStatus.CREATED);
    }

    // Update an existing job level
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<JobLevel>> updateJobLevel(@PathVariable int id, @RequestBody JobLevel jobLevel) {
        JobLevel existingJobLevel = jobLevelService.getJobLevelById(id);
        if (existingJobLevel == null) {
            return buildResponse("ERROR", "Job level with ID: " + id + " not found", null, HttpStatus.NOT_FOUND);
        }
        jobLevel.setId(id);
        JobLevel updatedJobLevel = jobLevelService.saveJobLevel(jobLevel);
        return buildResponse("SUCCESS", "Successfully updated the job level", updatedJobLevel, HttpStatus.OK);
    }

    // Delete job level by ID
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteJobLevel(@PathVariable int id) {
        JobLevel existingJobLevel = jobLevelService.getJobLevelById(id);
        if (existingJobLevel == null) {
            return buildResponse("ERROR", "Job level with ID: " + id + " not found", null, HttpStatus.NOT_FOUND);
        }
        jobLevelService.deleteJobLevel(id);
        return buildResponse("SUCCESS", "Successfully deleted the job level", null, HttpStatus.OK);
    }

    // Build a ResponseEntity for API responses
    private <T> ResponseEntity<ApiResponse<T>> buildResponse(String status, String message, T data, HttpStatus httpStatus) {
        return ResponseEntity.status(httpStatus).body(new ApiResponse<>(status, message, data));
    }
}
