import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const Menu = () => {
  const location = useLocation();
  const [user, setUser] = useState({});
  const [expandedMenu, setExpandedMenu] = useState({});

  // Lấy thông tin user từ localStorage
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
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

        {/* Menu Quản lý User */}
        <li className="nav-item">
          <a
            className="nav-link"
            onClick={() => toggleMenu("user")}
            aria-expanded={expandedMenu["user"] || false}
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
              <li className="nav-item">
                <Link className="nav-link" to="/admin/add-user/">
                  Thêm người dùng
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
          >
            <i className="far fa-building menu-icon" />
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

        {/* Menu Quản lý hình thức làm việc */}
        <li className="nav-item">
          <a
            className="nav-link"
            onClick={() => toggleMenu("worktype")}
            aria-expanded={expandedMenu["worktype"] || false}
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
          >
            <i className="fas fa-money-check-alt menu-icon"></i>
            <span className="menu-title">Quản lý khoảng lương</span>
            <i className="menu-arrow" />
          </a>
          <div
            className={`collapse ${expandedMenu["salarytype"] ? "show" : ""}`}
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

        {/* Menu Quản lý công ty */}
        <li className="nav-item">
          <a
            className="nav-link"
            onClick={() => toggleMenu("company")}
            aria-expanded={expandedMenu["company"] || false}
          >
            <i className="far fa-clock menu-icon"></i>
            <span className="menu-title">Quản lý công ty</span>
            <i className="menu-arrow" />
          </a>
          <div
            className={`collapse ${expandedMenu["company"] ? "show" : ""}`}
            id="company"
          >
            <ul className="nav flex-column sub-menu">
              <li className="nav-item">
                <Link className="nav-link" to="/admin/add-company/">
                  Tạo mới công ty
                </Link>
              </li>
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
      </ul>
    </nav>
  );
};

export default Menu;
