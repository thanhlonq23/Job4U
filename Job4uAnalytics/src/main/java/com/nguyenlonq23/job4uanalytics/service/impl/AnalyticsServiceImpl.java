package com.nguyenlonq23.job4uanalytics.service.impl;

import com.nguyenlonq23.job4uanalytics.service.AnalyticsService;
import jakarta.annotation.PreDestroy;
import org.apache.spark.sql.Dataset;
import org.apache.spark.sql.Row;
import org.apache.spark.sql.SparkSession;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AnalyticsServiceImpl implements AnalyticsService {
    private static final Logger logger = LoggerFactory.getLogger(AnalyticsServiceImpl.class);

    private final SparkSession sparkSession;

    @Autowired
    public AnalyticsServiceImpl(SparkSession sparkSession) {
        this.sparkSession = sparkSession;
    }

    @Override
    public Map<String, Object> analyzeSkillDemand(Integer categoryId) {
        Map<String, Object> result = new HashMap<>();
        try {
            Dataset<Row> skills = sparkSession.read()
                    .format("jdbc")
                    .option("url", "jdbc:mysql://localhost:3306/job4u")
                    .option("dbtable", "job4u.skills")
                    .option("user", "root")
                    .option("password", "")
                    .load();
            Dataset<Row> categories = sparkSession.read()
                    .format("jdbc")
                    .option("url", "jdbc:mysql://localhost:3306/job4u")
                    .option("dbtable", "job4u.categories")
                    .option("user", "root")
                    .option("password", "")
                    .load();
            Dataset<Row> posts = sparkSession.read()
                    .format("jdbc")
                    .option("url", "jdbc:mysql://localhost:3306/job4u")
                    .option("dbtable", "job4u.posts")
                    .option("user", "root")
                    .option("password", "")
                    .load();
            Dataset<Row> salaries = sparkSession.read()
                    .format("jdbc")
                    .option("url", "jdbc:mysql://localhost:3306/job4u")
                    .option("dbtable", "job4u.salaries")
                    .option("user", "root")
                    .option("password", "")
                    .load();

            skills.createOrReplaceTempView("skills");
            categories.createOrReplaceTempView("categories");
            posts.createOrReplaceTempView("posts");
            salaries.createOrReplaceTempView("salaries");

            // Điều kiện WHERE cho category_id\
            String categoryFilter = categoryId != null ? "AND p.category_id = " + categoryId : "";

            // Truy vấn skillDemandQuery
            String skillDemandQuery =
                    "SELECT s.name AS skill_name, c.name AS category_name, COUNT(*) AS demand_count " +
                            "FROM posts p " +
                            "JOIN categories c ON p.category_id = c.id " +
                            "JOIN skills s ON s.category_id = c.id " +
                            "WHERE LOWER(p.description_markdown) LIKE CONCAT('%', LOWER(s.name), '%') " +
                            categoryFilter + " " +
                            "GROUP BY s.name, c.name " +
                            "ORDER BY demand_count DESC " +
                            "LIMIT 20";

            Dataset<Row> skillDemand = sparkSession.sql(skillDemandQuery);
            List<Map<String, Object>> skillDemandList = skillDemand.collectAsList().stream().map(row -> {
                Map<String, Object> map = new HashMap<>();
                map.put("skill_name", row.getString(0));
                map.put("category_name", row.getString(1));
                map.put("demand_count", row.getLong(2));
                return map;
            }).collect(Collectors.toList());
            result.put("topSkillDemand", skillDemandList);

            // Truy vấn skillTrendQuery
            String skillTrendQuery =
                    "SELECT s.name AS skill_name, DATE_FORMAT(p.created_at, 'yyyy-MM') AS month, COUNT(*) AS demand_count " +
                            "FROM posts p " +
                            "JOIN categories c ON p.category_id = c.id " +
                            "JOIN skills s ON s.category_id = c.id " +
                            "WHERE LOWER(p.description_markdown) LIKE CONCAT('%', LOWER(s.name), '%') " +
                            categoryFilter + " " +
                            "GROUP BY s.name, month " +
                            "ORDER BY month ASC, demand_count DESC";

            Dataset<Row> skillTrend = sparkSession.sql(skillTrendQuery);
            List<Map<String, Object>> skillTrendList = skillTrend.collectAsList().stream().map(row -> {
                Map<String, Object> map = new HashMap<>();
                map.put("skill_name", row.getString(0));
                map.put("month", row.getString(1));
                map.put("demand_count", row.getLong(2));
                return map;
            }).collect(Collectors.toList());
            result.put("skillTrends", skillTrendList);

            // Truy vấn salaryBySkillQuery
            String salaryBySkillQuery =
                    "SELECT s.name AS skill_name, " +
                            "AVG(CASE WHEN sal.salary_range LIKE '%-%' " +
                            "THEN (CAST(REGEXP_EXTRACT(sal.salary_range, '^[0-9]+', 0) AS DOUBLE) + " +
                            "CAST(REGEXP_EXTRACT(sal.salary_range, '(?<=\\-)[0-9]+', 0) AS DOUBLE)) / 2 " +
                            "ELSE CAST(REGEXP_EXTRACT(sal.salary_range, '^[0-9]+', 0) AS DOUBLE) END) AS avg_salary " +
                            "FROM posts p " +
                            "JOIN salaries sal ON p.salary_id = sal.id " +
                            "JOIN categories c ON p.category_id = c.id " +
                            "JOIN skills s ON s.category_id = c.id " +
                            "WHERE LOWER(p.description_markdown) LIKE CONCAT('%', LOWER(s.name), '%') " +
                            categoryFilter + " " +
                            "GROUP BY s.name " +
                            "ORDER BY avg_salary DESC " +
                            "LIMIT 20";
            Dataset<Row> salaryBySkill = sparkSession.sql(salaryBySkillQuery);
            List<Map<String, Object>> salaryBySkillList = salaryBySkill.collectAsList().stream().map(row -> {
                Map<String, Object> map = new HashMap<>();
                map.put("skill_name", row.getString(0));
                map.put("avg_salary", row.getDouble(1));
                return map;
            }).collect(Collectors.toList());
            result.put("salaryBySkill", salaryBySkillList);

        } catch (Exception e) {
            logger.error("Error analyzing skill demand with Spark", e);
            result.put("error", e.getMessage());
        }
        return result;
    }

    @Override
    public Map<String, Object> analyzeApplicationTrends() {
        Map<String, Object> result = new HashMap<>();

        try {
            // Load data từ MySQL vào Spark DataFrame
            Dataset<Row> cvs = sparkSession.read()
                    .format("jdbc")
                    .option("url", "jdbc:mysql://localhost:3306/job4u")
                    .option("dbtable", "cvs")
                    .option("user", "root")
                    .option("password", "")
                    .load();

            Dataset<Row> posts = sparkSession.read()
                    .format("jdbc")
                    .option("url", "jdbc:mysql://localhost:3306/job4u")
                    .option("dbtable", "posts")
                    .option("user", "root")
                    .option("password", "")
                    .load();

            Dataset<Row> categories = sparkSession.read()
                    .format("jdbc")
                    .option("url", "jdbc:mysql://localhost:3306/job4u")
                    .option("dbtable", "categories")
                    .option("user", "root")
                    .option("password", "")
                    .load();

            // Đăng ký DataFrame thành temporary views
            cvs.createOrReplaceTempView("cvs");
            posts.createOrReplaceTempView("posts");
            categories.createOrReplaceTempView("categories");

            // Query để phân tích tỷ lệ chuyển đổi (conversion rate) theo ngành
            String conversionRateQuery =
                    "SELECT c.name AS category_name, " +
                            "COUNT(cv.id) AS application_count, " +
                            "COUNT(DISTINCT p.id) AS post_count, " +
                            "COUNT(cv.id) / COUNT(DISTINCT p.id) AS conversion_rate " +
                            "FROM posts p " +
                            "JOIN categories c ON p.category_id = c.id " +
                            "LEFT JOIN cvs cv ON p.id = cv.post_id " +
                            "GROUP BY c.name " +
                            "ORDER BY conversion_rate DESC";
            Dataset<Row> conversionRate = sparkSession.sql(conversionRateQuery);
            List<Map<String, Object>> conversionRateList = conversionRate.collectAsList().stream().map(row -> {
                Map<String, Object> map = new HashMap<>();
                map.put("category_name", row.getString(0));
                map.put("application_count", row.getLong(1));
                map.put("post_count", row.getLong(2));
                map.put("conversion_rate", row.getDouble(3));
                return map;
            }).collect(Collectors.toList());
            result.put("categoryConversionRates", conversionRateList);

            // Phân tích hiệu suất theo thời gian trong ngày
            String hourOfDayQuery =
                    "SELECT HOUR(cv.created_At) AS hour_of_day, " +
                            "COUNT(*) AS application_count " +
                            "FROM cvs cv " +
                            "GROUP BY hour_of_day " +
                            "ORDER BY hour_of_day";
            Dataset<Row> hourOfDay = sparkSession.sql(hourOfDayQuery);
            List<Map<String, Object>> hourOfDayList = hourOfDay.collectAsList().stream().map(row -> {
                Map<String, Object> map = new HashMap<>();
                map.put("hour_of_day", row.getInt(0)); // HOUR trả về số (0-23)
                map.put("application_count", row.getLong(1));
                return map;
            }).collect(Collectors.toList());
            result.put("applicationsByHourOfDay", hourOfDayList);

            logger.info("Result before return: " + result.toString());

        } catch (Exception e) {
            logger.error("Error analyzing application trends with Spark", e);
            result.put("error", e.getMessage());
        }

        return result;
    }

    @PreDestroy
    public void cleanup() {
        if (sparkSession != null) {
            sparkSession.stop(); // Đóng SparkSession khi ứng dụng tắt
        }
    }
}
