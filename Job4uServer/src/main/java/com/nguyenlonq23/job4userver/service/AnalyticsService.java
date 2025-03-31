package com.nguyenlonq23.job4userver.service;

import com.nguyenlonq23.job4userver.dto.CVStatisticsDTO;
import com.nguyenlonq23.job4userver.dto.JobStatisticsDTO;
import com.nguyenlonq23.job4userver.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
public class AnalyticsService {
    private final PostRepository postRepository;

    private final CompanyRepository companyRepository;

    private final CategoryRepository categoryRepository;

    private final LocationRepository locationRepository;

    private final UserRepository userRepository;

    private final CVRepository cvRepository;

    public AnalyticsService(PostRepository postRepository, CompanyRepository companyRepository, CategoryRepository categoryRepository, LocationRepository locationRepository, UserRepository userRepository, CVRepository cvRepository) {
        this.postRepository = postRepository;
        this.companyRepository = companyRepository;
        this.categoryRepository = categoryRepository;
        this.locationRepository = locationRepository;
        this.userRepository = userRepository;
        this.cvRepository = cvRepository;
    }

    public JobStatisticsDTO getJobStatistics() {
        JobStatisticsDTO statistics = new JobStatisticsDTO();

        // Tính toán tổng số tin tuyển dụng
        statistics.setTotalPosts(postRepository.count());

        // Số tin tuyển dụng mới trong tháng vừa qua
        LocalDateTime oneMonthAgo = LocalDateTime.now().minusMonths(1);
        statistics.setNewPostsLastMonth(postRepository.countPostsCreatedAfter(oneMonthAgo));

        // Số tin tuyển dụng mới trong tuần vừa qua
        LocalDateTime oneWeekAgo = LocalDateTime.now().minusWeeks(1);
        statistics.setNewPostsLastWeek(postRepository.countPostsCreatedAfter(oneWeekAgo));

        // Phân bố tin tuyển dụng theo tháng
        statistics.setPostCountByMonth(postRepository.findPostCountByMonth());

        // Phân bố tin tuyển dụng theo ngành nghề
        statistics.setCategoryDistribution(categoryRepository.findCategoryPostCounts());

        // Phân bố tin tuyển dụng theo địa điểm
        statistics.setLocationDistribution(locationRepository.findLocationPostCounts());

        // Phân bố tin tuyển dụng theo mức lương
        statistics.setSalaryDistribution(postRepository.findSalaryRangeDistribution());

        // Phân bố tin tuyển dụng theo kinh nghiệm
        statistics.setExperienceDistribution(postRepository.findExperienceDistribution());

        // Phân bố tin tuyển dụng theo cấp bậc công việc
        statistics.setJobLevelDistribution(postRepository.findJobLevelDistribution());

        // Phân bố tin tuyển dụng theo loại hình công việc
        statistics.setWorkTypeDistribution(postRepository.findWorkTypeDistribution());

        // Top công ty có nhiều tin tuyển dụng nhất
        statistics.setTopCompaniesByPosts(companyRepository.findTopCompaniesWithMostPosts());

        return statistics;
    }

    public CVStatisticsDTO getCVStatistics(Integer companyId) {
        CVStatisticsDTO statistics = new CVStatisticsDTO();

        // Tính toán tổng số CV đã nộp cho company cụ thể
        statistics.setTotalCVs(cvRepository.countByCompanyId(companyId));

        // Số CV nộp trong tháng vừa qua
        LocalDateTime oneMonthAgo = LocalDateTime.now().minusMonths(1);
        statistics.setNewCVsLastMonth(cvRepository.countCVsSubmittedAfter(oneMonthAgo, companyId));

        // Số CV nộp trong tuần vừa qua
        LocalDateTime oneWeekAgo = LocalDateTime.now().minusWeeks(1);
        statistics.setNewCVsLastWeek(cvRepository.countCVsSubmittedAfter(oneWeekAgo, companyId));

        // Phân bố CV theo tháng
        statistics.setCvCountByMonth(cvRepository.findCVCountByMonth(companyId));

        // Top bài đăng có nhiều CV nộp nhất
        statistics.setTopPostsWithMostApplications(cvRepository.findTopPostsWithMostApplications(companyId));

        // Phân bố CV theo trạng thái đã xem hay chưa
        statistics.setCheckStatusDistribution(cvRepository.countCVsByCheckStatus(companyId));

        return statistics;
    }

    public Map<String, Object> getDashboardSummary() {
        Map<String, Object> summary = new HashMap<>();

        // Tổng quan về nền tảng
        summary.put("totalPosts", postRepository.count());
        summary.put("totalCompanies", companyRepository.count());
        summary.put("totalUsers", userRepository.count());
        summary.put("totalCVs", cvRepository.count());

        // Thống kê gần đây - tuần qua
        LocalDateTime oneWeekAgo = LocalDateTime.now().minusWeeks(1);
        summary.put("newPostsLastWeek", postRepository.countPostsCreatedAfter(oneWeekAgo));
        summary.put("newUsersLastWeek", userRepository.countUsersRegisteredAfter(oneWeekAgo));
        summary.put("newCVsLastWeek", cvRepository.countCVsSubmittedAfter(oneWeekAgo));

        return summary;
    }
}
