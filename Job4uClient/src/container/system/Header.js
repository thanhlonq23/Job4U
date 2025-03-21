import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const Header = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    image: "/assetsAdmin/images/default-profile.png", // Ảnh mặc định
  });

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("authToken");
    window.location.href = "/";
  };

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData) {
      setUser(userData);
    }
  }, []);

  return (
    <nav className="navbar col-lg-12 col-12 p-0 fixed-top d-flex flex-row">
      <div className="text-center navbar-brand-wrapper d-flex align-items-center justify-content-center">
        <Link className="navbar-brand brand-logo mr-5" to="/">
          <img src="/assetsAdmin/images/logo.png" className="mr-2" alt="logo" />
          JOB4U
        </Link>
        <a className="navbar-brand brand-logo-mini" href="index.html">
          <img src="/assetsAdmin/images/logo.png" alt="logo" />
        </a>
      </div>
      <div className="navbar-menu-wrapper d-flex align-items-center justify-content-end">
        <button
          className="navbar-toggler navbar-toggler align-self-center"
          type="button"
          data-toggle="minimize"
        >
          <span className="icon-menu" />
        </button>

        <ul className="navbar-nav navbar-nav-right">
          <li className="nav-item nav-profile dropdown">
            <a
              className="nav-link dropdown-toggle"
              href="#"
              data-toggle="dropdown"
              id="profileDropdown"
            >
              <img
                style={{ objectFit: "cover" }}
                src={user?.image || "/assetsAdmin/images/default-profile.png"}
                alt="profile"
              />
            </a>
            <div
              className="dropdown-menu dropdown-menu-right navbar-dropdown"
              aria-labelledby="profileDropdown"
            >
              <Link to="/admin/user-info/" className="dropdown-item">
                <i className="far fa-user text-primary"></i>
                Thông tin
              </Link>
              <Link to="/admin/changepassword/" className="dropdown-item">
                <i className="ti-settings text-primary" />
                Đổi mật khẩu
              </Link>
              <a onClick={handleLogout} className="dropdown-item">
                <i className="ti-power-off text-primary" />
                Logout
              </a>
            </div>
          </li>
        </ul>
        <button
          className="navbar-toggler navbar-toggler-right d-lg-none align-self-center"
          type="button"
          data-toggle="offcanvas"
        >
          <span className="icon-menu" />
        </button>
        <ToastContainer />
      </div>
    </nav>
  );
};

export default Header;
