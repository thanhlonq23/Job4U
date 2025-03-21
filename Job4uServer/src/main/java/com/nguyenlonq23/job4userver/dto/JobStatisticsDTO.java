package com.nguyenlonq23.job4userver.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JobStatisticsDTO {
    private Long totalPosts;
    private Long newPostsLastMonth;
    private Long newPostsLastWeek;
    private List<Map<String, Object>> postCountByMonth;
    private List<Map<String, Object>> categoryDistribution;
    private List<Map<String, Object>> locationDistribution;
    private List<Map<String, Object>> salaryDistribution;
    private List<Map<String, Object>> experienceDistribution;
    private List<Map<String, Object>> jobLevelDistribution;
    private List<Map<String, Object>> workTypeDistribution;
    private List<Map<String, Object>> topCompaniesByPosts;


}