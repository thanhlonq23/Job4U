package com.nguyenlonq23.job4userver.repository;

import com.nguyenlonq23.job4userver.model.entity.InvitationToken;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InvitationTokenRepository extends JpaRepository<InvitationToken, Long> {
    InvitationToken findByToken(String token);
}