package com.nguyenlonq23.job4userver.controller;

import com.nguyenlonq23.job4userver.model.Experience;
import com.nguyenlonq23.job4userver.service.ExperienceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/experiences")
public class ExperienceController {
    @Autowired
    private ExperienceService experienceService;

    // Lấy tất cả experiences
    @GetMapping
    public List<Experience> getAllExperiences() {
        return experienceService.getAllExperiences();
    }

    // Lấy experience theo ID
    @GetMapping("/{id}")
    public Experience getExperienceById(@PathVariable int id) {
        return experienceService.getExperienceById(id);
    }

    // Tạo mới experience
    @PostMapping
    public Experience createExperience(@RequestBody Experience experience) {
        return experienceService.saveExperience(experience);
    }

    // Cập nhật experience
    @PutMapping("/{id}")
    public Experience updateExperience(@PathVariable int id, @RequestBody Experience experience) {
        experience.setId(id);
        return experienceService.saveExperience(experience);
    }

    // Xóa experience
    @DeleteMapping("/{id}")
    public void deleteExperience(@PathVariable int id) {
        experienceService.deleteExperience(id);
    }
}