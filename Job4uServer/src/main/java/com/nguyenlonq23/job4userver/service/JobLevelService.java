package com.nguyenlonq23.job4userver.service;

import com.nguyenlonq23.job4userver.model.entity.Experience;
import com.nguyenlonq23.job4userver.model.entity.JobLevel;
import com.nguyenlonq23.job4userver.model.entity.WorkType;
import com.nguyenlonq23.job4userver.repository.JobLevelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Lazy
@Service
public class JobLevelService {
    private JobLevelRepository jobLevelRepository;

    @Autowired
    public JobLevelService(JobLevelRepository jobLevelRepository) {
        this.jobLevelRepository = jobLevelRepository;
    }

    public List<JobLevel> getAllJobLevels() {
        return jobLevelRepository.findAll();
    }

    // Lấy tất cả job levels
    public Page<JobLevel> getJobLevels(String keyword, Pageable pageable) {
        // Lọc dữ liệu bằng từ khóa nếu keyword không rỗng
        if (keyword != null && !keyword.isEmpty()) {
            return jobLevelRepository.findByNameContainingIgnoreCase(keyword, pageable);
        }
        // Trả về toàn bộ nếu không có keyword
        return jobLevelRepository.findAll(pageable);
    }

    // Lấy job level theo ID
    public JobLevel getJobLevelById(int id) {
        return jobLevelRepository.findById(id).orElse(null);
    }

    // Tạo mới hoặc cập nhật job level
    public JobLevel saveJobLevel(JobLevel jobLevel) {
        return jobLevelRepository.save(jobLevel);
    }

    // Xóa job level theo ID
    public void deleteJobLevel(int id) {
        jobLevelRepository.deleteById(id);
    }
}