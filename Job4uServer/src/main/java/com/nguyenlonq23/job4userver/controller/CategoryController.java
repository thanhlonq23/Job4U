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
    @Autowired
    private CategoryService categoryService;


    // Get all categories
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYER_OWNER', 'EMPLOYER_STAFF')")
    public ResponseEntity<ApiResponse<List<Category>>> getAllCategories(
    ) {
        try {
            List<Category> categories = categoryService.getAllCategories();

            if (categories.isEmpty()) {
                return ResponseEntity.ok(new ApiResponse<>(
                        "SUCCESS",
                        "No categories found matching the criteria",
                        categories
                ));
            }

            return ResponseEntity.ok(new ApiResponse<>(
                    "SUCCESS",
                    "Successfully retrieved the list of categories",
                    categories
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ApiResponse<>(
                    "ERROR",
                    "An error occurred while retrieving categories: " + e.getMessage(),
                    null
            ));
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

            if (categories.isEmpty()) {
                return ResponseEntity.ok(new ApiResponse<>(
                        "SUCCESS",
                        "No categories found matching the criteria",
                        categories
                ));
            }

            return ResponseEntity.ok(new ApiResponse<>(
                    "SUCCESS",
                    "Successfully retrieved the list of categories",
                    categories
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ApiResponse<>(
                    "ERROR",
                    "An error occurred while retrieving categories: " + e.getMessage(),
                    null
            ));
        }
    }


    // Get category by ID
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Category>> getCategoryById(@PathVariable int id) {
        Category category = categoryService.getCategoryById(id);

        if (category == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse<>(
                    "ERROR",
                    "Category with ID: " + id + " not found",
                    null
            ));
        }

        return ResponseEntity.ok(new ApiResponse<>(
                "SUCCESS",
                "Successfully retrieved the category",
                category
        ));
    }

    // Create a new category
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Category>> createCategory(@RequestBody Category category) {
        if (category.getName() == null || category.getName().isEmpty()) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(
                    "ERROR",
                    "Category name cannot be empty",
                    null
            ));
        }

        Category savedCategory = categoryService.saveCategory(category);
        return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponse<>(
                "SUCCESS",
                "Successfully created the category",
                savedCategory
        ));
    }

    // Update a category
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Category>> updateCategory(@PathVariable int id, @RequestBody Category category) {
        Category existingCategory = categoryService.getCategoryById(id);

        if (existingCategory == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse<>(
                    "ERROR",
                    "Category with ID: " + id + " not found",
                    null
            ));
        }

        category.setId(id);
        Category updatedCategory = categoryService.saveCategory(category);
        return ResponseEntity.ok(new ApiResponse<>(
                "SUCCESS",
                "Successfully updated the category",
                updatedCategory
        ));
    }

    // Delete a category
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(@PathVariable int id) {
        Category category = categoryService.getCategoryById(id);

        if (category == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse<>(
                    "ERROR",
                    "Category with ID: " + id + " not found",
                    null
            ));
        }

        categoryService.deleteCategory(id);
        return ResponseEntity.ok(new ApiResponse<>(
                "SUCCESS",
                "Successfully deleted the category",
                null
        ));
    }
}
