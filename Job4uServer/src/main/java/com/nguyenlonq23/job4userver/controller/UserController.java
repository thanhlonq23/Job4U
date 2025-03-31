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

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<User>>> getAllUsersWithPaginationAndFilter(
            @RequestParam(value = "keyword", required = false, defaultValue = "") String keyword,
            Pageable pageable) {
        try {
            Page<User> users = userService.getUsersWithPaginationAndFilter(keyword, pageable);
            String message = users.isEmpty() ? "No users found matching the criteria." : "Successfully retrieved the list of users.";
            return buildResponse("SUCCESS", message, users, HttpStatus.OK);
        } catch (Exception e) {
            return buildResponse("ERROR", "An error occurred while retrieving users: " + e.getMessage(), null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<User>> getUserById(@PathVariable int id) {
        return userService.getUserById(id)
                .map(user -> buildResponse("SUCCESS", "Successfully retrieved the user.", user, HttpStatus.OK))
                .orElse(buildResponse("ERROR", "User with ID: " + id + " not found.", null, HttpStatus.NOT_FOUND));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<User>> updateUser(@PathVariable int id, @RequestBody User user) {
        return userService.getUserById(id)
                .map(existingUser -> {
                    updateNonNullFields(existingUser, user);
                    User updatedUser = userService.saveUser(existingUser);
                    return buildResponse("SUCCESS", "Successfully updated the user.", updatedUser, HttpStatus.OK);
                })
                .orElse(buildResponse("ERROR", "User with ID: " + id + " not found.", null, HttpStatus.NOT_FOUND));
    }

    @PutMapping("/update-company")
    @PreAuthorize("hasRole('EMPLOYER_OWNER')")
    public ResponseEntity<User> updateUserCompany(@RequestParam int userId, @RequestParam int companyId) {
        User updatedUser = userService.updateCompanyForUser(userId, companyId);
        return ResponseEntity.ok(updatedUser);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteUserById(@PathVariable int id) {
        Optional<User> user = userService.getUserById(id);

        if (user.isEmpty()) {
            return buildResponse("ERROR", "User with ID: " + id + " not found.", null, HttpStatus.NOT_FOUND);
        }

        userService.deleteUser(id);
        return buildResponse("SUCCESS", "Successfully deleted the user.", null, HttpStatus.OK);
    }


    @GetMapping("/get-company-id/{id}")
    public ResponseEntity<ApiResponse<Integer>> getCompanyId(@PathVariable int id) {
        return userService.getCompanyIdByUserId(id)
                .map(companyId -> buildResponse("SUCCESS", "Successfully retrieved the companyId.", companyId, HttpStatus.OK))
                .orElse(buildResponse("ERROR", "CompanyId with user ID: " + id + " not found.", null, HttpStatus.NOT_FOUND));
    }

    private <T> ResponseEntity<ApiResponse<T>> buildResponse(String status, String message, T data, HttpStatus httpStatus) {
        if (data == null) {
            return ResponseEntity.status(httpStatus).body(new ApiResponse<>(status, message, null));
        }
        return ResponseEntity.status(httpStatus).body(new ApiResponse<>(status, message, data));
    }


    private void updateNonNullFields(User existingUser, User newUser) {
        existingUser.setFirst_name(Optional.ofNullable(newUser.getFirst_name()).orElse(existingUser.getFirst_name()));
        existingUser.setLast_name(Optional.ofNullable(newUser.getLast_name()).orElse(existingUser.getLast_name()));
        existingUser.setAddress(Optional.ofNullable(newUser.getAddress()).orElse(existingUser.getAddress()));
        existingUser.setEmail(Optional.ofNullable(newUser.getEmail()).orElse(existingUser.getEmail()));
        existingUser.setPassword(Optional.ofNullable(newUser.getPassword()).orElse(existingUser.getPassword()));
        existingUser.setDob(Optional.ofNullable(newUser.getDob()).orElse(existingUser.getDob()));
        existingUser.setGender(Optional.ofNullable(newUser.getGender()).orElse(existingUser.getGender()));
        existingUser.setRole(Optional.ofNullable(newUser.getRole()).orElse(existingUser.getRole()));
        existingUser.setStatus(Optional.ofNullable(newUser.getStatus()).orElse(existingUser.getStatus()));
        existingUser.setCompany(Optional.ofNullable(newUser.getCompany()).orElse(existingUser.getCompany()));
    }
}
