import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { getCompanyStatusByIdService } from "../../service/CompanyService";

const Menu = () => {
  const location = useLocation();
  const [user, setUser] = useState({});
  const [expandedMenu, setExpandedMenu] = useState({});
  const [companyStatus, setCompanyStatus] = useState(null);

  // Lấy thông tin user từ localStorage
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userData);
  }, []);

  // Đồng bộ trạng thái menu với URL hiện tại
  useEffect(() => {
    const pathSegments = location.pathname.split("/");
    const currentMenu = pathSegments[2]; // Lấy phần tử thứ 2 trong URL
    setExpandedMenu((prev) => ({
      ...prev,
      [currentMenu]: true,
    }));
  }, [location.pathname]);

  // Lấy trạng thái của công ty dựa vào ID
  useEffect(() => {
    const fetchCompanyStatus = async () => {
      try {
        if (user?.companyId) {
          const status = await getCompanyStatusByIdService(user.companyId);
          setCompanyStatus(status);
        }
      } catch (error) {
        console.error("Error fetching company status:", error);
      }
    };
    fetchCompanyStatus();
  }, [user]);

  // Hàm toggle menu
  const toggleMenu = (menuId) => {
    setExpandedMenu((prev) => ({
      ...prev,
      [menuId]: !prev[menuId],
    }));
  };

  return (
    <nav className="sidebar sidebar-offcanvas" id="sidebar">
      <ul className="nav">
        <li className="nav-item">
          <Link className="nav-link" to="/admin/">
            <i className="icon-grid menu-icon" />
            <span className="menu-title">Trang chủ</span>
          </Link>
        </li>

        {user.role === "ADMIN" && (
          <>
            {/* Menu Quản lý User */}
            <li className="nav-item">
              <a
                className="nav-link"
                onClick={() => toggleMenu("user")}
                aria-expanded={expandedMenu["user"] || false}
                href="#"
              >
                <i className="icon-head menu-icon" />
                <span className="menu-title">Quản lý User</span>
                <i className="menu-arrow" />
              </a>
              <div
                className={`collapse ${expandedMenu["user"] ? "show" : ""}`}
                id="user"
              >
                <ul className="nav flex-column sub-menu">
                  <li className="nav-item">
                    <Link className="nav-link" to="/admin/list-user/">
                      Danh sách người dùng
                    </Link>
                  </li>
                </ul>
              </div>
            </li>
            {/* Menu Quản lý Công ty */}
            <li className="nav-item">
              <a
                className="nav-link"
                onClick={() => toggleMenu("companies")}
                aria-expanded={expandedMenu["companies"] || false}
                href="#"
              >
                <i className="far fa-building menu-icon" />
                <span className="menu-title">Quản lý Công ty</span>
                <i className="menu-arrow" />
              </a>
              <div
                className={`collapse ${
                  expandedMenu["companies"] ? "show" : ""
                }`}
                id="companies"
              >
                <ul className="nav flex-column sub-menu">
                  <li className="nav-item">
                    <Link className="nav-link" to="/admin/list-companies/">
                      Danh sách công ty
                    </Link>
                  </li>
                </ul>
              </div>
            </li>
            {/* Menu Quản lý loại công việc */}
            <li className="nav-item">
              <a
                className="nav-link"
                onClick={() => toggleMenu("jobtype")}
                aria-expanded={expandedMenu["jobtype"] || false}
                href="#"
              >
                <i className="fa fa-briefcase menu-icon" />

                <span className="menu-title">Quản lý loại công việc</span>
                <i className="menu-arrow" />
              </a>
              <div
                className={`collapse ${expandedMenu["jobtype"] ? "show" : ""}`}
                id="jobtype"
              >
                <ul className="nav flex-column sub-menu">
                  <li className="nav-item">
                    <Link className="nav-link" to="/admin/list-job-type/">
                      Danh sách loại công việc
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/admin/add-job-type/">
                      Thêm loại công việc
                    </Link>
                  </li>
                </ul>
              </div>
            </li>
            {/* Menu Quản lý cấp bậc */}
            <li className="nav-item">
              <a
                className="nav-link"
                onClick={() => toggleMenu("joblevel")}
                aria-expanded={expandedMenu["joblevel"] || false}
                href="#"
              >
                <i className="fas fa-level-up-alt menu-icon"></i>
                <span className="menu-title">Quản lý cấp bậc</span>
                <i className="menu-arrow" />
              </a>
              <div
                className={`collapse ${expandedMenu["joblevel"] ? "show" : ""}`}
                id="joblevel"
              >
                <ul className="nav flex-column sub-menu">
                  <li className="nav-item">
                    <Link className="nav-link" to="/admin/list-job-level/">
                      Danh sách cấp bậc
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/admin/add-job-level/">
                      Thêm cấp bậc
                    </Link>
                  </li>
                </ul>
              </div>
            </li>
            {/* Menu Quản lý kinh nghiệm */}
            <li className="nav-item">
              <a
                className="nav-link"
                onClick={() => toggleMenu("exptype")}
                aria-expanded={expandedMenu["exptype"] || false}
                href="#"
              >
                <i className="far fa-star menu-icon"></i>
                <span className="menu-title">Quản lý kinh nghiệm</span>
                <i className="menu-arrow" />
              </a>
              <div
                className={`collapse ${expandedMenu["exptype"] ? "show" : ""}`}
                id="exptype"
              >
                <ul className="nav flex-column sub-menu">
                  <li className="nav-item">
                    <Link className="nav-link" to="/admin/list-exp-type/">
                      Danh sách kinh nghiệm
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/admin/add-exp-type/">
                      Thêm kinh nghiệm
                    </Link>
                  </li>
                </ul>
              </div>
            </li>
            {/* Menu Quản lý kỹ năng */}
            <li className="nav-item">
              <a
                className="nav-link"
                onClick={() => toggleMenu("skilltype")}
                aria-expanded={expandedMenu["skilltype"] || false}
                href="#"
              >
                <i className="far fa-hand-paper menu-icon"></i>
                <span className="menu-title">Quản lý kỹ năng</span>
                <i className="menu-arrow" />
              </a>
              <div
                className={`collapse ${
                  expandedMenu["skilltype"] ? "show" : ""
                }`}
                id="skilltype"
              >
                <ul className="nav flex-column sub-menu">
                  <li className="nav-item">
                    <Link className="nav-link" to="/admin/list-skill-type/">
                      Danh sách kỹ năng
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/admin/add-skill-type/">
                      Thêm kỹ năng
                    </Link>
                  </li>
                </ul>
              </div>
            </li>
            {/* Menu Quản lý hình thức làm việc */}
            <li className="nav-item">
              <a
                className="nav-link"
                onClick={() => toggleMenu("worktype")}
                aria-expanded={expandedMenu["worktype"] || false}
                href="#"
              >
                <i className="fas fa-briefcase menu-icon"></i>
                <span className="menu-title">Quản lý hình thức làm việc</span>
                <i className="menu-arrow" />
              </a>
              <div
                className={`collapse ${expandedMenu["worktype"] ? "show" : ""}`}
                id="worktype"
              >
                <ul className="nav flex-column sub-menu">
                  <li className="nav-item">
                    <Link className="nav-link" to="/admin/list-work-type/">
                      Danh sách hình thức
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/admin/add-work-type/">
                      Thêm hình thức
                    </Link>
                  </li>
                </ul>
              </div>
            </li>
            {/* Menu Quản lý khoảng lương */}
            <li className="nav-item">
              <a
                className="nav-link"
                onClick={() => toggleMenu("salarytype")}
                aria-expanded={expandedMenu["salarytype"] || false}
                href="#"
              >
                <i className="fas fa-money-check-alt menu-icon"></i>
                <span className="menu-title">Quản lý khoảng lương</span>
                <i className="menu-arrow" />
              </a>
              <div
                className={`collapse ${
                  expandedMenu["salarytype"] ? "show" : ""
                }`}
                id="salarytype"
              >
                <ul className="nav flex-column sub-menu">
                  <li className="nav-item">
                    <Link className="nav-link" to="/admin/list-salary-type/">
                      Danh sách khoảng lương
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/admin/add-salary-type/">
                      Thêm khoảng lương
                    </Link>
                  </li>
                </ul>
              </div>
            </li>
            {/* Menu Quản lý bài đăng */}
            <li className="nav-item">
              <a
                className="nav-link"
                onClick={() => toggleMenu("post-admin")}
                aria-expanded={expandedMenu["post-admin"] || false}
                href="#"
              >
                <i className="fa-regular fa-pen-to-square menu-icon"></i>
                <span className="menu-title">Quản lý bài đăng</span>
                <i className="menu-arrow" />
              </a>
              <div
                className={`collapse ${
                  expandedMenu["post-admin"] ? "show" : ""
                }`}
                id="post-admin"
              >
                <ul className="nav flex-column sub-menu">
                  <li className="nav-item">
                    <Link className="nav-link" to="/admin/list-post-admin/">
                      Danh sách bài đăng
                    </Link>
                  </li>
                </ul>
              </div>
            </li>
          </>
        )}

        {/* Menu Quản lý công ty */}
        {user.role === "EMPLOYER_OWNER" && (
          <>
            <li className="nav-item">
              <a
                className="nav-link"
                onClick={() => toggleMenu("company")}
                aria-expanded={expandedMenu["company"] || false}
                href="#"
              >
                <i className="far fa-building menu-icon"></i>
                <span className="menu-title">Quản lý công ty</span>
                <i className="menu-arrow" />
              </a>
              <div
                className={`collapse ${expandedMenu["company"] ? "show" : ""}`}
                id="company"
              >
                <ul className="nav flex-column sub-menu">
                  {user.role === "EMPLOYER_OWNER" && (
                    <li className="nav-item">
                      <Link
                        className="nav-link"
                        to={
                          user.companyId
                            ? `/admin/edit-company/${user.companyId}/`
                            : "/admin/add-company/"
                        }
                      >
                        {user.companyId
                          ? "Cập nhật thông tin công ty"
                          : "Tạo mới công ty"}
                      </Link>
                    </li>
                  )}

                  <li className="nav-item">
                    <Link className="nav-link" to="/admin/recruitment/">
                      Tuyển dụng vào công ty
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/admin/list-employer/">
                      Danh sách nhân viên
                    </Link>
                  </li>
                </ul>
              </div>
            </li>
          </>
        )}
        {(user.role === "EMPLOYER_STAFF" || user.role === "EMPLOYER_OWNER") &&
          companyStatus &&
          companyStatus.data == "APPROVED" && (
            <li className="nav-item">
              <a
                className="nav-link"
                data-toggle="collapse"
                href="#post"
                aria-expanded="false"
                aria-controls="post"
              >
                <i className="fa-regular fa-pen-to-square menu-icon"></i>
                <span className="menu-title">Quản lý bài đăng</span>
                <i className="menu-arrow" />
              </a>
              <div className="collapse" id="post">
                <ul className="nav flex-column sub-menu">
                  <li className="nav-item">
                    {" "}
                    <Link className="nav-link" to="/admin/add-post/">
                      Tạo mới bài đăng
                    </Link>
                  </li>
                  <li className="nav-item">
                    {" "}
                    <Link className="nav-link" to="/admin/list-post/">
                      Danh sách bài đăng
                    </Link>
                  </li>
                </ul>
              </div>
            </li>
          )}
      </ul>
    </nav>
  );
};

export default Menu;
