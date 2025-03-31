package com.nguyenlonq23.job4userver.service;


import com.nguyenlonq23.job4userver.model.entity.WorkType;
import com.nguyenlonq23.job4userver.repository.WorkTypeRepository;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Lazy
@Service
public class WorkTypeService {
    private final WorkTypeRepository workTypeRepository;

    public WorkTypeService(WorkTypeRepository workTypeRepository) {
        this.workTypeRepository = workTypeRepository;
    }

    // Lấy tất cả work types
    public List<WorkType> getAllWorkTypes() {
        return workTypeRepository.findAll();
    }

    // Lấy dữ liệu phân trang
    public Page<WorkType> getWorkTypesWithPagination(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return workTypeRepository.findAll(pageable);
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