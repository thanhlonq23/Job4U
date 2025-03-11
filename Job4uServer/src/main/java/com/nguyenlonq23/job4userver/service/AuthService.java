package com.nguyenlonq23.job4userver.service;

import com.nguyenlonq23.job4userver.exception.ResourceNotFoundException;
import com.nguyenlonq23.job4userver.exception.UserAlreadyExistsException;
import com.nguyenlonq23.job4userver.model.entity.Company;
import com.nguyenlonq23.job4userver.model.entity.Role;
import com.nguyenlonq23.job4userver.model.entity.User;
import com.nguyenlonq23.job4userver.dto.request.LoginRequest;
import com.nguyenlonq23.job4userver.dto.request.RegisterRequest;
import com.nguyenlonq23.job4userver.dto.response.AuthResponse;
import com.nguyenlonq23.job4userver.model.enums.CompanyStatus;
import com.nguyenlonq23.job4userver.model.enums.UserStatus;
import com.nguyenlonq23.job4userver.repository.CompanyRepository;
import com.nguyenlonq23.job4userver.repository.RoleRepository;
import com.nguyenlonq23.job4userver.repository.UserRepository;
import com.nguyenlonq23.job4userver.security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class AuthService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    public AuthResponse register(RegisterRequest registerRequest) {
        // Kiểm tra xem email đã tồn tại chưa
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new UserAlreadyExistsException("Email đã được sử dụng");
        }

        // Lấy role dựa vào loại tài khoản được chọn
        Role role = roleRepository.findByName(registerRequest.isEmployer() ? "EMPLOYER_OWNER" : "JOB_SEEKER")
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy vai trò phù hợp"));

        // Tạo người dùng mới
        User user = new User();
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setFirst_name(registerRequest.getFirstName());
        user.setLast_name(registerRequest.getLastName());
        user.setAddress(registerRequest.getAddress());
        user.setDob(registerRequest.getDob());
        user.setGender(registerRequest.getGender());
        user.setRole(role);
        user.setStatus(UserStatus.ACTIVE);
        user.setCreatedAt(new Date());
        user.setUpdatedAt(new Date());

        // Nếu là nhà tuyển dụng, tạo công ty mặc định
        if (registerRequest.isEmployer()) {
            Company company = new Company();
            company.setName(registerRequest.getCompanyName());
            company.setEmail(registerRequest.getEmail());
            company.setStatus(CompanyStatus.PENDING);
            company.setCreatedAt(new Date());
            company.setUpdatedAt(new Date());

            company = companyRepository.save(company);
            user.setCompany(company);
        }

        // Lưu người dùng vào database
        User savedUser = userRepository.save(user);

        // Tạo token JWT
        String token = jwtService.generateToken(savedUser);

        // Trả về AuthResponse
        return new AuthResponse(
                token,
                savedUser.getId(),
                savedUser.getEmail(),
                savedUser.getFirst_name() + " " + savedUser.getLast_name(),
                savedUser.getRole().getName()
        );
    }

    public AuthResponse login(LoginRequest loginRequest) {
        // Xác thực người dùng
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );

        // Lưu thông tin xác thực vào SecurityContext
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Lấy thông tin người dùng
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("Người dùng không tồn tại"));

        // Tạo token JWT
        String token = jwtService.generateToken(user);

        // Trả về AuthResponse
        return new AuthResponse(
                token,
                user.getId(),
                user.getEmail(),
                user.getFirst_name() + " " + user.getLast_name(),
                user.getRole().getName()
        );
    }


}