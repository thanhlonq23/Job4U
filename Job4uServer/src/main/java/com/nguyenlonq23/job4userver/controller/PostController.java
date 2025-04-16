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

    public PostController(PostService postService) {
        this.postService = postService;
    }

    // Utility method to parse and validate PostStatus
    private PostStatus parseStatus(String status) {
        if (status == null || status.isEmpty()) return null;
        try {
            return PostStatus.valueOf(status);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid status value: " + status);
        }
    }

    private Pageable createPageable(Integer page, Integer size, String sortBy, String direction) {
        Sort.Direction sortDirection = "asc".equalsIgnoreCase(direction) ? Sort.Direction.ASC : Sort.Direction.DESC;
        return PageRequest.of(page != null ? page : 0, size != null ? size : 10, Sort.by(sortDirection, sortBy));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Page<PostAdminPageDTO>>> getAllPosts(
            @RequestParam(value = "status", required = false) String status,
            Pageable pageable) {
        try {
            PostStatus postStatus = parseStatus(status);
            pageable = pageable == null ? PageRequest.of(0, 10) : pageable;
            Page<PostAdminPageDTO> posts = postService.getPostsWithPagination(postStatus, pageable);
            return ResponseEntity.ok(new ApiResponse<>("SUCCESS", "Retrieved posts", posts));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>("ERROR", e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiResponse<>("ERROR", e.getMessage(), null));
        }
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Page<PostDTO>>> searchPosts(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Integer categoryId,
            @RequestParam(required = false) Integer locationId,
            @RequestParam(required = false) Integer companyId,
            @RequestParam(required = false) List<Integer> workTypeIds,
            @RequestParam(required = false) List<Integer> jobLevelIds,
            @RequestParam(required = false) List<Integer> experienceIds,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {
        try {
            Pageable pageable = createPageable(page, size, sortBy, direction);
            Page<PostDTO> posts = postService.searchPosts(keyword, categoryId, locationId,
                    workTypeIds, jobLevelIds, experienceIds, companyId, pageable);
            return ResponseEntity.ok(new ApiResponse<>("SUCCESS", "Filtered posts retrieved", posts));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>("ERROR", e.getMessage(), null));
        }
    }

    @GetMapping("/company")
    public ResponseEntity<ApiResponse<Page<PostEmployerPageDTO>>> findPostsByCompanyIdWithPagination(
            @RequestParam(value = "companyId", required = false) String companyId,
            @RequestParam(value = "status", required = false) String status,
            Pageable pageable) {
        try {
            PostStatus postStatus = parseStatus(status);
            pageable = pageable == null ? PageRequest.of(0, 10) : pageable;
            Page<PostEmployerPageDTO> posts = postService.findPostsByCompanyIdAndStatusWithPagination(companyId, postStatus, pageable);
            return ResponseEntity.ok(new ApiResponse<>("SUCCESS", "Retrieved posts by company ID", posts));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>("ERROR", e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiResponse<>("ERROR", e.getMessage(), null));
        }
    }

    @GetMapping("/get-by-id")
    public ResponseEntity<ApiResponse<PostDetailDTO>> getPostById(@RequestParam int id) {
        Optional<PostDetailDTO> post = postService.getPostDetailById(id);
        return post.map(detail -> ResponseEntity.ok(new ApiResponse<>("SUCCESS", "Post retrieved", detail)))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse<>("ERROR", "Post not found", null)));
    }

    @GetMapping("/get-post-detail")
    public ResponseEntity<ApiResponse<PostDetailPageDTO>> getPostDetailById(@RequestParam Integer id) {
        try {
            if (id == null || id <= 0) {
                throw new IllegalArgumentException("Invalid post ID");
            }
            PostDetailPageDTO post = postService.getPostDetailById(id);
            return ResponseEntity.ok(new ApiResponse<>("SUCCESS", "Post details retrieved", post));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse<>("ERROR", e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiResponse<>("ERROR", e.getMessage(), null));
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<Post>>> getPostsByUserId(@PathVariable int userId) {
        List<Post> posts = postService.getPostsByUserId(userId);
        return ResponseEntity.ok(new ApiResponse<>("SUCCESS", "Posts retrieved by user ID", posts));
    }

    @GetMapping("/company/{companyId}")
    public ResponseEntity<ApiResponse<Page<Post>>> getPostsByCompanyId(
            @PathVariable int companyId,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size) {
        Page<Post> posts = postService.getPostsByCompanyId(companyId, page, size);
        return ResponseEntity.ok(new ApiResponse<>("SUCCESS", "Posts retrieved by company ID", posts));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYER_OWNER', 'EMPLOYER_STAFF')")
    public ResponseEntity<ApiResponse<Post>> createPost(@RequestBody Post post) {
        if (post.getName() == null || post.getName().isEmpty()) {
            return ResponseEntity.badRequest().body(new ApiResponse<>("ERROR", "Post name is required", null));
        }
        Post createdPost = postService.createPost(post);
        return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponse<>("SUCCESS", "Post created", createdPost));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYER_OWNER', 'EMPLOYER_STAFF')")
    public ResponseEntity<ApiResponse<Post>> updatePost(@PathVariable int id, @RequestBody Post post) {
        Optional<Post> existingPost = postService.getPostById(id);
        if (existingPost.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse<>("ERROR", "Post not found", null));
        }
        post.setId(id);
        Post updatedPost = postService.updatePost(post);
        return ResponseEntity.ok(new ApiResponse<>("SUCCESS", "Post updated", updatedPost));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYER_OWNER', 'EMPLOYER_STAFF')")
    public ResponseEntity<ApiResponse<Void>> deletePost(@PathVariable int id) {
        Optional<Post> existingPost = postService.getPostById(id);
        if (existingPost.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse<>("ERROR", "Post not found", null));
        }
        postService.deletePost(id);
        return ResponseEntity.ok(new ApiResponse<>("SUCCESS", "Post deleted", null));
    }

    @PutMapping("/update-status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> updatePostStatus(
            @RequestParam("id") int id,
            @RequestParam("status") PostStatus status) {
        try {
            postService.updatePostStatus(id, status);
            return ResponseEntity.ok(new ApiResponse<>("SUCCESS", "Post status updated", null));
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse<>("ERROR", e.getMessage(), null));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>("ERROR", e.getMessage(), null));
        }
    }
}