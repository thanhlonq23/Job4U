package com.nguyenlonq23.job4userver.service;
import com.nguyenlonq23.job4userver.model.JobLevel;
import com.nguyenlonq23.job4userver.repository.JobLevelRepository;
import org.springframework.beans.factory.annotation.Autowired;
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