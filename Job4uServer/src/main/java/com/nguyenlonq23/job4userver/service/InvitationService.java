package com.nguyenlonq23.job4userver.service;

import com.nguyenlonq23.job4userver.model.entity.InvitationToken;
import com.nguyenlonq23.job4userver.model.entity.Role;
import com.nguyenlonq23.job4userver.model.entity.User;
import com.nguyenlonq23.job4userver.repository.InvitationTokenRepository;
import com.nguyenlonq23.job4userver.repository.RoleRepository;
import com.nguyenlonq23.job4userver.repository.UserRepository;
import com.nguyenlonq23.job4userver.security.JwtService;
import com.nguyenlonq23.job4userver.utils.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class InvitationService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final InvitationTokenRepository invitationTokenRepository;
    private final JwtService jwtService;
    private final EmailService emailService;

    public InvitationService(UserRepository userRepository, RoleRepository roleRepository,
                             InvitationTokenRepository invitationTokenRepository, JwtService jwtService,
                             EmailService emailService) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.invitationTokenRepository = invitationTokenRepository;
        this.jwtService = jwtService;
        this.emailService = emailService;
    }

    public void inviteStaff(String ownerEmail, String staffEmail) {
        // Kiểm tra EMPLOYER_OWNER
        User owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Chủ công ty không tồn tại"));
        if (!owner.getRole().getName().equals("EMPLOYER_OWNER")) {
            throw new IllegalStateException("Bạn không có quyền mời nhân viên!");
        }

        // Kiểm tra staffEmail có phải JOB_SEEKER không
        User staff = userRepository.findByEmail(staffEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Người dùng không tồn tại"));
        if (!staff.getRole().getName().equals("JOB_SEEKER")) {
            throw new IllegalStateException("Người dùng này không thể được mời làm nhân viên!");
        }
        if (staff.getCompany() != null) {
            throw new IllegalStateException("Người dùng này đã thuộc công ty khác!");
        }

        // Tạo token với claims tùy chỉnh
        Map<String, Object> claims = new HashMap<>();
        claims.put("email", staffEmail);
        claims.put("companyId", owner.getCompany().getId());
        String token = jwtService.generateInvitationToken(claims, staffEmail);

        // Lưu token vào database
        InvitationToken invitationToken = new InvitationToken();
        invitationToken.setToken(token);
        invitationToken.setEmail(staffEmail);
        invitationToken.setCompany(owner.getCompany());
        invitationTokenRepository.save(invitationToken);

        // Gửi email
        String confirmationLink = "http://localhost:3000/confirm-invitation?token=" + token;
        String emailContent = "<!DOCTYPE html>" +
                "<html>" +
                "<head>" +
                "<style>" +
                "body { font-family: Arial, sans-serif; background-color: #f4f7fc; margin: 0; padding: 0; }" +
                ".container { max-width: 600px; margin: 40px auto; background: #fff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); }" +
                "h1 { font-size: 24px; margin-bottom: 20px; }" +
                "p { font-size: 16px; line-height: 1.6; margin-bottom: 20px; }" +
                ".btn { display: inline-block; padding: 12px 24px; background: #f8f9fa; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 8px rgba(59, 95, 196, 0.2); transition: all 0.3s ease; border: 2px solid #000; }" +
                ".footer { font-size: 12px; text-align: center; margin-top: 20px; }" +
                "</style>" +
                "</head>" +
                "<body>" +
                "<div class='container'>" +
                "<h1>Xác nhận lời mời vào công ty</h1>" +
                "<p>Xin chào,<br>Bạn đã được mời làm nhân viên tại " + owner.getCompany().getName() + ". Vui lòng nhấn vào nút dưới đây để xác nhận:</p>" +
                "<a href='" + confirmationLink + "' class='btn'>Xác nhận ngay</a>" +
                "<p>Nếu bạn không muốn tham gia, bạn có thể bỏ qua email này. Link sẽ hết hạn sau 24 giờ.</p>" +
                "</div>" +
                "</body>" +
                "</html>";


        try {
            emailService.sendEmail(staffEmail, "Xác nhận lời mời vào công ty", emailContent);
        } catch (Exception e) {
            throw new RuntimeException("Không thể gửi email: " + e.getMessage(), e);
        }
    }

    public void confirmInvitation(String token, boolean accept) {
        // Xác minh token JWT
        if (!jwtService.isTokenValid(token)) {
            throw new IllegalStateException("Token không hợp lệ hoặc đã bị giả mạo!");
        }

        InvitationToken invitationToken = invitationTokenRepository.findByToken(token);
        if (invitationToken == null) {
            throw new ResourceNotFoundException("Token không tồn tại trong hệ thống!");
        }
        if (invitationToken.isUsed()) {
            throw new IllegalStateException("Token đã được sử dụng!");
        }
        if (new Date().after(invitationToken.getExpiresAt())) {
            throw new IllegalStateException("Token đã hết hạn!");
        }

        User staff = userRepository.findByEmail(invitationToken.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("Người dùng không tồn tại"));

        if (accept) {
            Role staffRole = roleRepository.findByName("EMPLOYER_STAFF")
                    .orElseThrow(() -> new ResourceNotFoundException("Vai trò EMPLOYER_STAFF không tồn tại"));
            staff.setRole(staffRole);
            staff.setCompany(invitationToken.getCompany());
            staff.setUpdatedAt(new Date());
            userRepository.save(staff);
        }

        invitationToken.setUsed(true);
        invitationTokenRepository.save(invitationToken);
    }
}