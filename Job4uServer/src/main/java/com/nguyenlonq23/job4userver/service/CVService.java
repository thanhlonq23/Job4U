package com.nguyenlonq23.job4userver.service;

import com.nguyenlonq23.job4userver.dto.CVCandidateDTO;
import com.nguyenlonq23.job4userver.dto.CVDetailDTO;
import com.nguyenlonq23.job4userver.dto.CVInfoDTO;
import com.nguyenlonq23.job4userver.model.entity.CV;
import com.nguyenlonq23.job4userver.model.entity.Post;
import com.nguyenlonq23.job4userver.model.entity.User;
import com.nguyenlonq23.job4userver.repository.CVRepository;
import com.nguyenlonq23.job4userver.repository.PostRepository;
import com.nguyenlonq23.job4userver.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CVService {

    private CVRepository cvRepository;

    private UserRepository userRepository;

    private PostRepository postRepository;

    @Autowired
    public CVService(CVRepository cvRepository, UserRepository userRepository, PostRepository postRepository) {
        this.cvRepository = cvRepository;
        this.userRepository = userRepository;
        this.postRepository = postRepository;
    }

    public Page<CVCandidateDTO> getAllCVsByUserId(Integer userId, Pageable pageable) {
        return cvRepository.findByUserId(userId, pageable);
    }

    // Lấy danh sách CV theo postId không phân trang
    public List<CVInfoDTO> getCVInfoByPostId(Integer postId) {
        List<CV> cvList = cvRepository.findByPostId(postId);
        return cvList.stream()
                .map(CVInfoDTO::new)
                .collect(Collectors.toList());
    }

    // Lấy danh sách CV theo postId với phân trang và lọc
    public Page<CVInfoDTO> getCVInfoWithPaginationAndFilter(
            Integer postId, String keyword, Pageable pageable) {

        Page<CV> cvPage;
        if (keyword != null && !keyword.trim().isEmpty()) {
            cvPage = cvRepository.findByPostIdAndKeyword(postId, keyword, pageable);
        } else {
            cvPage = cvRepository.findByPostId(postId, pageable);
        }

        return cvPage.map(CVInfoDTO::new);
    }

    public CVDetailDTO getCVDetailById(int id) {
        CV cv = cvRepository.findCVById(id)
                .orElse(null);

        if (cv == null) {
            return null;
        }

        cv.setChecked(true);
        cvRepository.save(cv);

        return new CVDetailDTO(
                cv.getId(),
                cv.getFile(),
                cv.getDescription()
        );
    }


    public CV saveCV(CV cv, Integer userId, Integer postId, String file, String description) {
        // Kiểm tra và lấy User từ userId
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        // Kiểm tra và lấy Post từ postId
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found with id: " + postId));

        // Thiết lập dữ liệu cho CV
        cv.setUser(user);
        cv.setPost(post);
        cv.setFile(file);
        cv.setDescription(description);
        cv.setChecked(false); // Mặc định là chưa được kiểm tra

        // Thiết lập thời gian tạo và cập nhật
        Date now = new Date();
        cv.setCreatedAt(now);
        cv.setUpdatedAt(now);

        // Lưu và trả về CV
        return cvRepository.save(cv);
    }

}