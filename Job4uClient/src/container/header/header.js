import React from "react";
import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import "./header.scss";
import AuthPopup from "../../components/auth/AuthPopup";

const Header = () => {
  const [user, setUser] = useState({});
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);
  }, []);

  let scrollHeader = () => {
    window.addEventListener("scroll", function () {
      var header = document.querySelector(".header-area");
      if (header) {
        header.classList.toggle("sticky", window.scrollY > 0);
      }
    });
  };
  scrollHeader();

  const [isAuthPopupOpen, setIsAuthPopupOpen] = useState(false);

  const openAuthPopup = () => {
    setIsAuthPopupOpen(true);
  };

  const closeAuthPopup = () => {
    setIsAuthPopupOpen(false);
  };

  return (
    <>
      <header>
        {/* <!-- Header Start --> */}
        <div className="header-area header-transparrent">
          <div className="headder-top header-sticky">
            <div className="container">
              <div className="row align-items-center">
                <div className="col-lg-3 col-md-2">
                  {/* <!-- Logo --> */}
                  <div className="logo" style={{ zIndex: 1 }}>
                    <NavLink to="/">
                      <img
                        src="/assets/img/logo/long-logo.png"
                        alt=""
                        style={{ width: "160px", height: "auto" }}
                      />
                    </NavLink>
                  </div>
                </div>
                <div className="col-lg-9 col-md-9">
                  <div className="menu-wrapper">
                    {/* <!-- Main-menu --> */}
                    <div className="main-menu">
                      <nav className="d-none d-lg-block">
                        <ul id="navigation">
                          <li>
                            <NavLink
                              to="/"
                              isActive={() => window.scrollTo(0, 0)}
                            >
                              Trang chủ
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to="/job"
                              isActive={() => window.scrollTo(0, 0)}
                            >
                              Việc làm{" "}
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to="/company"
                              isActive={() => window.scrollTo(0, 0)}
                            >
                              Công ty{" "}
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to="#"
                              isActive={() => window.scrollTo(0, 0)}
                            >
                              Giới thiệu
                            </NavLink>
                          </li>
                          {/* <li><NavLink to="/contact" >Contact</NavLink></li> */}
                        </ul>
                      </nav>
                    </div>
                    {/* <!-- Header-btn --> */}
                    <div class="header-btn d-none f-right d-lg-block">
                      {user ? (
                        <ul className="navbar-nav navbar-nav-right">
                          <li className="nav-item nav-profile dropdown">
                            <a
                              className="nav-link dropdown-toggle box-header-profile"
                              href="#"
                              data-toggle="dropdown"
                              id="profileDropdown"
                            >
                              <img
                                style={{
                                  objectFit: "cover",
                                  width: "30px",
                                  height: "30px",
                                  borderRadius: "50%",
                                  marginLeft: "15px",
                                }}
                                src="/assets/img/icon/ava.png"
                                alt="profile"
                              />
                              <span className="header-name-user">
                                {user.fullName}
                              </span>
                            </a>
                            <div
                              className="dropdown-menu dropdown-menu-right navbar-dropdown"
                              aria-labelledby="profileDropdown"
                            >
                              <Link
                                to="/candidate/info"
                                className="dropdown-item"
                              >
                                <i className="far fa-user text-primary" />
                                Thông tin
                              </Link>
                              {user &&
                                (user.role === "ADMIN" ||
                                  user.role === "EMPLOYER_OWNER" ||
                                  user.role === "EMPLOYER_STAFF") && (
                                  <Link to="/admin/" className="dropdown-item">
                                    <i className="far fa-file-word text-primary"></i>
                                    Trang quản trị
                                  </Link>
                                )}
                              <Link
                                to="/candidate/cv-post/"
                                className="dropdown-item"
                              >
                                <i className="far fa-file-word text-primary"></i>
                                Công việc đã nộp
                              </Link>
                              <Link
                                to="/candidate/changepassword/"
                                className="dropdown-item"
                              >
                                <i className="ti-settings text-primary" />
                                Đổi mật khẩu
                              </Link>
                              <NavLink
                                to="/login"
                                className="dropdown-item"
                                onClick={() => {
                                  localStorage.removeItem("userInfo");
                                  localStorage.removeItem("authToken");
                                  window.location.reload();
                                }}
                              >
                                <i className="ti-power-off text-primary" />
                                Đăng xuất
                              </NavLink>
                            </div>
                          </li>
                        </ul>
                      ) : (
                        <>
                          <div className="header__actions">
                            {/* Nút để mở AuthPopup */}
                            <button
                              className="header__auth-btn"
                              onClick={openAuthPopup}
                            >
                              Đăng nhập / Đăng ký
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                {/* <!-- Mobile Menu --> */}
                <div className="col-12">
                  <div className="mobile_menu d-block d-lg-none"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <AuthPopup isOpen={isAuthPopupOpen} onClose={closeAuthPopup} />
        {/* <!-- Header End --> */}
      </header>
    </>
  );
};

export default Header;
