package com.nguyenlonq23.job4userver.controller;

import com.nguyenlonq23.job4userver.model.entity.Salary;
import com.nguyenlonq23.job4userver.model.response.ApiResponse;
import com.nguyenlonq23.job4userver.service.SalaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/salaries")
public class SalaryController {
    @Autowired
    private SalaryService salaryService;

    // Get all salaries
    @GetMapping
    public ResponseEntity<ApiResponse<List<Salary>>> getAllSalaries() {
        List<Salary> salaries = salaryService.getAllSalaries();
        return ResponseEntity.ok(new ApiResponse<>(
                "SUCCESS",
                "Successfully retrieved the list of salaries",
                salaries
        ));
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
    public ResponseEntity<ApiResponse<Salary>> createSalary(@RequestBody Salary salary) {
        if (salary.getSalaryRange() == null || salary.getSalaryRange().isEmpty()) {
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
