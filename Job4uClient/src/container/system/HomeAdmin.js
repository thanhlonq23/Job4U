import React, { useEffect } from "react";
import { Outlet, useNavigate, Routes, Route } from "react-router-dom";
import Header from "./Header";
import Menu from "./Menu";
import Footer from "./Footer";
import adminRoutes from "../../routes/adminRoutes";

const HomeAdmin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    if (!userInfo) {
      navigate("/");
    } else if (
      !["ADMIN", "EMPLOYER_OWNER", "EMPLOYER_STAFF"].includes(userInfo.role)
    ) {
      navigate("/login");
    }
  }, [navigate]);

  // Gọi hàm adminRoutes để lấy danh sách các route
  const routes = adminRoutes();

  return (
    <div className="container-scroller">
      <Header />
      <div className="container-fluid page-body-wrapper">
        <Menu />
        <div className="main-panel">
          <div className="content-wrapper">
            <Routes>
              {routes.map((route, index) => (
                <Route key={index} path={route.path} element={route.element} />
              ))}
            </Routes>
            <Outlet />
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default HomeAdmin;
