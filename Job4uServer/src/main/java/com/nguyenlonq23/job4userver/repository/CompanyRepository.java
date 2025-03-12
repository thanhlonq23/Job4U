package com.nguyenlonq23.job4userver.repository;

import com.nguyenlonq23.job4userver.model.entity.Category;
import com.nguyenlonq23.job4userver.model.entity.Company;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
@Lazy
@Repository
public interface CompanyRepository extends JpaRepository<Company, Integer> {
    Page<Company> findByNameContainingIgnoreCase(String keyword, Pageable pageable);

    @Query("SELECT COUNT(u) FROM User u WHERE u.company.id = :companyId")
    int countUsersByCompanyId(@Param("companyId") int companyId);
}