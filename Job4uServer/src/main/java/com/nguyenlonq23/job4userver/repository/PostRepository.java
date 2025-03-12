package com.nguyenlonq23.job4userver.repository;

import com.nguyenlonq23.job4userver.model.entity.Post;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Lazy
@Repository
public interface PostRepository extends JpaRepository<Post, Integer> {
}
