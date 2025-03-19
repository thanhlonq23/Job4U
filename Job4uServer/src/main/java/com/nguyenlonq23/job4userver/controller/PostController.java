package com.nguyenlonq23.job4userver.controller;

import com.nguyenlonq23.job4userver.dto.*;
import com.nguyenlonq23.job4userver.dto.response.ApiResponse;
import com.nguyenlonq23.job4userver.model.entity.Post;
import com.nguyenlonq23.job4userver.model.enums.PostStatus;
import com.nguyenlonq23.job4userver.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    private final PostService postService;

    @Autowired
    public PostController(PostService postService) {
        this.postService = postService;
    }

    // Utility method for building API responses
    private <T> ResponseEntity<ApiResponse<T>> buildResponse(String status, String message, T data, HttpStatus httpStatus) {
        return ResponseEntity.status(httpStatus).body(new ApiResponse<>(status, message, data));
    }

    // Get all posts with pagination
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Page<PostAdminPageDTO>>> getAllPosts(
            @RequestParam(value = "status", required = false) String status,
            Pageable pageable) {
        try {
            PostStatus postStatus = parseStatus(status);
            pageable = (pageable == null) ? PageRequest.of(0, 10) : pageable;

            Page<PostAdminPageDTO> posts = postService.getPostsWithPagination(postStatus, pageable);
            String message = posts.isEmpty() ? "No posts found" : "Successfully retrieved the list of posts";
            return buildResponse("SUCCESS", message, posts, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return buildResponse("ERROR", e.getMessage(), null, HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return buildResponse("ERROR", "An unexpected error occurred: " + e.getMessage(), null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Search posts with filters
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Page<PostDTO>>> searchPosts(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Integer categoryId,
            @RequestParam(required = false) Integer locationId,
            @RequestParam(required = false) List<Integer> workTypeIds,
            @RequestParam(required = false) List<Integer> jobLevelIds,
            @RequestParam(required = false) List<Integer> experienceIds,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {
        try {
            Sort.Direction sortDirection = direction.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;
            Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));

            Page<PostDTO> posts = postService.searchPosts(keyword, categoryId, locationId, workTypeIds, jobLevelIds, experienceIds, pageable);
            return buildResponse("SUCCESS", "Successfully retrieved filtered posts", posts, HttpStatus.OK);
        } catch (Exception e) {
            return buildResponse("ERROR", e.getMessage(), null, HttpStatus.BAD_REQUEST);
        }
    }

    // Get posts by company ID with pagination
    @GetMapping("/company")
    public ResponseEntity<ApiResponse<Page<PostEmployerPageDTO>>> findPostsByCompanyIdWithPagination(
            @RequestParam(value = "companyId", required = false, defaultValue = "") String companyId,
            @RequestParam(value = "status", required = false) String status,
            Pageable pageable) {
        try {
            PostStatus postStatus = parseStatus(status);
            pageable = (pageable == null) ? PageRequest.of(0, 10) : pageable;

            Page<PostEmployerPageDTO> posts = postService.findPostsByCompanyIdAndStatusWithPagination(companyId, postStatus, pageable);
            String message = posts.isEmpty() ? "No posts found" : "Successfully retrieved the list of posts";
            return buildResponse("SUCCESS", message, posts, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return buildResponse("ERROR", e.getMessage(), null, HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return buildResponse("ERROR", "An unexpected error occurred: " + e.getMessage(), null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get post by ID
    @GetMapping("/get-by-id")
    public ResponseEntity<ApiResponse<PostDetailDTO>> getPostById(@RequestParam int id) {
        Optional<PostDetailDTO> post = postService.getPostDetailById(id);
        return post.map(postDetailDTO -> buildResponse("SUCCESS", "Successfully retrieved the post", postDetailDTO, HttpStatus.OK))
                .orElseGet(() -> buildResponse("ERROR", "Post with ID: " + id + " not found", null, HttpStatus.NOT_FOUND));
    }

    // Create a new post
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYER_OWNER', 'EMPLOYER_STAFF')")
    public ResponseEntity<ApiResponse<Post>> createPost(@RequestBody Post post) {
        if (post.getName() == null || post.getName().isEmpty()) {
            return buildResponse("ERROR", "Post name is required", null, HttpStatus.BAD_REQUEST);
        }
        Post createdPost = postService.createPost(post);
        return buildResponse("SUCCESS", "Successfully created the post", createdPost, HttpStatus.CREATED);
    }

    // Utility method to parse status
    private PostStatus parseStatus(String status) {
        if (status == null || status.isEmpty()) {
            return null;
        }
        try {
            return PostStatus.valueOf(status);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid status value: " + status);
        }
    }
}