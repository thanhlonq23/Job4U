import React, { useEffect, useState, useMemo } from "react";
import { toast } from "react-toastify";
import { getJobStatisticsService } from "../../../service/AnalysisService";
import { PieChart } from "react-minimal-pie-chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

// Constants
const PRIMARY_COLOR = "#5c5ac7";
const COLORS = [
  "#4B77BE",
  "#F39C12",
  "#16A085",
  "#E74C3C",
  "#9B59B6",
  "#2ECC71",
  "#3498DB",
  "#F1C40F",
  "#E67E22",
  "#1ABC9C",
];
const INITIAL_STATS = {
  totalPosts: 0,
  newPostsLastMonth: 0,
  newPostsLastWeek: 0,
  postCountByMonth: [],
  categoryDistribution: [],
  locationDistribution: [],
  salaryDistribution: [],
  experienceDistribution: [],
  jobLevelDistribution: [],
  workTypeDistribution: [],
  topCompaniesByPosts: [],
};

// Utility function to format distribution data
const formatDistributionData = (data, totalPosts, colors) =>
  (data || []).map((item, index) => ({
    title: item.name || item.salary_range || "Unknown",
    value: item.postCount || 0,
    color: colors[index % colors.length],
    percentage:
      totalPosts > 0
        ? Math.round(((item.postCount || 0) / totalPosts) * 100)
        : 0,
    name: item.name || item.salary_range || "Unknown",
    postCount: item.postCount || 0,
  }));

const AnalyticsDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [jobStats, setJobStats] = useState(INITIAL_STATS);
  const [selectedDistribution, setSelectedDistribution] = useState("category");

  // Fetch data
  useEffect(() => {
    const fetchJobStatistics = async () => {
      try {
        setLoading(true);
        const response = await getJobStatisticsService();

        if (response?.status === "SUCCESS") {
          setJobStats(response.data || INITIAL_STATS);
        } else {
          toast.error("Không thể lấy dữ liệu thống kê công việc!");
        }
      } catch (error) {
        console.error("Error fetching job statistics:", error);
        toast.error(
          `Đã xảy ra lỗi khi tải dữ liệu: ${error.message || "Unknown error"}`
        );
      } finally {
        setLoading(false);
      }
    };

    fetchJobStatistics();
  }, []);

  // Memoized data formatting
  const distributionData = useMemo(
    () => ({
      category: formatDistributionData(
        jobStats.categoryDistribution,
        jobStats.totalPosts,
        COLORS
      ),
      location: formatDistributionData(
        jobStats.locationDistribution,
        jobStats.totalPosts,
        COLORS
      ),
      salary: formatDistributionData(
        jobStats.salaryDistribution,
        jobStats.totalPosts,
        COLORS
      ),
      experience: formatDistributionData(
        jobStats.experienceDistribution,
        jobStats.totalPosts,
        COLORS
      ),
      jobLevel: formatDistributionData(
        jobStats.jobLevelDistribution,
        jobStats.totalPosts,
        COLORS
      ),
      workType: formatDistributionData(
        jobStats.workTypeDistribution,
        jobStats.totalPosts,
        COLORS
      ),
      topCompanies: formatDistributionData(
        jobStats.topCompaniesByPosts,
        jobStats.totalPosts,
        COLORS
      ),
      monthly: (jobStats.postCountByMonth || []).map((item) => ({
        name: item.month || "Unknown",
        postCount: item.postCount || 0,
      })),
    }),
    [jobStats]
  );

  // Chart configurations
  const chartConfigs = useMemo(
    () => ({
      category: { title: "Phân phối theo danh mục", chartType: "pie" },
      workType: { title: "Phân phối theo loại công việc", chartType: "pie" },
      salary: { title: "Phân phối theo mức lương", chartType: "bar" },
      experience: { title: "Phân phối theo kinh nghiệm", chartType: "bar" },
      location: { title: "Phân phối theo vị trí", chartType: "horizontalBar" },
      jobLevel: { title: "Phân phối theo cấp bậc công việc", chartType: "bar" },
      topCompanies: {
        title: "Top công ty đăng tuyển nhiều nhất",
        chartType: "bar",
      },
    }),
    []
  );

  const currentChart =
    chartConfigs[selectedDistribution] || chartConfigs.category;
  const currentData = distributionData[selectedDistribution] || [];

  // Chart rendering components
  const ChartComponents = {
    pie: () => (
      <div className="row">
        <div className="col-md-4">
          {currentData.map((item, index) => (
            <div key={index} style={{ marginBottom: "10px" }}>
              <div
                style={{
                  width: "30px",
                  backgroundColor: item.color,
                  height: "20px",
                  display: "inline-block",
                  marginRight: "10px",
                }}
              ></div>
              <span style={{ color: PRIMARY_COLOR }}>
                {item.title}: {item.value} bài ({item.percentage}%)
              </span>
            </div>
          ))}
        </div>
        <div className="col-md-8">
          <div style={{ width: "100%", height: "300px" }}>
            <PieChart
              label={({ x, y, dx, dy, dataEntry }) => (
                <text
                  x={x}
                  y={y}
                  dx={dx}
                  dy={dy}
                  dominantBaseline="central"
                  textAnchor="middle"
                  style={{ fontSize: "5px", fill: "#fff", fontWeight: "bold" }}
                >
                  {`${dataEntry.percentage}%`}
                </text>
              )}
              data={currentData}
              lineWidth={60}
              paddingAngle={2}
            />
          </div>
        </div>
      </div>
    ),
    bar: () => (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={currentData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E6E6FA" />
          <XAxis
            dataKey="name"
            stroke={PRIMARY_COLOR}
            tick={{ fill: PRIMARY_COLOR, fontWeight: "bold" }}
          />
          <YAxis
            stroke={PRIMARY_COLOR}
            tick={{ fill: PRIMARY_COLOR, fontWeight: "bold" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#F9F9FF",
              border: `1px solid ${PRIMARY_COLOR}`,
              borderRadius: "5px",
            }}
            labelStyle={{ color: PRIMARY_COLOR, fontWeight: "bold" }}
            itemStyle={{ color: PRIMARY_COLOR }}
          />
          <Legend wrapperStyle={{ color: PRIMARY_COLOR, fontWeight: "bold" }} />
          <Bar
            dataKey="postCount"
            name="Số lượng bài đăng"
            fill={PRIMARY_COLOR}
          />
        </BarChart>
      </ResponsiveContainer>
    ),
    horizontalBar: () => (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={currentData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          layout="vertical"
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E6E6FA" />
          <XAxis
            type="number"
            stroke={PRIMARY_COLOR}
            tick={{ fill: PRIMARY_COLOR, fontWeight: "bold" }}
          />
          <YAxis
            dataKey="name"
            type="category"
            width={150}
            stroke={PRIMARY_COLOR}
            tick={{ fill: PRIMARY_COLOR, fontWeight: "bold" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#F9F9FF",
              border: `1px solid ${PRIMARY_COLOR}`,
              borderRadius: "5px",
            }}
            labelStyle={{ color: PRIMARY_COLOR, fontWeight: "bold" }}
            itemStyle={{ color: PRIMARY_COLOR }}
          />
          <Legend wrapperStyle={{ color: PRIMARY_COLOR, fontWeight: "bold" }} />
          <Bar
            dataKey="postCount"
            name="Số lượng bài đăng"
            fill={PRIMARY_COLOR}
          />
        </BarChart>
      </ResponsiveContainer>
    ),
  };

  const renderDistributionChart = () => {
    if (!currentData.length) {
      return (
        <div
          className="text-center py-5"
          style={{
            color: PRIMARY_COLOR,
            fontSize: "1.1rem",
            fontWeight: "bold",
          }}
        >
          Không có dữ liệu
        </div>
      );
    }
    return ChartComponents[currentChart.chartType]();
  };

  if (loading) {
    return (
      <div
        style={{ color: PRIMARY_COLOR, textAlign: "center", padding: "20px" }}
      >
        Đang tải dữ liệu...
      </div>
    );
  }

  return (
    <>
      <div className="row">
        <div className="col-md-12 grid-margin">
          <h3 style={{ fontWeight: "bold" }}>Thống kê bài đăng tuyển dụng</h3>
        </div>
      </div>

      <div className="row">
        {[
          {
            title: "Tổng số bài đăng",
            value: jobStats.totalPosts,
            icon: "fa-pen-to-square fa-regular menu-icon",
          },
          {
            title: "Bài đăng mới trong tháng",
            value: jobStats.newPostsLastMonth,
            icon: "fa-calendar fa-regular menu-icon",
          },
          {
            title: "Bài đăng mới trong tuần",
            value: jobStats.newPostsLastWeek,
            icon: "fa-calendar fa-regular menu-icon",
          },
        ].map((stat, index) => (
          <div key={index} className="col-md-4 grid-margin stretch-card">
            <div
              className="card card-img-holder text-white"
              style={{ border: "1px solid  #5c5ac7" }}
            >
              <div className="card-body">
                <h4 className="font-weight-normal mb-3">
                  {stat.title}
                  <i className={`float-right mdi mdi-24px ${stat.icon}`}></i>
                </h4>
                <h2 className="mb-5">{stat.value || 0}</h2>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row">
        <div className="col-lg-12 grid-margin stretch-card">
          <div
            className="card"
            style={{
              border: `1px solid ${PRIMARY_COLOR}`,
              boxShadow: `0 4px 12px rgba(75, 73, 172, 0.2)`,
              backgroundColor: "#F9F9FF",
            }}
          >
            <div className="card-body">
              <h4
                className="card-title"
                style={{
                  fontWeight: "bold",
                  color: PRIMARY_COLOR,
                  textShadow: `0.5px 0.5px 1px rgba(75, 73, 172, 0.3)`,
                }}
              >
                Số lượng bài đăng theo tháng
              </h4>
              {distributionData.monthly.length ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart
                    data={distributionData.monthly}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <defs>
                      <linearGradient
                        id="colorGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor={PRIMARY_COLOR}
                          stopOpacity={0.9}
                        />
                        <stop
                          offset="95%"
                          stopColor="#7D7CCF"
                          stopOpacity={0.7}
                        />
                      </linearGradient>
                      <linearGradient
                        id="areaGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor={PRIMARY_COLOR}
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#7D7CCF"
                          stopOpacity={0.05}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E6E6FA" />
                    <XAxis
                      dataKey="name"
                      stroke={PRIMARY_COLOR}
                      tick={{ fill: PRIMARY_COLOR, fontWeight: "bold" }}
                    />
                    <YAxis
                      stroke={PRIMARY_COLOR}
                      tick={{ fill: PRIMARY_COLOR, fontWeight: "bold" }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#F9F9FF",
                        border: `1px solid ${PRIMARY_COLOR}`,
                        borderRadius: "5px",
                      }}
                      labelStyle={{ color: PRIMARY_COLOR, fontWeight: "bold" }}
                      itemStyle={{ color: PRIMARY_COLOR }}
                    />
                    <Legend
                      wrapperStyle={{
                        color: PRIMARY_COLOR,
                        fontWeight: "bold",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="postCount"
                      name="Số lượng bài đăng"
                      stroke="url(#colorGradient)"
                      strokeWidth={3}
                      fill="url(#areaGradient)"
                      activeDot={{
                        r: 8,
                        fill: "#7D7CCF",
                        stroke: PRIMARY_COLOR,
                        strokeWidth: 2,
                      }}
                      dot={{
                        r: 5,
                        fill: PRIMARY_COLOR,
                        stroke: "#fff",
                        strokeWidth: 2,
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div
                  className="text-center py-5"
                  style={{
                    color: PRIMARY_COLOR,
                    fontSize: "1.1rem",
                    fontWeight: "bold",
                  }}
                >
                  Không có dữ liệu
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-12 grid-margin stretch-card">
          <div
            className="card"
            style={{
              border: `1px solid ${PRIMARY_COLOR}`,
              boxShadow: `0 4px 12px rgba(75, 73, 172, 0.2)`,
              backgroundColor: "#F9F9FF",
            }}
          >
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between mb-4">
                <h4
                  className="card-title"
                  style={{ color: PRIMARY_COLOR, fontWeight: "bold" }}
                >
                  {currentChart.title}
                </h4>
                <select
                  className="form-control"
                  value={selectedDistribution}
                  onChange={(e) => setSelectedDistribution(e.target.value)}
                  style={{
                    borderColor: PRIMARY_COLOR,
                    color: PRIMARY_COLOR,
                    width: "250px",
                  }}
                >
                  {Object.entries(chartConfigs).map(([key, { title }]) => (
                    <option key={key} value={key}>
                      {title}
                    </option>
                  ))}
                </select>
              </div>
              {renderDistributionChart()}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AnalyticsDashboard;
