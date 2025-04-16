package com.nguyenlonq23.job4userver.service;

import com.nguyenlonq23.job4userver.dto.OTPData;
import com.nguyenlonq23.job4userver.utils.exception.ResourceNotFoundException;
import com.nguyenlonq23.job4userver.utils.exception.UserAlreadyExistsException;
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
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;

@Lazy
@Service
public class AuthService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final CompanyRepository companyRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final EmailService emailService;

    // Lưu trữ OTP tạm thời
    private static final Map<String, OTPData> otpStore = new HashMap<>();

    public AuthService(UserRepository userRepository, RoleRepository roleRepository,
                       CompanyRepository companyRepository, PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager, JwtService jwtService,
                       EmailService emailService) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.companyRepository = companyRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.emailService = emailService;
    }

    public AuthResponse login(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("Người dùng không tồn tại"));

        String token = jwtService.generateToken(user);

        return new AuthResponse(
                token,
                user.getId(),
                user.getEmail(),
                user.getFirst_name() + " " + user.getLast_name(),
                user.getRole().getName()
        );
    }

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

        return new AuthResponse(
                token,
                savedUser.getId(),
                savedUser.getEmail(),
                savedUser.getFirst_name() + " " + savedUser.getLast_name(),
                savedUser.getRole().getName()
        );
    }

    public void generateAndSendOTP(String email) {
        // Kiểm tra email đã tồn tại
        if (userRepository.existsByEmail(email)) {
            throw new UserAlreadyExistsException("Email đã tồn tại trong hệ thống");
        }

        String otp = String.format("%06d", new Random().nextInt(999999));
        otpStore.put(email, new OTPData(otp, System.currentTimeMillis(), 0));
        try {
            emailService.sendEmail(email, "Mã OTP Xác Minh", "Mã OTP của bạn là: " + otp + ". Mã này có hiệu lực trong 60 giây.");
        } catch (Exception e) {
            throw new RuntimeException("Không thể gửi email OTP: " + e.getMessage());
        }
    }

    public boolean verifyOTP(String email, String inputOtp) {
        OTPData otpData = otpStore.get(email);
        if (otpData == null) {
            throw new RuntimeException("Mã OTP không tồn tại hoặc đã hết hạn.");
        }

        long currentTime = System.currentTimeMillis();
        if (currentTime - otpData.getCreatedAt() > 60_000) {
            otpStore.remove(email);
            throw new RuntimeException("Mã OTP đã hết hạn.");
        }

        if (otpData.getFailedAttempts() >= 3) {
            otpStore.remove(email);
            throw new RuntimeException("Bạn đã nhập sai quá số lần cho phép.");
        }

        if (!otpData.getOtp().equals(inputOtp)) {
            otpStore.put(email, new OTPData(otpData.getOtp(), otpData.getCreatedAt(), otpData.getFailedAttempts() + 1));
            throw new RuntimeException("Mã OTP không đúng. Bạn còn " + (3 - otpData.getFailedAttempts() - 1) + " lần thử.");
        }

        otpStore.remove(email);
        return true;
    }

    public void cleanupExpiredOtps() {
        long currentTime = System.currentTimeMillis();
        otpStore.entrySet().removeIf(entry ->
                currentTime - entry.getValue().getCreatedAt() > 60_000 // Xóa nếu quá 60 giây
        );
    }

}