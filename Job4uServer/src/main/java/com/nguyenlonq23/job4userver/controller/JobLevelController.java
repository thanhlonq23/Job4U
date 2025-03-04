package com.nguyenlonq23.job4userver.controller;

import com.nguyenlonq23.job4userver.model.JobLevel;
import com.nguyenlonq23.job4userver.service.JobLevelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/job-levels")
public class JobLevelController {
    @Autowired
    private JobLevelService jobLevelService;

    // Lấy tất cả job levels
    @GetMapping
    public List<JobLevel> getAllJobLevels() {
        return jobLevelService.getAllJobLevels();
    }

    // Lấy job level theo ID
    @GetMapping("/{id}")
    public JobLevel getJobLevelById(@PathVariable int id) {
        return jobLevelService.getJobLevelById(id);
    }

    // Tạo mới job level
    @PostMapping
    public JobLevel createJobLevel(@RequestBody JobLevel jobLevel) {
        return jobLevelService.saveJobLevel(jobLevel);
    }

    // Cập nhật job level
    @PutMapping("/{id}")
    public JobLevel updateJobLevel(@PathVariable int id, @RequestBody JobLevel jobLevel) {
        jobLevel.setId(id);
        return jobLevelService.saveJobLevel(jobLevel);
    }

    // Xóa job level
    @DeleteMapping("/{id}")
    public void deleteJobLevel(@PathVariable int id) {
        jobLevelService.deleteJobLevel(id);
    }
}