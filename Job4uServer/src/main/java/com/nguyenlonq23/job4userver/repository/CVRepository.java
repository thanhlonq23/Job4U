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

import java.util.List;
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
}
