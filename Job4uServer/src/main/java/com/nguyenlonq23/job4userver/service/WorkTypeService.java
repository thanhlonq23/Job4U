package com.nguyenlonq23.job4userver.service;


import com.nguyenlonq23.job4userver.model.entity.WorkType;
import com.nguyenlonq23.job4userver.repository.WorkTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WorkTypeService {
    @Autowired
    private WorkTypeRepository workTypeRepository;

    // Lấy tất cả work types
    public List<WorkType> getAllWorkTypes() {
        return workTypeRepository.findAll();
    }

    // Lấy work type theo ID
    public WorkType getWorkTypeById(int id) {
        return workTypeRepository.findById(id).orElse(null);
    }

    // Tạo mới hoặc cập nhật work type
    public WorkType saveWorkType(WorkType workType) {
        return workTypeRepository.save(workType);
    }

    // Xóa work type theo ID
    public void deleteWorkType(int id) {
        workTypeRepository.deleteById(id);
    }
}