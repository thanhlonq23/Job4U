package com.nguyenlonq23.job4userver.service;

import com.nguyenlonq23.job4userver.model.entity.Skill;
import com.nguyenlonq23.job4userver.repository.SkillRepository;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
@Lazy
@Service
public class SkillService {

    private final SkillRepository skillRepository;

    public SkillService(SkillRepository skillRepository) {
        this.skillRepository = skillRepository;
    }

    public Page<Skill> getSkillsWithPagination(int page, int size) {
        Pageable pageable = PageRequest.of(page, size); // Tạo Pageable (pageIndex, pageSize)
        return skillRepository.findAll(pageable);
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