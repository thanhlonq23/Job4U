package com.nguyenlonq23.job4userver.service;

import com.nguyenlonq23.job4userver.model.entity.Category;
import com.nguyenlonq23.job4userver.model.entity.Salary;
import com.nguyenlonq23.job4userver.repository.SalaryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
@Lazy
@Service
public class SalaryService {
    @Autowired
    private SalaryRepository salaryRepository;

    // Lấy tất cả salaries
    public List<Salary> getAllSalaries() {
        return salaryRepository.findAll();
    }

    public Page<Salary> getSalariesWithPagination(int page, int size) {
        Pageable pageable = PageRequest.of(page, size); // Tạo Pageable (pageIndex, pageSize)
        return salaryRepository.findAll(pageable);
    }

    // Lấy salary theo ID
    public Salary getSalaryById(int id) {
        return salaryRepository.findById(id).orElse(null);
    }

    // Tạo mới hoặc cập nhật salary
    public Salary saveSalary(Salary salary) {
        return salaryRepository.save(salary);
    }

    // Xóa salary theo ID
    public void deleteSalary(int id) {
        salaryRepository.deleteById(id);
    }
}