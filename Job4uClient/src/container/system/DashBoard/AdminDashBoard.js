import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getDashboardSummaryService } from "../../../service/AnalysisService";
import "../../../css/styles/abc.scss";

const AdminDashBoard = () => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    totalPosts: 0,
    newPostsLastWeek: 0,
    totalUsers: 0,
    newUsersLastWeek: 0,
    totalCompanies: 0,
    totalCVs: 0,
    newCVsLastWeek: 0,
    topCompanies: [],
    topLocations: [],
    topCategories: [],
  });

  const fetchDashboardSummary = async () => {
    try {
      setLoading(true);
      const response = await getDashboardSummaryService();
      console.log(response);

      if (response?.status === "SUCCESS") {
        setDashboardData(response.data);
      } else {
        toast.error("Không thể lấy dữ liệu tổng quan bảng điều khiển!");
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi tải dữ liệu: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userInfo")) || {};
    setUser(userData);
    fetchDashboardSummary();
  }, []);

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Đang tải dữ liệu...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid dashboard-container">
      {/* Phần chào mừng từ WelcomeAdmin với style được cải thiện */}
      <div className="row mb-4">
        <div className="col-md-12">
          <div
            className="welcome-container"
            style={{
              border: "1px solid #5c5ac7",
              borderRadius: "20px",
            }}
          >
            <h1 className="welcome-title" style={{ color: "#5c5ac7" }}>
              Xin chào {user.fullName || "Quản trị viên"},
              <br />
              Chào mừng đến với trang quản trị
            </h1>
          </div>
        </div>
      </div>

      {/* Thẻ thống kê tổng quan với animation khi hover */}
      <div className="row">
        <div className="col-md-3 grid-margin stretch-card">
          <div
            className="card card-img-holder text-white"
            style={{
              border: "1px solid #5c5ac7",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              cursor: "pointer",
            }}
          >
            <div className="card-body">
              <h4
                className="font-weight-normal mb-3"
                style={{
                  fontWeight: "bold",
                  color: "#5c5ac7",
                  textShadow: `0.5px 0.5px 1px rgba(75, 73, 172, 0.3)`,
                }}
              >
                Tổng số bài đăng
                <i className="float-right mdi mdi-24px mdi-file-document-box"></i>
              </h4>
              <h2 className="mb-5">{dashboardData.totalPosts}</h2>
              <h6>
                Mới trong tuần:{" "}
                <span className="text-success">
                  {dashboardData.newPostsLastWeek}
                </span>
              </h6>
            </div>
          </div>
        </div>

        <div className="col-md-3 grid-margin stretch-card">
          <div
            className="card card-img-holder text-white"
            style={{
              border: "1px solid #5c5ac7",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              cursor: "pointer",
            }}
          >
            <div className="card-body">
              <h4
                className="font-weight-normal mb-3"
                style={{
                  fontWeight: "bold",
                  color: "#5c5ac7",
                  textShadow: `0.5px 0.5px 1px rgba(75, 73, 172, 0.3)`,
                }}
              >
                Tổng số hồ sơ
                <i className="float-right mdi mdi-24px mdi-file-document"></i>
              </h4>
              <h2 className="mb-5">{dashboardData.totalCVs}</h2>
              <h6>
                Mới trong tuần:{" "}
                <span className="text-success">
                  {dashboardData.newCVsLastWeek}
                </span>
              </h6>
            </div>
          </div>
        </div>

        <div className="col-md-3 grid-margin stretch-card">
          <div
            className="card card-img-holder text-white"
            style={{
              border: "1px solid #5c5ac7",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              cursor: "pointer",
            }}
          >
            <div className="card-body">
              <h4
                className="font-weight-normal mb-3"
                style={{
                  fontWeight: "bold",
                  color: "#5c5ac7",
                  textShadow: `0.5px 0.5px 1px rgba(75, 73, 172, 0.3)`,
                }}
              >
                Tổng số người dùng
                <i className="float-right mdi mdi-24px mdi-account-multiple"></i>
              </h4>
              <h2 className="mb-5">{dashboardData.totalUsers}</h2>
              <h6>
                Mới trong tuần:{" "}
                <span className="text-success">
                  {dashboardData.newUsersLastWeek}
                </span>
              </h6>
            </div>
          </div>
        </div>

        <div className="col-md-3 grid-margin stretch-card">
          <div
            className="card card-img-holder text-white"
            style={{
              border: "1px solid #5c5ac7",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              cursor: "pointer",
            }}
          >
            <div className="card-body">
              <h4
                className="font-weight-normal mb-3"
                style={{
                  fontWeight: "bold",
                  color: "#5c5ac7",
                  textShadow: `0.5px 0.5px 1px rgba(75, 73, 172, 0.3)`,
                }}
              >
                Tổng số công ty
                <i className="float-right mdi mdi-24px mdi-office-building"></i>
              </h4>
              <h2 className="mb-5">{dashboardData.totalCompanies}</h2>
              <h6>&nbsp;</h6>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashBoard;
