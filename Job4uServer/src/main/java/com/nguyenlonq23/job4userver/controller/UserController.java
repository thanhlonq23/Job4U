package com.nguyenlonq23.job4userver.controller;

import com.nguyenlonq23.job4userver.dto.response.ApiResponse;
import com.nguyenlonq23.job4userver.model.entity.User;
import com.nguyenlonq23.job4userver.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserService userService;

    // Get all users with optional keyword filter
    @GetMapping
    public ResponseEntity<ApiResponse<Page<User>>> getAllUsersWithPaginationAndFilter(
            @RequestParam(value = "keyword", required = false, defaultValue = "") String keyword, // Từ khóa tìm kiếm
            Pageable pageable
    ) {
        try {
            Page<User> users = userService.getUsersWithPaginationAndFilter(keyword, pageable);

            if (users.isEmpty()) {
                return ResponseEntity.ok(new ApiResponse<>(
                        "SUCCESS",
                        "No users found matching the criteria",
                        users
                ));
            }

            return ResponseEntity.ok(new ApiResponse<>(
                    "SUCCESS",
                    "Successfully retrieved the list of users",
                    users
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ApiResponse<>(
                    "ERROR",
                    "An error occurred while retrieving users: " + e.getMessage(),
                    null
            ));
        }
    }

    // Get user by ID
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<User>> getUserById(@PathVariable int id) {
        Optional<User> user = userService.getUserById(id);
        return user.map(value -> ResponseEntity.ok(new ApiResponse<>(
                "SUCCESS",
                "Successfully retrieved the user",
                value
        ))).orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse<>(
                "ERROR",
                "User with ID: " + id + " not found",
                null
        )));
    }


    // Update a user
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<User>> updateUser(@PathVariable int id, @RequestBody User user) {
        Optional<User> existingUserOptional = userService.getUserById(id);

        if (existingUserOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse<>(
                    "ERROR",
                    "User with ID: " + id + " not found",
                    null
            ));
        }

        User existingUser = existingUserOptional.get();

        // Kiểm tra và sao chép giá trị nếu trường trong `user` là null
        user.setId(id); // Đảm bảo ID được gán đúng
        user.setFirst_name(Optional.ofNullable(user.getFirst_name()).orElse(existingUser.getFirst_name()));
        user.setLast_name(Optional.ofNullable(user.getLast_name()).orElse(existingUser.getLast_name()));
        user.setAddress(Optional.ofNullable(user.getAddress()).orElse(existingUser.getAddress()));
        user.setPassword(Optional.ofNullable(user.getPassword()).orElse(existingUser.getPassword()));
        user.setDob(Optional.ofNullable(user.getDob()).orElse(existingUser.getDob()));
        user.setGender(Optional.ofNullable(user.getGender()).orElse(existingUser.getGender()));
        user.setRole(Optional.ofNullable(user.getRole()).orElse(existingUser.getRole()));
        user.setStatus(Optional.ofNullable(user.getStatus()).orElse(existingUser.getStatus()));
        user.setCompany(Optional.ofNullable(user.getCompany()).orElse(existingUser.getCompany()));

        // Lưu user đã cập nhật
        User updatedUser = userService.saveUser(user);

        return ResponseEntity.ok(new ApiResponse<>(
                "SUCCESS",
                "Successfully updated the user",
                updatedUser
        ));
    }


    // Delete a user
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteUserById(@PathVariable int id) {
        Optional<User> user = userService.getUserById(id);

        if (user.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse<>(
                    "ERROR",
                    "User with ID: " + id + " not found",
                    null
            ));
        }

        userService.deleteUser(id);
        return ResponseEntity.ok(new ApiResponse<>(
                "SUCCESS",
                "Successfully deleted the user",
                null
        ));
    }

    @GetMapping("/get-company-id/{id}")
    public ResponseEntity<ApiResponse<Integer>> getCompanyId(@PathVariable int id) {
        Optional<Integer> companyId = userService.getCompanyIdByUserId(id);

        if (companyId.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse<>(
                    "ERROR",
                    "CompanyId with user ID: " + id + " not found",
                    null
            ));
        }
        return ResponseEntity.ok(new ApiResponse<>(
                "SUCCESS",
                "Successfully retrieved the companyId",
                companyId.get()
        ));
    }

}
