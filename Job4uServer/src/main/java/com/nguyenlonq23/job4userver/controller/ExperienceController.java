package com.nguyenlonq23.job4userver.controller;

import com.nguyenlonq23.job4userver.model.entity.Experience;
import com.nguyenlonq23.job4userver.model.response.ApiResponse;
import com.nguyenlonq23.job4userver.service.ExperienceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/experiences")
public class ExperienceController {
    @Autowired
    private ExperienceService experienceService;

    // Get all experiences
    @GetMapping
    public ResponseEntity<ApiResponse<List<Experience>>> getAllExperiences() {
        List<Experience> experiences = experienceService.getAllExperiences();
        return ResponseEntity.ok(new ApiResponse<>(
                "SUCCESS",
                "Successfully retrieved the list of experiences",
                experiences
        ));
    }

    // Get experience by ID
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Experience>> getExperienceById(@PathVariable int id) {
        Experience experience = experienceService.getExperienceById(id);
        if (experience == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse<>(
                    "ERROR",
                    "Experience with ID: " + id + " not found",
                    null
            ));
        }
        return ResponseEntity.ok(new ApiResponse<>(
                "SUCCESS",
                "Successfully retrieved the experience",
                experience
        ));
    }

    // Create a new experience
    @PostMapping
    public ResponseEntity<ApiResponse<Experience>> createExperience(@RequestBody Experience experience) {
        if (experience.getExperience_name() == null || experience.getExperience_name().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiResponse<>(
                    "ERROR",
                    "Experience name cannot be empty",
                    null
            ));
        }
        Experience createdExperience = experienceService.saveExperience(experience);
        return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponse<>(
                "SUCCESS",
                "Successfully created a new experience",
                createdExperience
        ));
    }

    // Update an experience
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Experience>> updateExperience(@PathVariable int id, @RequestBody Experience experience) {
        Experience existingExperience = experienceService.getExperienceById(id);
        if (existingExperience == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse<>(
                    "ERROR",
                    "Experience with ID: " + id + " not found",
                    null
            ));
        }
        experience.setId(id);
        Experience updatedExperience = experienceService.saveExperience(experience);
        return ResponseEntity.ok(new ApiResponse<>(
                "SUCCESS",
                "Successfully updated the experience",
                updatedExperience
        ));
    }

    // Delete an experience
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteExperience(@PathVariable int id) {
        Experience existingExperience = experienceService.getExperienceById(id);
        if (existingExperience == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse<>(
                    "ERROR",
                    "Experience with ID: " + id + " not found",
                    null
            ));
        }
        experienceService.deleteExperience(id);
        return ResponseEntity.ok(new ApiResponse<>(
                "SUCCESS",
                "Successfully deleted the experience",
                null
        ));
    }
}
