package com.nguyenlonq23.job4userver.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;


@Service
@EnableScheduling
public class ScheduledTaskService {

    private final AuthService authService;

    @Autowired
    public ScheduledTaskService(AuthService authService) {
        this.authService = authService;
    }

    @Scheduled(fixedRate = 1000000)
    public void cleanupExpiredOtps() {
        authService.cleanupExpiredOtps(); // Gọi phương thức dọn dẹp từ AuthService
        System.out.println("Cleaned up expired OTPs at " + new java.util.Date());
    }

}