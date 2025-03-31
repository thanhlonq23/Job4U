package com.nguyenlonq23.job4userver.controller;

import com.nguyenlonq23.job4userver.dto.response.ApiResponse;
import com.nguyenlonq23.job4userver.model.entity.Salary;
import com.nguyenlonq23.job4userver.service.SalaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import org.springframework.data.domain.Page;
import java.util.List;

@RestController
@RequestMapping("/api/salaries") // Endpoint for salary-related APIs
public class SalaryController {

    private final SalaryService salaryService;

    public SalaryController(SalaryService salaryService) {
        this.salaryService = salaryService;
    }

    @GetMapping // Fetch all salaries
    public ResponseEntity<ApiResponse<List<Salary>>> getAllSalaries() {
        try {
            List<Salary> salaries = salaryService.getAllSalaries();
            String message = salaries.isEmpty() ? "No salaries found." : "Successfully retrieved the list of salaries.";
            return buildResponse("SUCCESS", message, salaries, HttpStatus.OK);
        } catch (Exception e) {
            return buildResponse("ERROR", "An error occurred while retrieving salaries: " + e.getMessage(), null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/page") // Fetch salaries with pagination
    public ResponseEntity<ApiResponse<Page<Salary>>> getAllSalariesWithPagination(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size) {
        try {
            Page<Salary> salaries = salaryService.getSalariesWithPagination(page, size);
            String message = salaries.isEmpty() ? "No salaries found." : "Successfully retrieved the list of salaries.";
            return buildResponse("SUCCESS", message, salaries, HttpStatus.OK);
        } catch (Exception e) {
            return buildResponse("ERROR", "An error occurred while retrieving salaries with pagination: " + e.getMessage(), null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{id}") // Fetch a salary by ID
    public ResponseEntity<ApiResponse<Salary>> getSalaryById(@PathVariable int id) {
        try {
            Salary salary = salaryService.getSalaryById(id);
            if (salary != null) {
                return buildResponse("SUCCESS", "Successfully retrieved the salary.", salary, HttpStatus.OK);
            } else {
                return buildResponse("ERROR", "Salary with ID: " + id + " not found.", null, HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return buildResponse("ERROR", "An error occurred while retrieving salary by ID: " + e.getMessage(), null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping // Create a new salary
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Salary>> createSalary(@RequestBody Salary salary) {
        if (salary.getName() == null || salary.getName().isEmpty()) {
            return buildResponse("ERROR", "Salary name is required.", null, HttpStatus.BAD_REQUEST);
        }
        try {
            Salary savedSalary = salaryService.saveSalary(salary);
            return buildResponse("SUCCESS", "Successfully created the salary.", savedSalary, HttpStatus.CREATED);
        } catch (Exception e) {
            return buildResponse("ERROR", "An error occurred while creating salary: " + e.getMessage(), null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{id}") // Update an existing salary
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Salary>> updateSalary(@PathVariable int id, @RequestBody Salary salary) {
        try {
            Salary existingSalary = salaryService.getSalaryById(id);
            if (existingSalary == null) {
                return buildResponse("ERROR", "Salary with ID: " + id + " not found.", null, HttpStatus.NOT_FOUND);
            }
            salary.setId(id);
            Salary updatedSalary = salaryService.saveSalary(salary);
            return buildResponse("SUCCESS", "Successfully updated the salary.", updatedSalary, HttpStatus.OK);
        } catch (Exception e) {
            return buildResponse("ERROR", "An error occurred while updating salary: " + e.getMessage(), null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{id}") // Delete a salary by ID
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteSalary(@PathVariable int id) {
        try {
            Salary existingSalary = salaryService.getSalaryById(id);
            if (existingSalary == null) {
                return buildResponse("ERROR", "Salary with ID: " + id + " not found.", null, HttpStatus.NOT_FOUND);
            }
            salaryService.deleteSalary(id);
            return buildResponse("SUCCESS", "Successfully deleted the salary.", null, HttpStatus.OK);
        } catch (Exception e) {
            return buildResponse("ERROR", "An error occurred while deleting salary: " + e.getMessage(), null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private <T> ResponseEntity<ApiResponse<T>> buildResponse(String status, String message, T data, HttpStatus httpStatus) {
        return ResponseEntity.status(httpStatus).body(new ApiResponse<>(status, message, data));
    }
}
