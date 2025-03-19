package com.nguyenlonq23.job4userver.repository;

import com.nguyenlonq23.job4userver.model.entity.Location;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public interface LocationRepository extends JpaRepository<Location, Integer> {
    @Query(value = "SELECT l.name, COUNT(p.id) as postCount FROM locations l " +
            "JOIN posts p ON l.id = p.address_id " +
            "GROUP BY l.id, l.name ORDER BY postCount DESC", nativeQuery = true)
    List<Map<String, Object>> findLocationPostCounts();


    // Analyst

}