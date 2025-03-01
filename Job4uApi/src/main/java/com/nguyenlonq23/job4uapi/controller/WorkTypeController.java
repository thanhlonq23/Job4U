package com.nguyenlonq23.job4uapi.controller;

import com.nguyenlonq23.job4uapi.model.WorkType;
import com.nguyenlonq23.job4uapi.service.WorkTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/work-types")
public class WorkTypeController {
    @Autowired
    private WorkTypeService workTypeService;

    // Lấy tất cả work types
    @GetMapping
    public List<WorkType> getAllWorkTypes() {
        return workTypeService.getAllWorkTypes();
    }

    // Lấy work type theo ID
    @GetMapping("/{id}")
    public WorkType getWorkTypeById(@PathVariable int id) {
        return workTypeService.getWorkTypeById(id);
    }

    // Tạo mới work type
    @PostMapping
    public WorkType createWorkType(@RequestBody WorkType workType) {
        return workTypeService.saveWorkType(workType);
    }

    // Cập nhật work type
    @PutMapping("/{id}")
    public WorkType updateWorkType(@PathVariable int id, @RequestBody WorkType workType) {
        workType.setId(id);
        return workTypeService.saveWorkType(workType);
    }

    // Xóa work type
    @DeleteMapping("/{id}")
    public void deleteWorkType(@PathVariable int id) {
        workTypeService.deleteWorkType(id);
    }
}