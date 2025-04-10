package com.nguyenlonq23.job4userver.controller;

import com.nguyenlonq23.job4userver.dto.CompanyDTO;
import com.nguyenlonq23.job4userver.dto.CompanyDetailDTO;
import com.nguyenlonq23.job4userver.dto.response.ApiResponse;
import com.nguyenlonq23.job4userver.model.entity.Company;
import com.nguyenlonq23.job4userver.model.enums.CompanyStatus;
import com.nguyenlonq23.job4userver.service.CompanyService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/companies")
public class CompanyController {

    private final CompanyService companyService;

    public CompanyController(CompanyService companyService) {
        this.companyService = companyService;
    }

    // Retrieve a paginated and filtered list of companies.
    @GetMapping
    public ResponseEntity<ApiResponse<Page<Company>>> getAllCompaniesWithPaginationAndFilter(
            @RequestParam(value = "keyword", required = false, defaultValue = "") String keyword,
            Pageable pageable
    ) {
        try {
            Page<Company> companies = companyService.getCompaniesWithPaginationAndFilter(keyword, pageable);
            String message = companies.isEmpty() ? "No companies found matching the criteria" : "Successfully retrieved the list of companies";
            return buildResponse("SUCCESS", message, companies, HttpStatus.OK);
        } catch (Exception e) {
            return buildResponse("ERROR", "An error occurred while retrieving companies: " + e.getMessage(), null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    // Retrieve a company by its ID.
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Company>> getCompanyById(@PathVariable int id) {
        Company company = companyService.getCompanyById(id);
        if (company == null) {
            return buildResponse("ERROR", "Company with ID: " + id + " not found", null, HttpStatus.NOT_FOUND);
        }
        return buildResponse("SUCCESS", "Successfully retrieved the company", company, HttpStatus.OK);
    }

    @GetMapping("/detail/{id}")
    public ResponseEntity<ApiResponse<CompanyDetailDTO>> getCompanyDetail(@PathVariable("id") int id) {
        try {
            Optional<CompanyDetailDTO> companyDetail = companyService.getCompanyDetailById(id);
            if (companyDetail.isPresent()) {
                return ResponseEntity.ok(new ApiResponse<>("SUCCESS", "Company detail retrieved", companyDetail.get()));
            } else {
                return ResponseEntity.status(404).body(new ApiResponse<>("ERROR", "Company not found", null));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>("ERROR", e.getMessage(), null));
        }
    }


    // Retrieve the status of a company by its ID.
    @GetMapping("/company-status")
    public ResponseEntity<ApiResponse<Optional<CompanyStatus>>> getCompanyStatuses(@RequestParam(value = "id") int id) {
        try {
            Company company = companyService.getCompanyById(id);
            if (company == null) {
                return buildResponse("ERROR", "Company with ID: " + id + " not found", null, HttpStatus.NOT_FOUND);
            }
            Optional<CompanyStatus> statuses = companyService.getCompanyStatus(id);
            String message = statuses.isEmpty() ? "No statuses found for company with ID: " + id : "Successfully retrieved statuses for the company";
            return buildResponse("SUCCESS", message, statuses, HttpStatus.OK);
        } catch (Exception e) {
            return buildResponse("ERROR", "An error occurred while retrieving statuses: " + e.getMessage(), null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Page<CompanyDTO>>> searchCompanies(
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {
        try {
            Pageable pageable = createPageable(page, size, sortBy, direction);
            Page<CompanyDTO> companies = companyService.searchCompanies(keyword, pageable);
            return ResponseEntity.ok(new ApiResponse<>("SUCCESS", "Filtered companies retrieved", companies));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>("ERROR", e.getMessage(), null));
        }
    }


    // Create a new company.
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYER_OWNER')")
    public ResponseEntity<ApiResponse<Company>> createCompany(@RequestBody Company company) {
        try {
            if (company.getName() == null || company.getName().isEmpty()) {
                return buildResponse("ERROR", "Company name cannot be empty", null, HttpStatus.BAD_REQUEST);
            }
            Company savedCompany = companyService.saveCompany(company);
            return buildResponse("SUCCESS", "Successfully created the company", savedCompany, HttpStatus.CREATED);
        } catch (Exception e) {
            return buildResponse("ERROR", "An error occurred while creating company: " + e.getMessage(), null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    // Update an existing company by its ID.
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYER_OWNER')")
    public ResponseEntity<ApiResponse<Company>> updateCompany(@PathVariable int id, @RequestBody Company company) {
        if (companyService.getCompanyById(id) == null) {
            return buildResponse("ERROR", "Company with ID: " + id + " not found", null, HttpStatus.NOT_FOUND);
        }
        company.setId(id);
        Company updatedCompany = companyService.updateCompany(company);
        return buildResponse("SUCCESS", "Successfully updated the company", updatedCompany, HttpStatus.OK);
    }


    // Delete a company by its ID.
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteCompany(@PathVariable int id) {
        if (companyService.getCompanyById(id) == null) {
            return buildResponse("ERROR", "Company with ID: " + id + " not found", null, HttpStatus.NOT_FOUND);
        }
        companyService.deleteCompany(id);
        return buildResponse("SUCCESS", "Successfully deleted the company", null, HttpStatus.OK);
    }

    private <T> ResponseEntity<ApiResponse<T>> buildResponse(String status, String message, T data, HttpStatus httpStatus) {
        return ResponseEntity.status(httpStatus).body(new ApiResponse<>(status, message, data));
    }

    private Pageable createPageable(int page, int size, String sortBy, String direction) {
        Sort.Direction sortDirection = Sort.Direction.fromString(direction);
        return PageRequest.of(page, size, Sort.by(sortDirection, sortBy));
    }
}
