package com.nguyenlonq23.job4userver.service;
import com.nguyenlonq23.job4userver.model.entity.Category;
import com.nguyenlonq23.job4userver.model.entity.WorkType;
import com.nguyenlonq23.job4userver.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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

    public Page<Category> getCategorysWithPagination(int page, int size) {
        Pageable pageable = PageRequest.of(page, size); // Tạo Pageable (pageIndex, pageSize)
        return categoryRepository.findAll(pageable);
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