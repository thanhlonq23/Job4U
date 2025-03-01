package com.nguyenlonq23.job4uapi.service;
import com.nguyenlonq23.job4uapi.model.Salary;
import com.nguyenlonq23.job4uapi.repository.SalaryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SalaryService {
    @Autowired
    private SalaryRepository salaryRepository;

    // Lấy tất cả salaries
    public List<Salary> getAllSalaries() {
        return salaryRepository.findAll();
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