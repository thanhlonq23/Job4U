package com.nguyenlonq23.job4uapi.repository;

import com.nguyenlonq23.job4uapi.model.Company;
import com.nguyenlonq23.job4uapi.model.enums.Gender;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CompanyRepository extends JpaRepository<Company, Integer> {
}
