import React, { useState, useEffect } from "react";
import "../../css/styles/abc.scss"; // Đổi tên file CSS để rõ nghĩa hơn

const WelcomeAdmin = () => {
  const [user, setUser] = useState({});

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
    setUser(userInfo);
  }, []);

  return (
    <div className="welcome-container">
      <h1 className="welcome-title">
        Xin chào {user.fullName || "Quản trị viên"},
        <br />
        Chào mừng đến với Bảng điều khiển
      </h1>
      <p className="welcome-subtitle">
        Quản lý hệ thống hiệu quả và dễ dàng hơn bao giờ hết
      </p>
    </div>
  );
};

export default WelcomeAdmin;
