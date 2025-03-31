package com.nguyenlonq23.job4userver.controller;

import com.nguyenlonq23.job4userver.dto.*;
import com.nguyenlonq23.job4userver.dto.response.ApiResponse;
import com.nguyenlonq23.job4userver.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    private <T> ResponseEntity<ApiResponse<T>> buildResponse(String status, String message, T data, HttpStatus httpStatus) {
        return ResponseEntity.status(httpStatus).body(new ApiResponse<>(status, message, data));
    }

    @GetMapping("/jobs")
    public ResponseEntity<ApiResponse<JobStatisticsDTO>> getJobStatistics() {
        try {
            JobStatisticsDTO jobStats = analyticsService.getJobStatistics();
            return buildResponse("SUCCESS", "Successfully retrieved job statistics", jobStats, HttpStatus.OK);
        } catch (Exception e) {
            return buildResponse("ERROR", "An error occurred while retrieving job statistics: " + e.getMessage(), null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/cvs")
    public ResponseEntity<ApiResponse<CVStatisticsDTO>> getCVStatistics(
            @RequestParam("companyId") Integer companyId) {
        try {
            CVStatisticsDTO cvStats = analyticsService.getCVStatistics(companyId);
            return ResponseEntity.ok(new ApiResponse<>(
                    "SUCCESS",
                    "Successfully retrieved CV statistics",
                    cvStats
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ApiResponse<>(
                    "ERROR",
                    "An error occurred while retrieving CV statistics: " + e.getMessage(),
                    null
            ));
        }
    }

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboardSummary() {
        try {
            Map<String, Object> dashboardSummary = analyticsService.getDashboardSummary();
            return buildResponse("SUCCESS", "Successfully retrieved dashboard summary", dashboardSummary, HttpStatus.OK);
        } catch (Exception e) {
            return buildResponse("ERROR", "An error occurred while retrieving dashboard summary: " + e.getMessage(), null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
