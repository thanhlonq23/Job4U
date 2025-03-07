package com.nguyenlonq23.job4userver.service;

import com.nguyenlonq23.job4userver.model.entity.User;
import com.nguyenlonq23.job4userver.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    /**
     * Lấy tất cả người dùng
     */
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    /**
     * Lấy người dùng theo ID
     */
    public Optional<User> getUserById(int id) {
        return userRepository.findById(id);
    }

    /**
     * Lấy người dùng theo email
     */
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    /**
     * Lưu người dùng mới
     */
    public User saveUser(User user) {
        return userRepository.save(user);
    }

    /**
     * Cập nhật thông tin người dùng
     */
    public User updateUser(User user) {
        return userRepository.save(user);
    }

    /**
     * Kiểm tra email đã tồn tại chưa
     */
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    /**
     * Xóa người dùng theo ID
     */
    public void deleteUser(int id) {
        userRepository.deleteById(id);
    }
}