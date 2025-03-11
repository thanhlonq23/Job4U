package com.nguyenlonq23.job4userver.service;

import com.nguyenlonq23.job4userver.model.entity.JobLevel;
import com.nguyenlonq23.job4userver.model.entity.Role;
import com.nguyenlonq23.job4userver.repository.JobLevelRepository;
import com.nguyenlonq23.job4userver.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoleService {
    @Autowired
    private RoleRepository roleRepository;

    // Lấy tất cả job levels
    public List<Role> getAllRole() {
        return roleRepository.findAll();
    }
}
