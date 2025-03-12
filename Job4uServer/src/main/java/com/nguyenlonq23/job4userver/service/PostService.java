package com.nguyenlonq23.job4userver.service;

import com.nguyenlonq23.job4userver.repository.PostRepository;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
@Lazy
@Service
public class PostService {
    PostRepository postRepository;
}
