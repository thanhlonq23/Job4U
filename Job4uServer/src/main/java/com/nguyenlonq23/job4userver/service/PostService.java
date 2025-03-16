package com.nguyenlonq23.job4userver.service;

import com.nguyenlonq23.job4userver.dto.*;
import com.nguyenlonq23.job4userver.mapper.PostMapper;
import com.nguyenlonq23.job4userver.model.entity.Post;
import com.nguyenlonq23.job4userver.model.enums.PostStatus;
import com.nguyenlonq23.job4userver.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.stream.Collectors;

@Lazy
@Service
public class PostService {
    private final PostRepository postRepository;
    private final PostMapper postMapper;

    @Autowired
    public PostService(PostRepository postRepository, PostMapper postMapper) {
        this.postRepository = postRepository;
        this.postMapper = postMapper;
    }

    // Lấy bài đăng với phân trang
    public Page<PostAdminPageDTO> getPostsWithPagination(PostStatus status, Pageable pageable) {
        return postRepository.getPostsWithPagination(status, pageable);
    }

    // Lấy tất cả categories kèm phân trang và từ khóa tìm kiếm,sort
    public Page<PostEmployerPageDTO> findPostsByCompanyIdAndStatusWithPagination(
            String companyId, PostStatus status, Pageable pageable
    ) {
        return postRepository.findPostsByCompanyIdAndStatusWithPagination(companyId, status, pageable);
    }

    // Lấy bài đăng theo ID
    public Optional<Post> getPostById(int id) {
        return postRepository.findById(id);
    }

    public PostDetailPageDTO getPostDetailById(Integer id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found with id: " + id));

        PostDetailPageDTO dto = new PostDetailPageDTO();
        dto.setName(post.getName());
        dto.setDescriptionMarkdown(post.getDescription_Markdown());
        dto.setExpirationDate(post.getExpiration_date());
        dto.setAmount(post.getAmount());

        // Location
        PostDetailPageDTO.LocationDTO locationDTO = new PostDetailPageDTO.LocationDTO();
        locationDTO.setId(post.getLocation().getId());
        locationDTO.setName(post.getLocation().getName());
        dto.setLocation(locationDTO);

        // Salary
        PostDetailPageDTO.SalaryDTO salaryDTO = new PostDetailPageDTO.SalaryDTO();
        salaryDTO.setId(post.getSalary().getId());
        salaryDTO.setName(post.getSalary().getName());
        dto.setSalary(salaryDTO);

        // JobLevel
        PostDetailPageDTO.JobLevelDTO jobLevelDTO = new PostDetailPageDTO.JobLevelDTO();
        jobLevelDTO.setId(post.getJobLevel().getId());
        jobLevelDTO.setName(post.getJobLevel().getName());
        dto.setJobLevel(jobLevelDTO);

        // WorkType
        PostDetailPageDTO.WorkTypeDTO workTypeDTO = new PostDetailPageDTO.WorkTypeDTO();
        workTypeDTO.setId(post.getWorkType().getId());
        workTypeDTO.setName(post.getWorkType().getName());
        dto.setWorkType(workTypeDTO);

        // Experience
        PostDetailPageDTO.ExperienceDTO experienceDTO = new PostDetailPageDTO.ExperienceDTO();
        experienceDTO.setId(post.getExperience().getId());
        experienceDTO.setName(post.getExperience().getName());
        dto.setExperience(experienceDTO);

        // Company
        PostDetailPageDTO.CompanyDTO companyDTO = new PostDetailPageDTO.CompanyDTO();
        companyDTO.setId(post.getCompany().getId());
        companyDTO.setName(post.getCompany().getName());
        companyDTO.setThumbnail(post.getCompany().getThumbnail());
        companyDTO.setCoverImage(post.getCompany().getCoverImage());
        companyDTO.setWebsite(post.getCompany().getWebsite());
        companyDTO.setAddress(post.getCompany().getAddress());
        companyDTO.setEmail(post.getCompany().getEmail());
        dto.setCompany(companyDTO);

        return dto;
    }

    public Optional<PostDetailDTO> getPostDetailById(int id) {
        return postRepository.findPostDetailById(id);
    }

    // Lấy bài đăng theo userId
    public List<Post> getPostsByUserId(int userId) {
        return postRepository.findByUserId(userId);
    }

    // Lấy bài đăng theo companyId có phân trang
    public Page<Post> getPostsByCompanyId(int companyId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return postRepository.findByCompanyId(companyId, pageable);
    }

    // Tạo mới bài đăng
    public Post createPost(Post post) {
        Date now = new Date();
        post.setCreatedAt(now);
        post.setUpdatedAt(now);
        return postRepository.save(post);
    }

    // Cập nhật bài đăng
    public Post updatePost(Post post) {
        Post existingPost = postRepository.findById(post.getId()).orElse(null);
        if (existingPost != null) {
            post.setCreatedAt(existingPost.getCreatedAt());
            post.setUpdatedAt(new Date());
            return postRepository.save(post);
        }
        return null;
    }

    // Xóa bài đăng
    public void deletePost(int id) {
        postRepository.deleteById(id);
    }

    public void updatePostStatus(int postId, PostStatus status) {
        Post post = postRepository.findById(postId).orElse(null);
        if (post == null) {
            throw new NoSuchElementException("Post with ID: " + postId + " not found");
        }
        post.setStatus(status);
        postRepository.save(post);
    }

    // Tìm kiếm nâng cao
    public Page<PostDTO> searchPosts(String keyword, Integer categoryId, Integer locationId,
                                     List<Integer> workTypeIds, List<Integer> jobLevelIds,
                                     List<Integer> experienceIds, Pageable pageable) {

        Page<Post> postsPage = postRepository.findWithFilters(
                keyword, categoryId, locationId, workTypeIds, jobLevelIds, experienceIds,
                PostStatus.ACTIVE, new Date(), pageable
        );

        List<PostDTO> postDTOs = postsPage.getContent()
                .stream()
                .map(postMapper::toPageDTO)
                .collect(Collectors.toList());

        return new PageImpl<>(postDTOs, pageable, postsPage.getTotalElements());
    }

}