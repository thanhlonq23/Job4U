package com.nguyenlonq23.job4userver.utils.mapper;

import com.nguyenlonq23.job4userver.dto.PostDTO;
import com.nguyenlonq23.job4userver.model.entity.Post;

public interface PostMapper {
    PostDTO toPageDTO(Post post);
}