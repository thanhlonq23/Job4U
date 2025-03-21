import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getCVStatisticsService } from "../../../service/AnalysisService";
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
} from "recharts";

const EmployerDashBoard = () => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [cvStats, setCvStats] = useState({
    totalCVs: 0,
    newCVsLastMonth: 0,
    newCVsLastWeek: 0,
    cvCountByMonth: [],
    topPostsWithMostApplications: [],
    checkStatusDistribution: [],
  });

  // Màu sắc cho biểu đồ
  const colors = ["#4B77BE", "#F39C12", "#16A085", "#E74C3C", "#9B59B6"];

  const fetchCVStatistics = async () => {
    try {
      setLoading(true);
      const userData = JSON.parse(localStorage.getItem("userInfo"));
      const companyId = userData?.companyId || userData?.id;

      if (!companyId) {
        toast.error("Không tìm thấy thông tin công ty!");
        setLoading(false);
        return;
      }

      const response = await getCVStatisticsService(companyId);
      console.log(response);

      if (response?.status === "SUCCESS") {
        setCvStats(response.data);
      } else {
        toast.error("Không thể lấy dữ liệu thống kê CV!");
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi tải dữ liệu: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userData);
    fetchCVStatistics();
  }, []);

  // Chuẩn bị dữ liệu cho biểu đồ trạng thái kiểm tra CV
  const statusData = cvStats.checkStatusDistribution.map((item, index) => ({
    title: item.is_Checked ? "Đã kiểm tra" : "Chưa kiểm tra",
    value: item.cvCount,
    color: colors[index],
    percentage:
      cvStats.totalCVs > 0
        ? Math.round((item.cvCount / cvStats.totalCVs) * 100)
        : 0,
  }));

  // Chuẩn bị dữ liệu cho biểu đồ số lượng CV theo tháng
  const monthlyData = cvStats.cvCountByMonth.map((item) => ({
    name: item.month,
    cvCount: item.cvCount,
  }));

  // Chuẩn bị dữ liệu cho biểu đồ top bài đăng có nhiều CV nhất
  const topPostsData = cvStats.topPostsWithMostApplications.map(
    (item, index) => ({
      name: item.name,
      applications: item.applicationCount,
      color: colors[index % colors.length],
    })
  );

  if (loading) {
    return <div>Đang tải dữ liệu...</div>;
  }

  return (
    <>
      <div className="row">
        <div className="col-md-12 grid-margin">
          <div className="row">
            <div className="col-12 col-xl-8 mb-4 mb-xl-0">
              <h3 className="font-weight-bold">Xin chào {user.fullName}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Thẻ thống kê tổng quan */}
      <div className="row">
        <div className="col-md-4 grid-margin stretch-card">
          <div
            className="card card-img-holder text-white"
            style={{ border: "1px solid  #5c5ac7" }}
          >
            <div className="card-body">
              <h4 className="font-weight-normal mb-3">
                Tổng số hồ sơ
                <i className="float-right mdi mdi-24px mdi-file-document"></i>
              </h4>
              <h2 className="mb-5">{cvStats.totalCVs}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-4 grid-margin stretch-card">
          <div
            className="card card-img-holder text-white"
            style={{ border: "1px solid  #5c5ac7" }}
          >
            <div className="card-body">
              <h4 className="font-weight-normal mb-3">
                Hồ sơ mới trong tháng
                <i className="float-right mdi mdi-24px mdi-calendar-text"></i>
              </h4>
              <h2 className="mb-5">{cvStats.newCVsLastMonth}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-4 grid-margin stretch-card">
          <div
            className="card card-img-holder text-white"
            style={{ border: "1px solid  #5c5ac7" }}
          >
            <div className="card-body">
              <h4 className="font-weight-normal mb-3">
                Hồ sơ mới trong tuần
                <i className="float-right mdi mdi-24px mdi-calendar-clock"></i>
              </h4>
              <h2 className="mb-5">{cvStats.newCVsLastWeek}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Biểu đồ phân phối trạng thái kiểm tra CV */}
      <div className="row">
        <div className="col-lg-6 grid-margin stretch-card">
          <div className="card" style={{ border: "1px solid  #5c5ac7" }}>
            <div className="card-body">
              <h4 className="card-title">Trạng thái kiểm tra hồ sơ</h4>
              <div className="row">
                <div className="col-md-4">
                  {statusData.map((item, index) => (
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
                      <span>
                        {item.title}: {item.value} hồ sơ ({item.percentage}%)
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
                          style={{
                            fontSize: "5px",
                            fill: "#fff",
                            fontWeight: "bold",
                          }}
                        >
                          {`${dataEntry.percentage}%`}
                        </text>
                      )}
                      data={statusData.map((item) => ({
                        title: item.title,
                        value: item.value,
                        color: item.color,
                        percentage: item.percentage,
                      }))}
                      lineWidth={60}
                      paddingAngle={2}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Biểu đồ số lượng CV theo tháng */}
        <div className="col-lg-6 grid-margin stretch-card">
          <div className="card" style={{ border: "1px solid  #5c5ac7" }}>
            <div className="card-body">
              <h4 className="card-title">Số lượng hồ sơ theo tháng</h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={monthlyData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="cvCount" name="Số lượng hồ sơ" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Biểu đồ top bài đăng có nhiều CV nhất */}
      <div className="row">
        <div className="col-lg-12 grid-margin stretch-card">
          <div className="card" style={{ border: "1px solid  #5c5ac7" }}>
            <div className="card-body">
              <h4 className="card-title">
                Top bài đăng có nhiều ứng viên nhất
              </h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={topPostsData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={150} />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="applications"
                    name="Số lượng ứng viên"
                    fill="#82ca9d"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmployerDashBoard;
