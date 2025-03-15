package com.nguyenlonq23.job4userver.controller;

import com.nguyenlonq23.job4userver.model.entity.Salary;
import com.nguyenlonq23.job4userver.dto.response.ApiResponse;
import com.nguyenlonq23.job4userver.service.SalaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/salaries")
public class SalaryController {
    private SalaryService salaryService;

    @Autowired
    public SalaryController(SalaryService salaryService) {
        this.salaryService = salaryService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Salary>>> getAllSalaries() {
        try {
            List<Salary> salaries = salaryService.getAllSalaries();

            if (salaries.isEmpty()) {
                return ResponseEntity.ok(new ApiResponse<>(
                        "SUCCESS",
                        "No salaries found",
                        salaries // Trả về đối tượng Page rỗng
                ));
            }

            return ResponseEntity.ok(new ApiResponse<>(
                    "SUCCESS",
                    "Successfully retrieved the list of salary",
                    salaries // Trả về toàn bộ đối tượng Page
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ApiResponse<>(
                    "ERROR",
                    "An error occurred while retrieving salaries: " + e.getMessage(),
                    null // Không trả về dữ liệu khi lỗi
            ));
        }
    }

    // Get all salaries
    @GetMapping("/page")
    public ResponseEntity<ApiResponse<Page<Salary>>> getAllSalariesWithPagination(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size
    ) {
        try {
            Page<Salary> workTypes = salaryService.getSalariesWithPagination(page, size);

            if (workTypes.isEmpty()) {
                return ResponseEntity.ok(new ApiResponse<>(
                        "SUCCESS",
                        "No salaries found",
                        workTypes // Trả về đối tượng Page rỗng
                ));
            }

            return ResponseEntity.ok(new ApiResponse<>(
                    "SUCCESS",
                    "Successfully retrieved the list of salary",
                    workTypes // Trả về toàn bộ đối tượng Page
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ApiResponse<>(
                    "ERROR",
                    "An error occurred while retrieving salaries: " + e.getMessage(),
                    null // Không trả về dữ liệu khi lỗi
            ));
        }
    }


    // Get salary by ID
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Salary>> getSalaryById(@PathVariable int id) {
        Salary salary = salaryService.getSalaryById(id);
        if (salary != null) {
            return ResponseEntity.ok(new ApiResponse<>(
                    "SUCCESS",
                    "Successfully retrieved the salary",
                    salary
            ));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse<>(
                    "ERROR",
                    "Salary with ID: " + id + " not found",
                    null
            ));
        }
    }

    // Create a new salary
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Salary>> createSalary(@RequestBody Salary salary) {
        if (salary.getName() == null || salary.getName().isEmpty()) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(
                    "ERROR",
                    "Salary range is required",
                    null
            ));
        }

        Salary savedSalary = salaryService.saveSalary(salary);
        return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponse<>(
                "SUCCESS",
                "Successfully created the salary",
                savedSalary
        ));
    }

    // Update a salary
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Salary>> updateSalary(@PathVariable int id, @RequestBody Salary salary) {
        Salary existingSalary = salaryService.getSalaryById(id);

        if (existingSalary == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse<>(
                    "ERROR",
                    "Salary with ID: " + id + " not found",
                    null
            ));
        }

        salary.setId(id);
        Salary updatedSalary = salaryService.saveSalary(salary);
        return ResponseEntity.ok(new ApiResponse<>(
                "SUCCESS",
                "Successfully updated the salary",
                updatedSalary
        ));
    }

    // Delete a salary
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteSalary(@PathVariable int id) {
        Salary existingSalary = salaryService.getSalaryById(id);

        if (existingSalary == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse<>(
                    "ERROR",
                    "Salary with ID: " + id + " not found",
                    null
            ));
        }

        salaryService.deleteSalary(id);
        return ResponseEntity.ok(new ApiResponse<>(
                "SUCCESS",
                "Successfully deleted the salary",
                null
        ));
    }
}
