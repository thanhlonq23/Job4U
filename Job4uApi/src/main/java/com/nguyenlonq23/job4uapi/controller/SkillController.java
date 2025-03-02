package com.nguyenlonq23.job4uapi.controller;

import com.nguyenlonq23.job4uapi.model.Skill;
import com.nguyenlonq23.job4uapi.service.SkillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/skills")
public class SkillController {
    @Autowired
    private SkillService skillService;

    // Lấy tất cả skills
    @GetMapping
    public List<Skill> getAllSkills() {
        return skillService.getAllSkills();
    }

    // Lấy skill theo ID
    @GetMapping("/{id}")
    public Skill getSkillById(@PathVariable int id) {
        return skillService.getSkillById(id);
    }

    // Lấy các skill theo categoryId
    @GetMapping("/category/{categoryId}")
    public List<Skill> getSkillsByCategoryId(@PathVariable int categoryId) {
        return skillService.getSkillsByCategoryId(categoryId);
    }

    // Tạo mới skill
    @PostMapping
    public Skill createSkill(@RequestBody Skill skill) {
        return skillService.saveSkill(skill);
    }

    // Cập nhật skill
    @PutMapping("/{id}")
    public Skill updateSkill(@PathVariable int id, @RequestBody Skill skill) {
        skill.setId(id);
        return skillService.saveSkill(skill);
    }

    // Xóa skill
    @DeleteMapping("/{id}")
    public void deleteSkill(@PathVariable int id) {
        skillService.deleteSkill(id);
    }
}