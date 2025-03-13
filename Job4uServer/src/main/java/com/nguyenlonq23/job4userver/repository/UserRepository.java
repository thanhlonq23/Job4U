package com.nguyenlonq23.job4userver.repository;

import com.nguyenlonq23.job4userver.model.entity.User;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
@Lazy
@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    Page<User> findByEmailContainingIgnoreCase(String keyword, Pageable pageable);

    @Query("SELECT u.company.id FROM User u WHERE u.id = :id")
    Optional<Integer> getCompanyIdByUserId(@Param("id") int id);

}
