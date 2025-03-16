package com.nguyenlonq23.job4userver.controller;

import com.nguyenlonq23.job4userver.dto.*;
import com.nguyenlonq23.job4userver.model.entity.Post;
import com.nguyenlonq23.job4userver.dto.response.ApiResponse;
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
import java.util.NoSuchElementException;
import java.util.Optional;

@RestController
@RequestMapping("/api/posts")
public class PostController {
    private final PostService postService;

    @Autowired
    public PostController(PostService postService) {
        this.postService = postService;
    }

    // Get all posts with pagination
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Page<PostAdminPageDTO>>> getAllPosts(
            @RequestParam(value = "status", required = false) String status,
            Pageable pageable
    ) {
        try {
            // Kiểm tra và chuyển đổi status sang Enum
            PostStatus postStatus = null;
            if (status != null && !status.isEmpty()) {
                try {
                    postStatus = PostStatus.valueOf(status);
                } catch (IllegalArgumentException e) {
                    return ResponseEntity.badRequest().body(new ApiResponse<>(
                            "ERROR",
                            "Invalid status value: " + status,
                            null
                    ));
                }
            }

            // Xử lý null cho pageable nếu cần
            if (pageable == null) {
                pageable = PageRequest.of(0, 10); // Giá trị mặc định
            }

            // Lấy danh sách bài viết với phân trang
            Page<PostAdminPageDTO> posts = postService.getPostsWithPagination(postStatus, pageable);

            // Kiểm tra kết quả trả về
            if (posts.isEmpty()) {
                return ResponseEntity.ok(new ApiResponse<>(
                        "SUCCESS",
                        "No posts found",
                        posts
                ));
            }

            return ResponseEntity.ok(new ApiResponse<>(
                    "SUCCESS",
                    "Successfully retrieved the list of posts",
                    posts
            ));
        } catch (Exception e) {
            // Xử lý lỗi không mong đợi
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiResponse<>(
                    "ERROR",
                    "An unexpected error occurred: " + e.getMessage(),
                    null
            ));
        }
    }

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
            @RequestParam(defaultValue = "desc") String direction
    ) {
        try {
            Sort.Direction sortDirection = direction.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;
            Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));

            Page<PostDTO> posts = postService.searchPosts(keyword, categoryId, locationId,
                    workTypeIds, jobLevelIds, experienceIds, pageable);

            return ResponseEntity.ok(new ApiResponse<>(
                    "SUCCESS",
                    "Successfully retrieved filtered posts",
                    posts
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(
                    "ERROR",
                    e.getMessage(),
                    null
            ));
        }
    }


    // Get all posts by company Id with pagination
    @GetMapping("/company")
    public ResponseEntity<ApiResponse<Page<PostEmployerPageDTO>>> findPostsByCompanyIdWithPagination(
            @RequestParam(value = "companyId", required = false, defaultValue = "") String companyId,
            @RequestParam(value = "status", required = false) String status,
            Pageable pageable
    ) {
        try {
            // Chuyển đổi status sang Enum
            PostStatus postStatus;
            try {
                postStatus = parseStatus(status);
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().body(new ApiResponse<>(
                        "ERROR",
                        e.getMessage(),
                        null
                ));
            }

            // Xử lý null cho Pageable
            if (pageable == null) {
                pageable = PageRequest.of(0, 10); // Giá trị mặc định
            }

            // Lấy danh sách bài viết theo công ty và trạng thái
            Page<PostEmployerPageDTO> posts = postService.findPostsByCompanyIdAndStatusWithPagination(
                    companyId,
                    postStatus,
                    pageable
            );

            // Kiểm tra kết quả trả về
            if (posts.isEmpty()) {
                return ResponseEntity.ok(new ApiResponse<>(
                        "SUCCESS",
                        "No posts found",
                        posts
                ));
            }

            return ResponseEntity.ok(new ApiResponse<>(
                    "SUCCESS",
                    "Successfully retrieved the list of posts",
                    posts
            ));
        } catch (Exception e) {
            // Xử lý lỗi không mong đợi
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiResponse<>(
                    "ERROR",
                    "An error occurred while retrieving posts: " + e.getMessage(),
                    null
            ));
        }
    }

    // Phương thức phụ để chuyển đổi status
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


    // Get post by ID
    @GetMapping("/get-by-id")
    public ResponseEntity<ApiResponse<PostDetailDTO>> getPostById(@RequestParam int id) {
        Optional<PostDetailDTO> post = postService.getPostDetailById(id);
        return post.map(postDetailDTO -> ResponseEntity.ok(new ApiResponse<>(
                "SUCCESS",
                "Successfully retrieved the post",
                postDetailDTO
        ))).orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse<>(
                "ERROR",
                "Post with ID: " + id + " not found",
                null
        )));
    }

    // Get post detail
    @GetMapping("/get-post-detail")
    public ResponseEntity<ApiResponse<PostDetailPageDTO>> getPostDetailById(@RequestParam Integer id) {
        try {
            if (id == null || id <= 0) {
                return ResponseEntity.badRequest().body(new ApiResponse<>(
                        "ERROR",
                        "Invalid post ID",
                        null
                ));
            }

            PostDetailPageDTO post = postService.getPostDetailById(id);

            return ResponseEntity.ok(new ApiResponse<>(
                    "SUCCESS",
                    "Successfully retrieved post information",
                    post
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse<>(
                    "ERROR",
                    e.getMessage(),
                    null
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiResponse<>(
                    "ERROR",
                    "An unexpected error occurred: " + e.getMessage(),
                    null
            ));
        }
    }

    // Get posts by user ID
    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<Post>>> getPostsByUserId(@PathVariable int userId) {
        List<Post> posts = postService.getPostsByUserId(userId);
        return ResponseEntity.ok(new ApiResponse<>(
                "SUCCESS",
                "Successfully retrieved posts by user ID",
                posts
        ));
    }

    // Get posts by company ID with pagination
    @GetMapping("/company/{companyId}")
    public ResponseEntity<ApiResponse<Page<Post>>> getPostsByCompanyId(
            @PathVariable int companyId,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size
    ) {
        Page<Post> posts = postService.getPostsByCompanyId(companyId, page, size);
        return ResponseEntity.ok(new ApiResponse<>(
                "SUCCESS",
                "Successfully retrieved posts by company ID",
                posts
        ));
    }

    // Create a new post
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYER_OWNER', 'EMPLOYER_STAFF')")
    public ResponseEntity<ApiResponse<Post>> createPost(@RequestBody Post post) {
        if (post.getName() == null || post.getName().isEmpty()) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(
                    "ERROR",
                    "Post name is required",
                    null
            ));
        }

        Post createdPost = postService.createPost(post);
        return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponse<>(
                "SUCCESS",
                "Successfully created the post",
                createdPost
        ));
    }

    // Update a post
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYER_OWNER', 'EMPLOYER_STAFF')")
    public ResponseEntity<ApiResponse<Post>> updatePost(@PathVariable int id, @RequestBody Post post) {
        Optional<Post> existingPost = postService.getPostById(id);
        if (existingPost.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse<>(
                    "ERROR",
                    "Post with ID: " + id + " not found",
                    null
            ));
        }

        post.setId(id);
        Post updatedPost = postService.updatePost(post);
        return ResponseEntity.ok(new ApiResponse<>(
                "SUCCESS",
                "Successfully updated the post",
                updatedPost
        ));
    }

    // Delete a post
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYER_OWNER', 'EMPLOYER_STAFF')")
    public ResponseEntity<ApiResponse<Post>> deletePost(@PathVariable int id) {
        Optional<Post> existingPost = postService.getPostById(id);
        if (existingPost.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse<>(
                    "ERROR",
                    "Post with ID: " + id + " not found",
                    null
            ));
        }

        postService.deletePost(id);
        return ResponseEntity.ok(new ApiResponse<>(
                "SUCCESS",
                "Successfully deleted the post",
                null
        ));
    }

    @PutMapping("/update-status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> updatePostStatus(
            @RequestParam("id") int id,
            @RequestParam("status") PostStatus status) {

        if (status == null) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(
                    "ERROR",
                    "Status field is required",
                    null
            ));
        }

        try {
            postService.updatePostStatus(id, status);

            return ResponseEntity.ok(new ApiResponse<>(
                    "SUCCESS",
                    "Post status updated successfully",
                    null
            ));
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse<>(
                    "ERROR",
                    e.getMessage(),
                    null
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(
                    "ERROR",
                    "Invalid status value: " + status,
                    null
            ));
        }
    }


}