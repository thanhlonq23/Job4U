package com.nguyenlonq23.job4userver.mapper;

import com.nguyenlonq23.job4userver.dto.PostDTO;
import com.nguyenlonq23.job4userver.model.entity.Post;
import org.springframework.stereotype.Component;

@Component
public class PostMapperImpl implements PostMapper {

    @Override
    public PostDTO toPageDTO(Post post) {
        if (post == null) {
            return null;
        }

        PostDTO postDTO = new PostDTO();

        // Ánh xạ các trường cơ bản
        postDTO.setId(post.getId());
        postDTO.setName(post.getName());
        postDTO.setDescription_Markdown(post.getDescription_Markdown());
        postDTO.setAmount(post.getAmount());

        // Ánh xạ các trường quan hệ với kiểm tra null
        postDTO.setCategoryName(post.getCategory() != null ? post.getCategory().getName() : null);
        postDTO.setLocationName(post.getLocation() != null ? post.getLocation().getName() : null);
        postDTO.setSalaryRange(post.getSalary() != null ? post.getSalary().getName() : null);
        postDTO.setJobLevelName(post.getJobLevel() != null ? post.getJobLevel().getName() : null);
        postDTO.setWorkTypeName(post.getWorkType() != null ? post.getWorkType().getName() : null);
        postDTO.setExperienceName(post.getExperience() != null ? post.getExperience().getName() : null);

        // Ánh xạ các trường company
        if (post.getCompany() != null) {
            postDTO.setCompanyName(post.getCompany().getName());
            postDTO.setCompanyLogo(post.getCompany().getThumbnail());
        }

        // Ánh xạ các trường ngày tháng
        postDTO.setExpirationDate(post.getExpiration_date());
        postDTO.setCreatedAt(post.getCreatedAt());
        postDTO.setUpdatedAt(post.getUpdatedAt());

        return postDTO;
    }
}