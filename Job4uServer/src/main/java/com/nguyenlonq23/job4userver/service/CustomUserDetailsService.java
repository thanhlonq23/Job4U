package com.nguyenlonq23.job4userver.service;

import com.nguyenlonq23.job4userver.model.entity.User;
import com.nguyenlonq23.job4userver.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;
@Lazy
@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

//    @Override
//    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
//        User user = userRepository.findByEmail(email)
//                .orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy người dùng với email: " + email));
//
//        return new org.springframework.security.core.userdetails.User(
//                user.getEmail(),
//                user.getPassword(),
//                Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole().getName()))
//        );
//    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy người dùng với email: " + email));

        // Tạo authority từ tên vai trò
        // Thêm prefix "ROLE_" để Spring Security nhận diện là vai trò
        SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + user.getRole().getName());

        // Trả về UserDetails object với thông tin người dùng
        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                Collections.singletonList(authority)
        );
    }
}