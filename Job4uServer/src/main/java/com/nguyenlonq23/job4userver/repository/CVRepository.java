package com.nguyenlonq23.job4userver.repository;

import com.nguyenlonq23.job4userver.model.CV;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CVRepository extends JpaRepository<CV, Integer> {
}
