package com.nguyenlonq23.job4userver.repository;

import com.nguyenlonq23.job4userver.model.entity.Location;
import com.nguyenlonq23.job4userver.model.entity.Role;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Lazy
@Repository
public interface LocationRepositoty extends JpaRepository<Location, Integer> {
}
