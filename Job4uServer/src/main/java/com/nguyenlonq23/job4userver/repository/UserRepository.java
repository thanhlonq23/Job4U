package com.nguyenlonq23.job4userver.repository;

import com.nguyenlonq23.job4userver.model.entity.User;
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
public interface UserRepository extends JpaRepository<User, Integer> {

    Optional<User> findByEmail(String email);

    Page<User> findAllUserByCompanyId(int companyId, Pageable pageable);

    boolean existsByEmail(String email);

    Page<User> findByEmailContainingIgnoreCase(String keyword, Pageable pageable);

    @Query("SELECT u.company.id FROM User u WHERE u.id = :id")
    Optional<Integer> getCompanyIdByUserId(@Param("id") int id);


    // Analyst
    @Query(value = "SELECT COUNT(*) FROM users WHERE created_At >= ?1", nativeQuery = true)
    Long countUsersRegisteredAfter(LocalDateTime date);

    @Query(value = "SELECT r.name, COUNT(u.id) as userCount FROM roles r " +
            "JOIN users u ON r.id = u.role_id " +
            "GROUP BY r.id, r.name", nativeQuery = true)
    List<Map<String, Object>> countUsersByRole();
}
