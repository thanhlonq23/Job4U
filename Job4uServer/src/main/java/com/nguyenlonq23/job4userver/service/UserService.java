package com.nguyenlonq23.job4userver.service;

import com.nguyenlonq23.job4userver.model.entity.Company;
import com.nguyenlonq23.job4userver.model.entity.User;
import com.nguyenlonq23.job4userver.repository.CompanyRepository;
import com.nguyenlonq23.job4userver.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Lazy
@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private CompanyRepository companyRepository;


    // Lấy tất cả categories kèm phân trang và từ khóa tìm kiếm,sort
    public Page<User> getUsersWithPaginationAndFilter(String keyword, Pageable pageable) {
        // Lọc dữ liệu bằng từ khóa nếu keyword không rỗng
        if (keyword != null && !keyword.isEmpty()) {
            return userRepository.findByEmailContainingIgnoreCase(keyword, pageable);
        }
        // Trả về toàn bộ nếu không có keyword
        return userRepository.findAll(pageable);
    }

    // Tạo mới hoặc cập nhật user
    public User saveUser(User user) {
        return userRepository.save(user);
    }

    public User updateUserInfo(int userId, User updatedUser) {
        // Tìm user hiện tại theo ID
        User currentUser = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

        // Cập nhật thông tin từ updatedUser, bỏ qua các trường null
        Optional.ofNullable(updatedUser.getFirst_name()).ifPresent(currentUser::setFirst_name);
        Optional.ofNullable(updatedUser.getLast_name()).ifPresent(currentUser::setLast_name);
        Optional.ofNullable(updatedUser.getAddress()).ifPresent(currentUser::setAddress);
        Optional.ofNullable(updatedUser.getDob()).ifPresent(currentUser::setDob);
        Optional.ofNullable(updatedUser.getGender()).ifPresent(currentUser::setGender);
        Optional.ofNullable(updatedUser.getRole()).ifPresent(currentUser::setRole);
        Optional.ofNullable(updatedUser.getStatus()).ifPresent(currentUser::setStatus);
        Optional.ofNullable(updatedUser.getCompany()).ifPresent(currentUser::setCompany);

        // Lưu thay đổi và trả về user đã cập nhật
        return userRepository.save(currentUser);
    }

    public User updateCompanyForUser(int userId, int companyId) {
        // Tìm User
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));

        // Tìm Company
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new IllegalArgumentException("Company not found with id: " + companyId));

        // Cập nhật Company
        user.setCompany(company);
        return userRepository.save(user);
    }

    // Xóa user theo ID
    public void deleteUser(int id) {
        userRepository.deleteById(id);
    }

    public Optional<Integer> getCompanyIdByUserId(int id) {
        return userRepository.getCompanyIdByUserId(id);
    }

    // Lấy user theo ID
    public Optional<User> getUserById(int id) {
        return userRepository.findById(id);
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }


    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }
}