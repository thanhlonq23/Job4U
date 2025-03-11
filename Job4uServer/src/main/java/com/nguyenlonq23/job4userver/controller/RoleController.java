package com.nguyenlonq23.job4userver.controller;

import com.nguyenlonq23.job4userver.dto.response.ApiResponse;
import com.nguyenlonq23.job4userver.model.entity.Role;
import com.nguyenlonq23.job4userver.model.entity.Salary;
import com.nguyenlonq23.job4userver.repository.RoleRepository;
import com.nguyenlonq23.job4userver.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/roles")
public class RoleController {
    @Autowired
    RoleService roleService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Role>>> getAllRole() {
        try {
            List<Role> roles = roleService.getAllRole();

            if (roles.isEmpty()) {
                return ResponseEntity.ok(new ApiResponse<>(
                        "SUCCESS",
                        "Successfully retrieved the list of role",
                        roles
                ));
            }

            return ResponseEntity.ok(new ApiResponse<>(
                    "SUCCESS",
                    "Successfully retrieved the list of role",
                    roles
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ApiResponse<>(
                    "ERROR",
                    "An error occurred while retrieving role: " + e.getMessage(),
                    null
            ));
        }
    }
}
