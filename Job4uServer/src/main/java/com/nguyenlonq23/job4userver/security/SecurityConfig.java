package com.nguyenlonq23.job4userver.security;

import com.nguyenlonq23.job4userver.config.CorsConfig;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthFilter;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private CorsConfig corsConfig;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfig.corsConfigurationSource())) // Sử dụng cấu hình CORS
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/api/auth/**",
                                "/api/posts/get-post-detail",
                                "/api/posts/search",
                                "/api/categories",
                                "/api/locations",
                                "/api/salaries",
                                "/api/job-levels",
                                "/api/work-types",
                                "/api/experiences"
                        ).permitAll()
                        .anyRequest().authenticated()
                )

//                .authorizeHttpRequests(auth -> auth
//                        .requestMatchers("/api/auth/**").permitAll()
//                        .requestMatchers("/api/posts").hasAnyRole("ADMIN", "EMPLOYER_OWNER", "EMPLOYER_STAFF")
//                        .requestMatchers("/api/categories").hasAnyRole("ADMIN", "EMPLOYER_OWNER", "EMPLOYER_STAFF")
//                        .requestMatchers("/api/experiences").hasAnyRole("ADMIN", "EMPLOYER_OWNER", "EMPLOYER_STAFF")
//                        .requestMatchers("/api/job-levels").hasAnyRole("ADMIN", "EMPLOYER_OWNER", "EMPLOYER_STAFF")
//                        .requestMatchers("/api/salaries").hasAnyRole("ADMIN", "EMPLOYER_OWNER", "EMPLOYER_STAFF")
//                        .requestMatchers("/api/skills").hasAnyRole("ADMIN", "EMPLOYER_OWNER", "EMPLOYER_STAFF")
//                        .requestMatchers("/api/work-types").hasAnyRole("ADMIN", "EMPLOYER_OWNER", "EMPLOYER_STAFF")
//                        .anyRequest().authenticated()
//                )
                .exceptionHandling(ex -> ex
                        .accessDeniedHandler((request, response, accessDeniedException) -> {
                            response.setContentType("application/json;charset=UTF-8");
                            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                            response.getWriter().write("{\"error\": \"Access Denied\", \"message\": \"You don't have permission to access this resource\"}");
                        })
                )
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authenticationProvider(authenticationProvider())
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }


    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}