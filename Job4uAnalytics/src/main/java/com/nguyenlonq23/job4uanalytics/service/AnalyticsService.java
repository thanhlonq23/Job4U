package com.nguyenlonq23.job4uanalytics.service;

import java.util.Map;

public interface AnalyticsService {
    Map<String, Object> analyzeSkillDemand(Integer id);

    Map<String, Object> analyzeApplicationTrends();
}