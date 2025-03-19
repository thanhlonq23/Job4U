package com.nguyenlonq23.job4userver.controller;

import com.nguyenlonq23.job4userver.model.entity.Experience;
import com.nguyenlonq23.job4userver.dto.response.ApiResponse;
import com.nguyenlonq23.job4userver.service.ExperienceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/experiences")
public class ExperienceController {
    private final ExperienceService experienceService;

    @Autowired
    public ExperienceController(ExperienceService experienceService) {
        this.experienceService = experienceService;
    }

    // Get all experiences
    @GetMapping
    public ResponseEntity<ApiResponse<List<Experience>>> getAllExperience() {
        try {
            List<Experience> experiences = experienceService.getAllExperiences();
            String message = experiences.isEmpty() ? "No experiences found matching the criteria" : "Successfully retrieved the list of experiences";
            return buildResponse("SUCCESS", message, experiences, HttpStatus.OK);
        } catch (Exception e) {
            return buildResponse("ERROR", "An error occurred while retrieving experiences: " + e.getMessage(), null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get paginated and filtered experiences
    @GetMapping("/page")
    public ResponseEntity<ApiResponse<Page<Experience>>> getAllExperienceWithPagination(
            @RequestParam(value = "keyword", required = false, defaultValue = "") String keyword,
            Pageable pageable) {
        try {
            Page<Experience> experiences = experienceService.getExperiences(keyword, pageable);
            String message = experiences.isEmpty() ? "No experiences found matching the criteria" : "Successfully retrieved the list of experiences";
            return buildResponse("SUCCESS", message, experiences, HttpStatus.OK);
        } catch (Exception e) {
            return buildResponse("ERROR", "An error occurred while retrieving experiences: " + e.getMessage(), null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get experience by ID
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Experience>> getExperienceById(@PathVariable int id) {
        Experience experience = experienceService.getExperienceById(id);
        if (experience == null) {
            return buildResponse("ERROR", "Experience with ID: " + id + " not found", null, HttpStatus.NOT_FOUND);
        }
        return buildResponse("SUCCESS", "Successfully retrieved the experience", experience, HttpStatus.OK);
    }

    // Create a new experience
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Experience>> createExperience(@RequestBody Experience experience) {
        if (experience.getName() == null || experience.getName().isEmpty()) {
            return buildResponse("ERROR", "Experience name cannot be empty", null, HttpStatus.BAD_REQUEST);
        }
        Experience createdExperience = experienceService.saveExperience(experience);
        return buildResponse("SUCCESS", "Successfully created a new experience", createdExperience, HttpStatus.CREATED);
    }

    // Update an existing experience
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Experience>> updateExperience(@PathVariable int id, @RequestBody Experience experience) {
        Experience existingExperience = experienceService.getExperienceById(id);
        if (existingExperience == null) {
            return buildResponse("ERROR", "Experience with ID: " + id + " not found", null, HttpStatus.NOT_FOUND);
        }
        experience.setId(id);
        Experience updatedExperience = experienceService.saveExperience(experience);
        return buildResponse("SUCCESS", "Successfully updated the experience", updatedExperience, HttpStatus.OK);
    }

    // Delete experience by ID
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteExperience(@PathVariable int id) {
        Experience existingExperience = experienceService.getExperienceById(id);
        if (existingExperience == null) {
            return buildResponse("ERROR", "Experience with ID: " + id + " not found", null, HttpStatus.NOT_FOUND);
        }
        experienceService.deleteExperience(id);
        return buildResponse("SUCCESS", "Successfully deleted the experience", null, HttpStatus.OK);
    }

    // Build a ResponseEntity for API responses
    private <T> ResponseEntity<ApiResponse<T>> buildResponse(String status, String message, T data, HttpStatus httpStatus) {
        return ResponseEntity.status(httpStatus).body(new ApiResponse<>(status, message, data));
    }
}
