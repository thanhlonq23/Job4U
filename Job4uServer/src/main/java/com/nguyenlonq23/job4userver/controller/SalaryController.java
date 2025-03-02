package com.nguyenlonq23.job4userver.controller;

import com.nguyenlonq23.job4userver.model.Salary;
import com.nguyenlonq23.job4userver.service.SalaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/salaries")
public class SalaryController {
    @Autowired
    private SalaryService salaryService;

    // Lấy tất cả salaries
    @GetMapping
    public List<Salary> getAllSalaries() {
        return salaryService.getAllSalaries();
    }

    // Lấy salary theo ID
    @GetMapping("/{id}")
    public Salary getSalaryById(@PathVariable int id) {
        return salaryService.getSalaryById(id);
    }

    // Tạo mới salary
    @PostMapping
    public Salary createSalary(@RequestBody Salary salary) {
        return salaryService.saveSalary(salary);
    }

    // Cập nhật salary
    @PutMapping("/{id}")
    public Salary updateSalary(@PathVariable int id, @RequestBody Salary salary) {
        salary.setId(id);
        return salaryService.saveSalary(salary);
    }

    // Xóa salary
    @DeleteMapping("/{id}")
    public void deleteSalary(@PathVariable int id) {
        salaryService.deleteSalary(id);
    }
}