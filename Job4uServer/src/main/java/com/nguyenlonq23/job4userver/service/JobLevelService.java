package com.nguyenlonq23.job4userver.service;
import com.nguyenlonq23.job4userver.model.entity.JobLevel;
import com.nguyenlonq23.job4userver.model.entity.WorkType;
import com.nguyenlonq23.job4userver.repository.JobLevelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JobLevelService {
    @Autowired
    private JobLevelRepository jobLevelRepository;

    // Lấy tất cả job levels
    public List<JobLevel> getAllJobLevels() {
        return jobLevelRepository.findAll();
    }

    // Lấy dữ liệu phân trang
    public Page<JobLevel> getJobLevelWithPagination(int page, int size) {
        Pageable pageable = PageRequest.of(page, size); // Tạo Pageable (pageIndex, pageSize)
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