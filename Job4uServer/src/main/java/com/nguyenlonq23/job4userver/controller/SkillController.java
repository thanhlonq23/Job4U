package com.nguyenlonq23.job4userver.controller;

import com.nguyenlonq23.job4userver.model.entity.Skill;
import com.nguyenlonq23.job4userver.dto.response.ApiResponse;
import com.nguyenlonq23.job4userver.service.SkillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/skills")
public class SkillController {
    @Autowired
    private SkillService skillService;

    // Get all skills
    @GetMapping
    public ResponseEntity<ApiResponse<Page<Skill>>> getAllWorkTypes(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size
    ) {
        try {
            Page<Skill> workTypes = skillService.getSkillsWithPagination(page, size);

            if (workTypes.isEmpty()) {
                return ResponseEntity.ok(new ApiResponse<>(
                        "SUCCESS",
                        "No skills found",
                        workTypes // Trả về đối tượng Page rỗng
                ));
            }

            return ResponseEntity.ok(new ApiResponse<>(
                    "SUCCESS",
                    "Successfully retrieved the list of skills",
                    workTypes // Trả về toàn bộ đối tượng Page
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ApiResponse<>(
                    "ERROR",
                    "An error occurred while retrieving skills: " + e.getMessage(),
                    null // Không trả về dữ liệu khi lỗi
            ));
        }
    }


    // Get skill by ID
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Skill>> getSkillById(@PathVariable int id) {
        Skill skill = skillService.getSkillById(id);
        if (skill != null) {
            return ResponseEntity.ok(new ApiResponse<>(
                    "SUCCESS",
                    "Successfully retrieved the skill",
                    skill
            ));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse<>(
                    "ERROR",
                    "Skill with ID: " + id + " not found",
                    null
            ));
        }
    }

    // Get skills by category ID
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<ApiResponse<List<Skill>>> getSkillsByCategoryId(@PathVariable int categoryId) {
        List<Skill> skills = skillService.getSkillsByCategoryId(categoryId);
        return ResponseEntity.ok(new ApiResponse<>(
                "SUCCESS",
                "Successfully retrieved the skills by category ID",
                skills
        ));
    }

    // Create a new skill
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Skill>> createSkill(@RequestBody Skill skill) {
        if (skill.getName() == null || skill.getName().isEmpty()) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(
                    "ERROR",
                    "Skill name is required",
                    null
            ));
        }

        Skill savedSkill = skillService.saveSkill(skill);
        return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponse<>(
                "SUCCESS",
                "Successfully created the skill",
                savedSkill
        ));
    }

    // Update a skill
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Skill>> updateSkill(@PathVariable int id, @RequestBody Skill skill) {
        Skill existingSkill = skillService.getSkillById(id);
        if (existingSkill == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse<>(
                    "ERROR",
                    "Skill with ID: " + id + " not found",
                    null
            ));
        }

        skill.setId(id);
        Skill updatedSkill = skillService.saveSkill(skill);
        return ResponseEntity.ok(new ApiResponse<>(
                "SUCCESS",
                "Successfully updated the skill",
                updatedSkill
        ));
    }

    // Delete a skill
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteSkill(@PathVariable int id) {
        Skill existingSkill = skillService.getSkillById(id);
        if (existingSkill == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse<>(
                    "ERROR",
                    "Skill with ID: " + id + " not found",
                    null
            ));
        }

        skillService.deleteSkill(id);
        return ResponseEntity.ok(new ApiResponse<>(
                "SUCCESS",
                "Successfully deleted the skill",
                null
        ));
    }
}
