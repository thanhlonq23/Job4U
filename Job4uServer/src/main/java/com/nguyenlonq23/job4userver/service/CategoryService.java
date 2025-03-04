package com.nguyenlonq23.job4userver.service;
import com.nguyenlonq23.job4userver.model.entity.Category;
import com.nguyenlonq23.job4userver.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {
    @Autowired
    private CategoryRepository categoryRepository;

    // Lấy tất cả categories
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    // Lấy category theo ID
    public Category getCategoryById(int id) {
        return categoryRepository.findById(id).orElse(null);
    }

    // Tạo mới hoặc cập nhật category
    public Category saveCategory(Category category) {
        return categoryRepository.save(category);
    }

    // Xóa category theo ID
    public void deleteCategory(int id) {
        categoryRepository.deleteById(id);
    }
}