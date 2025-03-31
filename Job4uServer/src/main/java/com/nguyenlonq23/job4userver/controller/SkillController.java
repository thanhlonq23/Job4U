package com.nguyenlonq23.job4userver.controller;

import com.nguyenlonq23.job4userver.dto.response.ApiResponse;
import com.nguyenlonq23.job4userver.model.entity.Skill;
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

    private final SkillService skillService;

    public SkillController(SkillService skillService) {
        this.skillService = skillService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<Skill>>> getAllSkills(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size) {
        try {
            Page<Skill> skills = skillService.getSkillsWithPagination(page, size);
            String message = skills.isEmpty() ? "No skills found." : "Successfully retrieved the list of skills.";
            return buildResponse("SUCCESS", message, skills, HttpStatus.OK);
        } catch (Exception e) {
            return buildResponse("ERROR", "An error occurred while retrieving skills: " + e.getMessage(), null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Skill>> getSkillById(@PathVariable int id) {
        try {
            Skill skill = skillService.getSkillById(id);
            if (skill != null) {
                return buildResponse("SUCCESS", "Successfully retrieved the skill.", skill, HttpStatus.OK);
            } else {
                return buildResponse("ERROR", "Skill with ID: " + id + " not found.", null, HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return buildResponse("ERROR", "An error occurred while retrieving the skill: " + e.getMessage(), null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<ApiResponse<List<Skill>>> getSkillsByCategoryId(@PathVariable int categoryId) {
        try {
            List<Skill> skills = skillService.getSkillsByCategoryId(categoryId);
            return buildResponse("SUCCESS", "Successfully retrieved the skills by category ID.", skills, HttpStatus.OK);
        } catch (Exception e) {
            return buildResponse("ERROR", "An error occurred while retrieving skills by category ID: " + e.getMessage(), null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Skill>> createSkill(@RequestBody Skill skill) {
        if (skill.getName() == null || skill.getName().isEmpty()) {
            return buildResponse("ERROR", "Skill name is required.", null, HttpStatus.BAD_REQUEST);
        }
        try {
            Skill savedSkill = skillService.saveSkill(skill);
            return buildResponse("SUCCESS", "Successfully created the skill.", savedSkill, HttpStatus.CREATED);
        } catch (Exception e) {
            return buildResponse("ERROR", "An error occurred while creating the skill: " + e.getMessage(), null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Skill>> updateSkill(@PathVariable int id, @RequestBody Skill skill) {
        try {
            Skill existingSkill = skillService.getSkillById(id);
            if (existingSkill == null) {
                return buildResponse("ERROR", "Skill with ID: " + id + " not found.", null, HttpStatus.NOT_FOUND);
            }
            skill.setId(id);
            Skill updatedSkill = skillService.saveSkill(skill);
            return buildResponse("SUCCESS", "Successfully updated the skill.", updatedSkill, HttpStatus.OK);
        } catch (Exception e) {
            return buildResponse("ERROR", "An error occurred while updating the skill: " + e.getMessage(), null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteSkill(@PathVariable int id) {
        try {
            Skill existingSkill = skillService.getSkillById(id);
            if (existingSkill == null) {
                return buildResponse("ERROR", "Skill with ID: " + id + " not found.", null, HttpStatus.NOT_FOUND);
            }
            skillService.deleteSkill(id);
            return buildResponse("SUCCESS", "Successfully deleted the skill.", null, HttpStatus.OK);
        } catch (Exception e) {
            return buildResponse("ERROR", "An error occurred while deleting the skill: " + e.getMessage(), null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private <T> ResponseEntity<ApiResponse<T>> buildResponse(String status, String message, T data, HttpStatus httpStatus) {
        return ResponseEntity.status(httpStatus).body(new ApiResponse<>(status, message, data));
    }
}
