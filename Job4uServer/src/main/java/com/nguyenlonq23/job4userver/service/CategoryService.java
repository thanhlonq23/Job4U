package com.nguyenlonq23.job4userver.service;

import com.nguyenlonq23.job4userver.model.entity.Category;
import com.nguyenlonq23.job4userver.model.entity.WorkType;
import com.nguyenlonq23.job4userver.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Lazy
@Service
public class CategoryService {
    @Autowired
    private CategoryRepository categoryRepository;

    // Lấy tất cả categories kèm phân trang và từ khóa tìm kiếm,sort
    public Page<Category> getCategoriesWithPaginationAndFilter(String keyword, Pageable pageable) {
        // Lọc dữ liệu bằng từ khóa nếu keyword không rỗng
        if (keyword != null && !keyword.isEmpty()) {
            return categoryRepository.findByNameContainingIgnoreCase(keyword, pageable);
        }
        // Trả về toàn bộ nếu không có keyword
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