package com.nguyenlonq23.job4userver.repository;

import com.nguyenlonq23.job4userver.model.entity.Category;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Lazy
@Repository
public interface CategoryRepository extends JpaRepository<Category, Integer> {
    Page<Category> findByNameContainingIgnoreCase(String keyword, Pageable pageable);

    // Analyst
    @Query(value = "SELECT c.name, COUNT(p.id) as postCount FROM categories c " +
            "JOIN posts p ON c.id = p.category_id " +
            "GROUP BY c.id, c.name ORDER BY postCount DESC", nativeQuery = true)
    List<Map<String, Object>> findCategoryPostCounts();

}
