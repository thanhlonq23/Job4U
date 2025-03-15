package com.nguyenlonq23.job4userver.service;

import com.nguyenlonq23.job4userver.model.entity.Category;
import com.nguyenlonq23.job4userver.model.entity.Experience;
import com.nguyenlonq23.job4userver.repository.ExperienceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Lazy
@Service
public class ExperienceService {
    @Autowired
    private ExperienceRepository experienceRepository;

    public List<Experience> getAllExperiences() {
        return experienceRepository.findAll();
    }

    public Page<Experience> getExperiences(String keyword, Pageable pageable) {
        // Lọc dữ liệu bằng từ khóa nếu keyword không rỗng
        if (keyword != null && !keyword.isEmpty()) {
            return experienceRepository.findByNameContainingIgnoreCase(keyword, pageable);
        }
        // Trả về toàn bộ nếu không có keyword
        return experienceRepository.findAll(pageable);
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