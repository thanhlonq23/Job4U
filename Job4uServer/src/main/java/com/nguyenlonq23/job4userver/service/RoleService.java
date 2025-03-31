package com.nguyenlonq23.job4userver.service;

import com.nguyenlonq23.job4userver.model.entity.Role;
import com.nguyenlonq23.job4userver.repository.RoleRepository;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import java.util.List;
@Lazy
@Service
public class RoleService {
    private final RoleRepository roleRepository;

    public RoleService(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    // Lấy tất cả job levels
    public List<Role> getAllRole() {
        return roleRepository.findAll();
    }
}
