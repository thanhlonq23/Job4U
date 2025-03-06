package com.nguyenlonq23.job4userver.controller;

import com.nguyenlonq23.job4userver.model.entity.WorkType;
import com.nguyenlonq23.job4userver.model.response.ApiResponse;
import com.nguyenlonq23.job4userver.service.WorkTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/work-types")
public class WorkTypeController {
    @Autowired
    private WorkTypeService workTypeService;

    // Get all work types
    @GetMapping
    public ResponseEntity<ApiResponse<Page<WorkType>>> getAllWorkTypes(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size
    ) {
        Page<WorkType> workTypes = workTypeService.getWorkTypesWithPagination(page, size);

        return ResponseEntity.ok(new ApiResponse<>(
                "SUCCESS",
                "Successfully retrieved the list of work types",
                workTypes // Trả về toàn bộ đối tượng Page
        ));
    }


    // Get work type by ID
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<WorkType>> getWorkTypeById(@PathVariable int id) {
        WorkType workType = workTypeService.getWorkTypeById(id);
        if (workType != null) {
            return ResponseEntity.ok(new ApiResponse<>(
                    "SUCCESS",
                    "Successfully retrieved the work type",
                    workType
            ));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse<>(
                    "ERROR",
                    "Work type with ID: " + id + " not found",
                    null
            ));
        }
    }

    // Create a new work type
    @PostMapping
    public ResponseEntity<ApiResponse<WorkType>> createWorkType(@RequestBody WorkType workType) {
        if (workType.getName() == null || workType.getName().isEmpty()) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(
                    "ERROR",
                    "Work type name is required",
                    null
            ));
        }

        WorkType savedWorkType = workTypeService.saveWorkType(workType);
        return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponse<>(
                "SUCCESS",
                "Successfully created the work type",
                savedWorkType
        ));
    }

    // Update a work type
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<WorkType>> updateWorkType(
            @PathVariable int id,
            @RequestBody WorkType workType) {
        WorkType existingWorkType = workTypeService.getWorkTypeById(id);
        if (existingWorkType == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse<>(
                    "ERROR",
                    "Work type with ID: " + id + " not found",
                    null
            ));
        }

        workType.setId(id);
        WorkType updatedWorkType = workTypeService.saveWorkType(workType);
        return ResponseEntity.ok(new ApiResponse<>(
                "SUCCESS",
                "Successfully updated the work type",
                updatedWorkType
        ));
    }

    // Delete a work type
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteWorkType(@PathVariable int id) {
        WorkType existingWorkType = workTypeService.getWorkTypeById(id);
        if (existingWorkType == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse<>(
                    "ERROR",
                    "Work type with ID: " + id + " not found",
                    null
            ));
        }

        workTypeService.deleteWorkType(id);
        return ResponseEntity.ok(new ApiResponse<>(
                "SUCCESS",
                "Successfully deleted the work type",
                null
        ));
    }
}
