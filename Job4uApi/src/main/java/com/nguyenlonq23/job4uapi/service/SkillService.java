package com.nguyenlonq23.job4uapi.service;

import com.nguyenlonq23.job4uapi.model.Skill;
import com.nguyenlonq23.job4uapi.repository.SkillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SkillService {
    @Autowired
    private SkillRepository skillRepository;

    // Lấy tất cả skills
    public List<Skill> getAllSkills() {
        return skillRepository.findAll();
    }

    // Lấy skill theo ID
    public Skill getSkillById(int id) {
        return skillRepository.findById(id).orElse(null);
    }

    // Lấy các skill theo categoryId
    public List<Skill> getSkillsByCategoryId(int categoryId) {
        return skillRepository.findByCategoryId(categoryId);
    }

    // Tạo mới hoặc cập nhật skill
    public Skill saveSkill(Skill skill) {
        return skillRepository.save(skill);
    }

    // Xóa skill theo ID
    public void deleteSkill(int id) {
        skillRepository.deleteById(id);
    }
}