package com.nguyenlonq23.job4userver.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CVStatisticsDTO {
    private Integer totalCVs;
    private Integer newCVsLastMonth;
    private Integer newCVsLastWeek;
    private List<Map<String, Object>> cvCountByMonth;
    private List<Map<String, Object>> topPostsWithMostApplications;
    private List<Map<String, Object>> checkStatusDistribution;
}