package com.nguyenlonq23.job4userver.controller;

import com.nguyenlonq23.job4userver.model.entity.Category;
import com.nguyenlonq23.job4userver.dto.response.ApiResponse;
import com.nguyenlonq23.job4userver.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    // Get all categories
    @GetMapping
    public ResponseEntity<ApiResponse<List<Category>>> getAllCategories() {
        try {
            List<Category> categories = categoryService.getAllCategories();
            String message = categories.isEmpty() ? "No categories found matching the criteria" : "Successfully retrieved the list of categories";
            return buildResponse("SUCCESS", message, categories, HttpStatus.OK);
        } catch (Exception e) {
            return buildResponse("ERROR", "An error occurred while retrieving categories: " + e.getMessage(), null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get all categories with optional keyword filter
    @GetMapping("/page")
    public ResponseEntity<ApiResponse<Page<Category>>> getAllCategoriesWithPaginationAndFilter(
            @RequestParam(value = "keyword", required = false, defaultValue = "") String keyword,
            Pageable pageable
    ) {
        try {
            Page<Category> categories = categoryService.getCategoriesWithPaginationAndFilter(keyword, pageable);
            String message = categories.isEmpty() ? "No categories found matching the criteria" : "Successfully retrieved the list of categories";
            return buildResponse("SUCCESS", message, categories, HttpStatus.OK);
        } catch (Exception e) {
            return buildResponse("ERROR", "An error occurred while retrieving categories: " + e.getMessage(), null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get category by ID
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Category>> getCategoryById(@PathVariable int id) {
        Category category = categoryService.getCategoryById(id);
        if (category == null) {
            return buildResponse("ERROR", "Category with ID: " + id + " not found", null, HttpStatus.NOT_FOUND);
        }
        return buildResponse("SUCCESS", "Successfully retrieved the category", category, HttpStatus.OK);
    }

    // Create a new category
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Category>> createCategory(@RequestBody Category category) {
        if (category.getName() == null || category.getName().isEmpty()) {
            return buildResponse("ERROR", "Category name cannot be empty", null, HttpStatus.BAD_REQUEST);
        }
        Category savedCategory = categoryService.saveCategory(category);
        return buildResponse("SUCCESS", "Successfully created the category", savedCategory, HttpStatus.CREATED);
    }

    // Update a category
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Category>> updateCategory(@PathVariable int id, @RequestBody Category category) {
        if (categoryService.getCategoryById(id) == null) {
            return buildResponse("ERROR", "Category with ID: " + id + " not found", null, HttpStatus.NOT_FOUND);
        }
        category.setId(id);
        Category updatedCategory = categoryService.saveCategory(category);
        return buildResponse("SUCCESS", "Successfully updated the category", updatedCategory, HttpStatus.OK);
    }

    // Delete a category
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(@PathVariable int id) {
        if (categoryService.getCategoryById(id) == null) {
            return buildResponse("ERROR", "Category with ID: " + id + " not found", null, HttpStatus.NOT_FOUND);
        }
        categoryService.deleteCategory(id);
        return buildResponse("SUCCESS", "Successfully deleted the category", null, HttpStatus.OK);
    }

    private <T> ResponseEntity<ApiResponse<T>> buildResponse(String status, String message, T data, HttpStatus httpStatus) {
        return ResponseEntity.status(httpStatus).body(new ApiResponse<>(status, message, data));
    }
}
