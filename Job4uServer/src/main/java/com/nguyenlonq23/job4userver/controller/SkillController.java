package com.nguyenlonq23.job4userver.controller;

import com.nguyenlonq23.job4userver.model.entity.Skill;
import com.nguyenlonq23.job4userver.model.response.ApiResponse;
import com.nguyenlonq23.job4userver.service.SkillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/skills")
public class SkillController {
    @Autowired
    private SkillService skillService;

    // Get all skills
    @GetMapping
    public ResponseEntity<ApiResponse<List<Skill>>> getAllSkills() {
        List<Skill> skills = skillService.getAllSkills();
        return ResponseEntity.ok(new ApiResponse<>(
                "SUCCESS",
                "Successfully retrieved the list of skills",
                skills
        ));
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
    public ResponseEntity<ApiResponse<Skill>> createSkill(@RequestBody Skill skill) {
        if (skill.getSkill_name() == null || skill.getSkill_name().isEmpty()) {
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
