package com.nguyenlonq23.job4userver.repository;

import com.nguyenlonq23.job4userver.dto.CVCandidateDTO;
import com.nguyenlonq23.job4userver.model.entity.CV;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;


@Lazy
@Repository
public interface CVRepository extends JpaRepository<CV, Integer> {

    @Query("SELECT c FROM CV c WHERE c.id = :id")
    Optional<CV> findCVById(@Param("id") int id);

    // Tìm tất cả CV theo postId
    List<CV> findByPostId(Integer postId);

    // Tìm CV theo postId với phân trang
    Page<CV> findByPostId(Integer postId, Pageable pageable);

    // Tìm CV theo postId và keyword với phân trang
    @Query("SELECT c FROM CV c JOIN c.user u WHERE c.post.id = :postId AND " +
            "(LOWER(u.first_name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(u.last_name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(u.email) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(u.address) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<CV> findByPostIdAndKeyword(@Param("postId") Integer postId,
                                    @Param("keyword") String keyword,
                                    Pageable pageable);

    @Query("SELECT new com.nguyenlonq23.job4userver.dto.CVCandidateDTO(" +
            "cv.id, " +
            "cv.post.id, " + // Thêm cv.post.id
            "cv.post.name, " +
            "cv.post.category.name, " +
            "cv.post.jobLevel.name, " +
            "cv.post.location.name, " +
            "cv.isChecked) " +
            "FROM CV cv WHERE cv.user.id = :userId")
    Page<CVCandidateDTO> findByUserId(Integer userId, Pageable pageable);

    // Analyst
    @Query(value = "SELECT COUNT(*) FROM cvs cv " +
            "JOIN posts p ON cv.post_id = p.id " +
            "WHERE cv.created_At >= ?1 AND p.company_id = ?2", nativeQuery = true)
    Integer countCVsSubmittedAfter(LocalDateTime date, Integer companyId);

    @Query(value = "SELECT p.name, COUNT(cv.id) as applicationCount FROM posts p " +
            "JOIN cvs cv ON p.id = cv.post_id " +
            "WHERE p.company_id = ?1 " +
            "GROUP BY p.id, p.name ORDER BY applicationCount DESC LIMIT 10", nativeQuery = true)
    List<Map<String, Object>> findTopPostsWithMostApplications(Integer companyId);

    @Query(value = "SELECT DATE_FORMAT(cv.created_At, '%m-%Y') as month, COUNT(*) as cvCount " +
            "FROM cvs cv " +
            "JOIN posts p ON cv.post_id = p.id " +
            "WHERE p.company_id = ?1 " +
            "GROUP BY month ORDER BY month ASC", nativeQuery = true)
    List<Map<String, Object>> findCVCountByMonth(Integer companyId);

    @Query(value = "SELECT cv.is_Checked, COUNT(*) as cvCount FROM cvs cv " +
            "JOIN posts p ON cv.post_id = p.id " +
            "WHERE p.company_id = ?1 " +
            "GROUP BY cv.is_Checked", nativeQuery = true)
    List<Map<String, Object>> countCVsByCheckStatus(Integer companyId);

    // Method đếm tổng số CV theo company
    @Query(value = "SELECT COUNT(*) FROM cvs cv " +
            "JOIN posts p ON cv.post_id = p.id " +
            "WHERE p.company_id = ?1", nativeQuery = true)
    Integer countByCompanyId(Integer companyId);

    // Dashboard
    @Query(value = "SELECT COUNT(*) FROM cvs WHERE created_At >= ?1", nativeQuery = true)
    Integer countCVsSubmittedAfter(LocalDateTime date);
}
