import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getDashboardSummaryService } from "../../../service/AnalysisService";

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
    const userData = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userData);
    fetchDashboardSummary();
  }, []);

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
        <div className="col-md-3 grid-margin stretch-card">
          <div
            className="card card-img-holder text-white"
            style={{ border: "1px solid  #5c5ac7" }}
          >
            <div className="card-body">
              <h4 className="font-weight-normal mb-3">
                Tổng số bài đăng
                <i className="float-right mdi mdi-24px mdi-file-document-box"></i>
              </h4>
              <h2 className="mb-5">{dashboardData.totalPosts}</h2>
              <h6>Mới trong tuần: {dashboardData.newPostsLastWeek}</h6>
            </div>
          </div>
        </div>

        <div className="col-md-3 grid-margin stretch-card">
          <div
            className="card card-img-holder text-white"
            style={{ border: "1px solid  #5c5ac7" }}
          >
            <div className="card-body">
              <h4 className="font-weight-normal mb-3">
                Tổng số hồ sơ
                <i className="float-right mdi mdi-24px mdi-file-document"></i>
              </h4>
              <h2 className="mb-5">{dashboardData.totalCVs}</h2>
              <h6>Mới trong tuần: {dashboardData.newCVsLastWeek}</h6>
            </div>
          </div>
        </div>

        <div className="col-md-3 grid-margin stretch-card">
          <div
            className="card card-img-holder text-white"
            style={{ border: "1px solid  #5c5ac7" }}
          >
            <div className="card-body">
              <h4 className="font-weight-normal mb-3">
                Tổng số người dùng
                <i className="float-right mdi mdi-24px mdi-account-multiple"></i>
              </h4>
              <h2 className="mb-5">{dashboardData.totalUsers}</h2>
              <h6>Mới trong tuần: {dashboardData.newUsersLastWeek}</h6>
            </div>
          </div>
        </div>

        <div className="col-md-3 grid-margin stretch-card">
          <div
            className="card card-img-holder text-white"
            style={{ border: "1px solid  #5c5ac7" }}
          >
            <div className="card-body">
              <h4 className="font-weight-normal mb-3">
                Tổng số công ty
                <i className="float-right mdi mdi-24px mdi-office-building"></i>
              </h4>
              <h2 className="mb-5">{dashboardData.totalCompanies}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Thống kê tổng hợp */}
      <div className="grid-margin stretch-card">
        <div className="card" style={{ border: "1px solid  #5c5ac7" }}>
          <div className="card-body">
            <h4 className="card-title">Thống kê tổng hợp</h4>
            <div className="table-responsive">
              <table
                className="table table-bordered"
                style={{ color: "#5c5ac7" }}
              >
                <thead style={{ backgroundColor: "#6664de", color: "#fff" }}>
                  <tr>
                    <th>Chỉ số</th>
                    <th>Giá trị</th>
                    <th>Tăng trưởng tuần qua</th>
                    <th>Tỷ lệ</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Bài đăng</td>
                    <td>{dashboardData.totalPosts}</td>
                    <td>{dashboardData.newPostsLastWeek}</td>
                    <td>
                      {dashboardData.totalPosts > 0
                        ? Math.round(
                            (dashboardData.newPostsLastWeek /
                              dashboardData.totalPosts) *
                              100
                          )
                        : 0}
                      %
                    </td>
                  </tr>
                  <tr>
                    <td>Hồ sơ ứng tuyển</td>
                    <td>{dashboardData.totalCVs}</td>
                    <td>{dashboardData.newCVsLastWeek}</td>
                    <td>
                      {dashboardData.totalCVs > 0
                        ? Math.round(
                            (dashboardData.newCVsLastWeek /
                              dashboardData.totalCVs) *
                              100
                          )
                        : 0}
                      %
                    </td>
                  </tr>
                  <tr>
                    <td>Người dùng</td>
                    <td>{dashboardData.totalUsers}</td>
                    <td>{dashboardData.newUsersLastWeek}</td>
                    <td>
                      {dashboardData.totalUsers > 0
                        ? Math.round(
                            (dashboardData.newUsersLastWeek /
                              dashboardData.totalUsers) *
                              100
                          )
                        : 0}
                      %
                    </td>
                  </tr>
                  <tr>
                    <td>Công ty</td>
                    <td>{dashboardData.totalCompanies}</td>
                    <td>-</td>
                    <td>-</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashBoard;
