package com.nguyenlonq23.job4userver.controller;

import com.nguyenlonq23.job4userver.model.entity.WorkType;
import com.nguyenlonq23.job4userver.dto.response.ApiResponse;
import com.nguyenlonq23.job4userver.service.WorkTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/work-types")
public class WorkTypeController {
    @Autowired
    private WorkTypeService workTypeService;

    private <T> ResponseEntity<ApiResponse<T>> buildResponse(String status, String message, T data, HttpStatus httpStatus) {
        return ResponseEntity.status(httpStatus).body(new ApiResponse<>(status, message, data));
    }

    // Get all work types
    @GetMapping
    public ResponseEntity<ApiResponse<List<WorkType>>> getAllWorkTypes() {
        List<WorkType> workTypes = workTypeService.getAllWorkTypes();
        String message = workTypes.isEmpty() ? "No work types found" : "Successfully retrieved the list of work types";
        return buildResponse("SUCCESS", message, workTypes, HttpStatus.OK);
    }

    // Get paginated work types
    @GetMapping("/page")
    public ResponseEntity<ApiResponse<Page<WorkType>>> getAllWorkTypes(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size
    ) {
        Page<WorkType> workTypes = workTypeService.getWorkTypesWithPagination(page, size);
        String message = workTypes.isEmpty() ? "No work types found" : "Successfully retrieved the list of work types";
        return buildResponse("SUCCESS", message, workTypes, HttpStatus.OK);
    }

    // Get work type by ID
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<WorkType>> getWorkTypeById(@PathVariable int id) {
        WorkType workType = workTypeService.getWorkTypeById(id);
        if (workType == null) {
            return buildResponse("ERROR", "Work type with ID: " + id + " not found", null, HttpStatus.NOT_FOUND);
        }
        return buildResponse("SUCCESS", "Successfully retrieved the work type", workType, HttpStatus.OK);
    }

    // Create a new work type
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<WorkType>> createWorkType(@RequestBody WorkType workType) {
        if (workType.getName() == null || workType.getName().isEmpty()) {
            return buildResponse("ERROR", "Work type name is required", null, HttpStatus.BAD_REQUEST);
        }
        WorkType savedWorkType = workTypeService.saveWorkType(workType);
        return buildResponse("SUCCESS", "Successfully created the work type", savedWorkType, HttpStatus.CREATED);
    }

    // Update a work type
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<WorkType>> updateWorkType(
            @PathVariable int id,
            @RequestBody WorkType workType) {
        WorkType existingWorkType = workTypeService.getWorkTypeById(id);
        if (existingWorkType == null) {
            return buildResponse("ERROR", "Work type with ID: " + id + " not found", null, HttpStatus.NOT_FOUND);
        }
        workType.setId(id);
        WorkType updatedWorkType = workTypeService.saveWorkType(workType);
        return buildResponse("SUCCESS", "Successfully updated the work type", updatedWorkType, HttpStatus.OK);
    }

    // Delete a work type
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteWorkType(@PathVariable int id) {
        WorkType existingWorkType = workTypeService.getWorkTypeById(id);
        if (existingWorkType == null) {
            return buildResponse("ERROR", "Work type with ID: " + id + " not found", null, HttpStatus.NOT_FOUND);
        }
        workTypeService.deleteWorkType(id);
        return buildResponse("SUCCESS", "Successfully deleted the work type", null, HttpStatus.OK);
    }
}
