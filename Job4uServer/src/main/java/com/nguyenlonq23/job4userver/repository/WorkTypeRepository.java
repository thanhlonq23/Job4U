package com.nguyenlonq23.job4userver.repository;

import com.nguyenlonq23.job4userver.model.entity.WorkType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WorkTypeRepository extends JpaRepository<WorkType, Integer> {
//    Page<WorkType> findAll(Pageable pageable);
}
