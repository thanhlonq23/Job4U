package com.nguyenlonq23.job4uanalytics.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Áp dụng cho tất cả các endpoint
                .allowedOrigins("http://localhost:3000") // Chỉ định origin được phép
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Các phương thức HTTP được phép
                .allowedHeaders("*") // Tất cả header được phép
                .allowCredentials(true) // Cho phép gửi cookie
                .exposedHeaders("Authorization") // Header được phép lộ ra
                .maxAge(3600); // Cache CORS trong 1 giờ
    }
}
