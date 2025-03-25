package com.nguyenlonq23.job4uanalytics.controller;

import com.nguyenlonq23.job4uanalytics.dto.response.ApiResponse;
import com.nguyenlonq23.job4uanalytics.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {
    private AnalyticsService analyticsService;

    @Autowired
    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/skill-demand")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getSkillDemand(
            @RequestParam(required = false) Integer categoryId) { // Thêm tham số categoryId
        try {
            Map<String, Object> skillDemand = analyticsService.analyzeSkillDemand(categoryId);
            return ResponseEntity.ok(new ApiResponse<>(
                    "SUCCESS",
                    "Successfully retrieved skill demand analysis",
                    skillDemand
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ApiResponse<>(
                    "ERROR",
                    "An error occurred while retrieving skill demand analysis: " + e.getMessage(),
                    null
            ));
        }
    }

    @GetMapping("/application-trends")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getApplicationTrends() {
        try {
            Map<String, Object> applicationTrends = analyticsService.analyzeApplicationTrends();
            return ResponseEntity.ok(new ApiResponse<>(
                    "SUCCESS",
                    "Successfully retrieved application trends analysis",
                    applicationTrends
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ApiResponse<>(
                    "ERROR",
                    "An error occurred while retrieving application trends analysis: " + e.getMessage(),
                    null
            ));
        }
    }
}