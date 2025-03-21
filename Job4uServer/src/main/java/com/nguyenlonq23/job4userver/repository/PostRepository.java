package com.nguyenlonq23.job4userver.repository;

import com.nguyenlonq23.job4userver.dto.PostAdminPageDTO;
import com.nguyenlonq23.job4userver.dto.PostDetailDTO;
import com.nguyenlonq23.job4userver.dto.PostEmployerPageDTO;
import com.nguyenlonq23.job4userver.model.entity.Post;
import com.nguyenlonq23.job4userver.model.enums.PostStatus;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Lazy
@Repository
public interface PostRepository extends JpaRepository<Post, Integer> {
    List<Post> findByUserId(int userId);

    Page<Post> findByNameContainingIgnoreCase(String keyword, Pageable pageable);

    Page<Post> findByCompanyId(int companyId, Pageable pageable);

    @Query("""
                SELECT new com.nguyenlonq23.job4userver.dto.PostEmployerPageDTO(
                    p.id, p.name, p.user.first_name,p.user.last_name, p.category.name, 
                    p.jobLevel.name, p.workType.name, p.expiration_date, p.status
                )
                FROM Post p 
                WHERE p.company.id = :companyId 
                AND (:status IS NULL OR p.status = :status)
            """)
    Page<PostEmployerPageDTO> findPostsByCompanyIdAndStatusWithPagination(
            String companyId, PostStatus status, Pageable pageable
    );

    @Query("""
                SELECT new com.nguyenlonq23.job4userver.dto.PostAdminPageDTO(
                    p.id, p.name, p.user.company.name, p.category.name, 
                    p.jobLevel.name, p.workType.name, p.expiration_date, p.status
                )
                FROM Post p 
                WHERE (:status IS NULL OR p.status = :status)
            """)
    Page<PostAdminPageDTO> getPostsWithPagination(
            PostStatus status, Pageable pageable
    );

    @Query("""
                SELECT new com.nguyenlonq23.job4userver.dto.PostDetailDTO(
                    p.id,p.name, p.amount,p.description_Markdown,p.location, p.category, p.jobLevel, p.workType
                   ,p.salary,p.experience, p.user.first_name,p.user.last_name, p.expiration_date, p.status
                )
                FROM Post p 
                WHERE p.id = :id 
            """)
    Optional<PostDetailDTO> findPostDetailById(int id);

    @Query("SELECT p FROM Post p WHERE " +
            "(:keyword IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
            "(:categoryId IS NULL OR p.category.id = :categoryId) AND " +
            "(:locationId IS NULL OR p.location.id = :locationId) AND " +
            "(COALESCE(:workTypeIds, NULL) IS NULL OR p.workType.id IN :workTypeIds) AND " +
            "(COALESCE(:jobLevelIds, NULL) IS NULL OR p.jobLevel.id IN :jobLevelIds) AND " +
            "(COALESCE(:experienceIds, NULL) IS NULL OR p.experience.id IN :experienceIds) AND " +
            "p.status = :status AND " +
            "p.expiration_date >= :currentDate")
    Page<Post> findWithFilters(
            @Param("keyword") String keyword,
            @Param("categoryId") Integer categoryId,
            @Param("locationId") Integer locationId,
            @Param("workTypeIds") List<Integer> workTypeIds,
            @Param("jobLevelIds") List<Integer> jobLevelIds,
            @Param("experienceIds") List<Integer> experienceIds,
            @Param("status") PostStatus status,
            @Param("currentDate") Date currentDate,
            Pageable pageable
    );


    // Analyst
    @Query(value = "SELECT COUNT(*) FROM posts WHERE created_At >= ?1", nativeQuery = true)
    Long countPostsCreatedAfter(LocalDateTime date);

    @Query(value = "SELECT s.salary_range, COUNT(p.id) as postCount FROM salaries s " +
            "JOIN posts p ON s.id = p.salary_id " +
            "GROUP BY s.id, s.salary_range ORDER BY postCount DESC", nativeQuery = true)
    List<Map<String, Object>> findSalaryRangeDistribution();

    @Query(value = "SELECT e.name, COUNT(p.id) as postCount FROM experiences e " +
            "JOIN posts p ON e.id = p.experience_id " +
            "GROUP BY e.id, e.name ORDER BY postCount DESC", nativeQuery = true)
    List<Map<String, Object>> findExperienceDistribution();

    @Query(value = "SELECT jl.name, COUNT(p.id) as postCount FROM joblevels jl " +
            "JOIN posts p ON jl.id = p.joblevel_id " +
            "GROUP BY jl.id, jl.name ORDER BY postCount DESC", nativeQuery = true)
    List<Map<String, Object>> findJobLevelDistribution();

    @Query(value = "SELECT wt.name, COUNT(p.id) as postCount FROM worktypes wt " +
            "JOIN posts p ON wt.id = p.worktype_id " +
            "GROUP BY wt.id, wt.name ORDER BY postCount DESC", nativeQuery = true)
    List<Map<String, Object>> findWorkTypeDistribution();

    @Query(value = "SELECT DATE_FORMAT(created_At, '%Y-%m') as month, COUNT(*) as postCount " +
            "FROM posts GROUP BY month ORDER BY month ASC", nativeQuery = true)
    List<Map<String, Object>> findPostCountByMonth();

}