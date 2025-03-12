package com.nguyenlonq23.job4userver.repository;

import com.nguyenlonq23.job4userver.model.entity.Notification;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Lazy
@Repository
public interface NotificationRepository extends JpaRepository<Notification, Integer> {
}
