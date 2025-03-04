package com.nguyenlonq23.job4userver.service;
import com.nguyenlonq23.job4userver.model.entity.Experience;
import com.nguyenlonq23.job4userver.repository.ExperienceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExperienceService {
    @Autowired
    private ExperienceRepository experienceRepository;

    // Lấy tất cả experiences
    public List<Experience> getAllExperiences() {
        return experienceRepository.findAll();
    }

    // Lấy experience theo ID
    public Experience getExperienceById(int id) {
        return experienceRepository.findById(id).orElse(null);
    }

    // Tạo mới hoặc cập nhật experience
    public Experience saveExperience(Experience experience) {
        return experienceRepository.save(experience);
    }

    // Xóa experience theo ID
    public void deleteExperience(int id) {
        experienceRepository.deleteById(id);
    }
}