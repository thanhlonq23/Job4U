package com.nguyenlonq23.job4userver.repository;

import com.nguyenlonq23.job4userver.model.entity.Category;
import com.nguyenlonq23.job4userver.model.entity.Skill;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SkillRepository extends JpaRepository<Skill, Integer> {
    // Tìm các kỹ năng theo categoryId
    List<Skill> findByCategoryId(int categoryId);

    Page<Skill> findByNameContainingIgnoreCase(String keyword, Pageable pageable);

}