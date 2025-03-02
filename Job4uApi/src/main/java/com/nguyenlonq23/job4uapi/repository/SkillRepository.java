package com.nguyenlonq23.job4uapi.repository;

import com.nguyenlonq23.job4uapi.model.Skill;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SkillRepository extends JpaRepository<Skill, Integer> {
    // Tìm các kỹ năng theo categoryId
    List<Skill> findByCategoryId(int categoryId);
}