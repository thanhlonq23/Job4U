package com.nguyenlonq23.job4userver.repository;

import com.nguyenlonq23.job4userver.dto.CompanyDTO;
import com.nguyenlonq23.job4userver.dto.CompanyDetailDTO;
import com.nguyenlonq23.job4userver.model.entity.Company;
import com.nguyenlonq23.job4userver.model.enums.CompanyStatus;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Lazy
@Repository
public interface CompanyRepository extends JpaRepository<Company, Integer> {
    Page<Company> findByNameContainingIgnoreCase(String keyword, Pageable pageable);

    @Query("SELECT COUNT(u) FROM User u WHERE u.company.id = :companyId")
    int countUsersByCompanyId(@Param("companyId") int companyId);

    @Query("SELECT c.status FROM Company c WHERE c.id = :companyId")
    Optional<CompanyStatus> findStatusByCompanyId(@Param("companyId") int companyId);

    @Query("SELECT new com.nguyenlonq23.job4userver.dto.CompanyDTO(c.id, c.name, c.thumbnail, c.coverImage, c.description_Markdown) " +
            "FROM Company c WHERE :keyword IS NULL OR c.name LIKE %:keyword%")
    Page<CompanyDTO> findCompanies(String keyword, Pageable pageable);

    @Query("SELECT new com.nguyenlonq23.job4userver.dto.CompanyDetailDTO(" +
            "c.id, c.name, c.thumbnail, c.coverImage, c.description_Markdown, " +
            "c.website, c.address) " +
            "FROM Company c WHERE c.id = :id")
    Optional<CompanyDetailDTO> findCompanyDetailById(@Param("id") int id);

    // Analyst
    @Query(value = "SELECT c.name, COUNT(p.id) as postCount FROM companies c " +
            "JOIN posts p ON c.id = p.company_id " +
            "GROUP BY c.id, c.name ORDER BY postCount DESC LIMIT 10", nativeQuery = true)
    List<Map<String, Object>> findTopCompaniesWithMostPosts();
}