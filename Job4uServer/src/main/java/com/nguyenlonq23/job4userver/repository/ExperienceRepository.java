package com.nguyenlonq23.job4userver.repository;

import com.nguyenlonq23.job4userver.model.entity.Category;
import com.nguyenlonq23.job4userver.model.entity.Experience;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Lazy
@Repository
public interface ExperienceRepository extends JpaRepository<Experience, Integer> {
    Page<Experience> findByNameContainingIgnoreCase(String keyword, Pageable pageable);

}
