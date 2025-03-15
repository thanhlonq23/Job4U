package com.nguyenlonq23.job4userver.controller;

import com.nguyenlonq23.job4userver.dto.response.ApiResponse;
import com.nguyenlonq23.job4userver.model.entity.Company;
import com.nguyenlonq23.job4userver.model.enums.CompanyStatus;
import com.nguyenlonq23.job4userver.model.enums.PostStatus;
import com.nguyenlonq23.job4userver.service.CompanyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;


@RestController
@RequestMapping("/api/companies")
public class CompanyController {

    @Autowired
    private CompanyService companyService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<Company>>> getAllCategoriesWithPaginationAndFilter(
            @RequestParam(value = "keyword", required = false, defaultValue = "") String keyword,
            Pageable pageable
    ) {
        try {
            Page<Company> companies = companyService.getCompaniesWithPaginationAndFilter(keyword, pageable);

            if (companies.isEmpty()) {
                return ResponseEntity.ok(new ApiResponse<>(
                        "SUCCESS",
                        "No companies found matching the criteria",
                        companies
                ));
            }

            return ResponseEntity.ok(new ApiResponse<>(
                    "SUCCESS",
                    "Successfully retrieved the list of companies",
                    companies
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ApiResponse<>(
                    "ERROR",
                    "An error occurred while retrieving categories: " + e.getMessage(),
                    null
            ));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Company>> getCompanyById(@PathVariable int id) {
        Company company = companyService.getCompanyById(id);
        if (company == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse<>(
                    "ERROR",
                    "Company with ID: " + id + " not found",
                    null
            ));
        }

        return ResponseEntity.ok(new ApiResponse<>(
                "SUCCESS",
                "Successfully retrieved the company",
                company
        ));
    }

    @GetMapping("/company-status")
    public ResponseEntity<ApiResponse<Optional<CompanyStatus>>> getCompanyStatuses(
            @RequestParam(value = "id") int id) {
        try {
            Company company = companyService.getCompanyById(id);
            if (company == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse<>(
                        "ERROR",
                        "Company with ID: " + id + " not found",
                        null
                ));
            }

            Optional<CompanyStatus> statuses = companyService.getCompanyStatus(id);
            if (statuses.isEmpty()) {
                return ResponseEntity.ok(new ApiResponse<>(
                        "SUCCESS",
                        "No statuses found for company with ID: " + id,
                        statuses
                ));
            }

            return ResponseEntity.ok(new ApiResponse<>(
                    "SUCCESS",
                    "Successfully retrieved statuses for the company",
                    statuses
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiResponse<>(
                    "ERROR",
                    "An error occurred while retrieving statuses: " + e.getMessage(),
                    null
            ));
        }
    }


    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Company>> createCompany(@RequestBody Company company) {
        try {
            if (company.getName() == null || company.getName().isEmpty()) {
                return ResponseEntity.badRequest().body(new ApiResponse<>(
                        "ERROR",
                        "Company name cannot be empty",
                        null
                ));
            }

            Company savedCompany = companyService.saveCompany(company);
            return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponse<>(
                    "SUCCESS",
                    "Successfully created the company",
                    savedCompany
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ApiResponse<>(
                    "ERROR",
                    "An error occurred while create company: " + e.getMessage(),
                    null
            ));
        }
    }

    // Update a company
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Company>> updateCompany(@PathVariable int id, @RequestBody Company company) {
        Company existingCompany = companyService.getCompanyById(id);

        if (existingCompany == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse<>(
                    "ERROR",
                    "Company with ID: " + id + " not found",
                    null
            ));
        }

        company.setId(id);
        Company updatedCompany = companyService.updateCompany(company);
        return ResponseEntity.ok(new ApiResponse<>(
                "SUCCESS",
                "Successfully updated the company",
                updatedCompany
        ));
    }

    // Delete a company
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteCompany(@PathVariable int id) {
        Company company = companyService.getCompanyById(id);

        if (company == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse<>(
                    "ERROR",
                    "Company with ID: " + id + " not found",
                    null
            ));
        }

        companyService.deleteCompany(id);
        return ResponseEntity.ok(new ApiResponse<>(
                "SUCCESS",
                "Successfully deleted the company",
                null
        ));
    }
}
