import React, { useState, useEffect } from "react";
import {
  handleLoginService,
  handleRegisterService,
} from "../../service/AuthService";
import { toast } from "react-toastify";
import "./AuthPopup.scss";
import { getCompanyIdByIdService } from "../../service/UserService";

const AuthPopup = ({ isOpen, onClose }) => {
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [registerData, setRegisterData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  // Kiểm tra xem người dùng đã đăng nhập chưa - chỉ chạy 1 lần khi component mount
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("authToken");
      if (token && isOpen) {
        onClose();
      }
    };

    checkAuth();
  }, []);

  // Reset form khi đóng popup
  useEffect(() => {
    if (!isOpen) {
      setIsActive(false);
      setLoginData({ email: "", password: "" });
      setRegisterData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "",
      });
      setIsLoading(false);
    }
  }, [isOpen]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await handleLoginService({
        email: loginData.email,
        password: loginData.password,
      });

      if (!response?.data) {
        toast.error(response?.errMessage || "Đăng nhập thất bại!");
        return;
      }

      const user = response.data;
      localStorage.setItem("authToken", user.token);

      // Tạo đối tượng userInfo cơ bản
      const userInfo = {
        userId: user.userId,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      };

      // Xác định trang chuyển hướng dựa trên vai trò
      const redirectPath = [
        "ADMIN",
        "EMPLOYER_OWNER",
        "EMPLOYER_STAFF",
      ].includes(user.role)
        ? "/admin/"
        : "/";

      // Xử lý lấy companyId có
      if (["EMPLOYER_STAFF", "EMPLOYER_OWNER"].includes(user.role)) {
        try {
          const companyResponse = await getCompanyIdByIdService(user.userId);
          userInfo.companyId = companyResponse.data;
        } catch (error) {
          console.error("Error fetching company ID:", error);
        }
      }

      // Lưu thông tin người dùng
      localStorage.setItem("userInfo", JSON.stringify(userInfo));

      toast.success("Đăng nhập thành công!");
      onClose();

      // Chuyển hướng người dùng
      setTimeout(() => {
        window.location.href = redirectPath;
      }, 100);
    } catch (error) {
      toast.error("Không thể kết nối đến máy chủ. Vui lòng thử lại sau!");
      console.error("Error during login:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    if (registerData.password !== registerData.confirmPassword) {
      toast.error("Mật khẩu và xác nhận mật khẩu không trùng khớp!");
      return;
    }

    setIsLoading(true);

    try {
      // Chuẩn bị dữ liệu gửi đi
      const registerPayload = {
        firstName: registerData.firstName,
        lastName: registerData.lastName,
        email: registerData.email,
        password: registerData.password,
        role: registerData.role,
      };

      const response = await handleRegisterService(registerPayload);

      if (response && response.data) {
        toast.success("Đăng ký thành công! Vui lòng đăng nhập.");
        // Chuyển sang form đăng nhập sau khi đăng ký thành công
        setIsActive(false);

        // Reset form đăng ký
        setRegisterData({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          confirmPassword: "",
          role: "",
        });
      } else {
        toast.error(response.errMessage || "Đăng ký thất bại!");
      }
    } catch (error) {
      toast.error("Không thể kết nối đến máy chủ. Vui lòng thử lại sau!");
      console.error("Error during registration:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value,
    });
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData({
      ...registerData,
      [name]: value,
    });
  };

  const handlePopupClick = (e) => {
    e.stopPropagation();
  };

  if (!isOpen) return null;

  return (
    <div className="auth-popup__overlay" onClick={onClose}>
      <div className="auth-popup__wrapper" onClick={handlePopupClick}>
        <div
          className={`auth-popup__container ${
            isActive ? "auth-popup__container--active" : ""
          }`}
        >
          <button className="auth-popup__close-btn" onClick={onClose}>
            ×
          </button>

          {/* Form Đăng nhập */}
          <div className="auth-popup__form-box">
            <form onSubmit={handleLoginSubmit}>
              <h1 className="text-black">ĐĂNG NHẬP</h1>
              <div className="auth-popup__input-box">
                <input
                  type="email"
                  placeholder="Email"
                  name="email"
                  value={loginData.email}
                  onChange={handleLoginChange}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="auth-popup__input-box">
                <input
                  type="password"
                  placeholder="Mật khẩu"
                  name="password"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="auth-popup__forgot-link">
                <a href="/forget-password">Quên mật khẩu?</a>
              </div>
              <button
                type="submit"
                className={`auth-popup__btn ${
                  isLoading ? "auth-popup__btn--loading" : ""
                }`}
                disabled={isLoading}
              >
                {isLoading ? "Đang xử lý..." : "Đăng Nhập"}
              </button>
            </form>
          </div>

          {/* Form Đăng ký */}
          <div className="auth-popup__form-box auth-popup__form-box--register">
            <form onSubmit={handleRegisterSubmit}>
              <h1 className="text-black">ĐĂNG KÝ</h1>

              <div className="auth-popup__input-row">
                <div className="auth-popup__input-box auth-popup__input-box--half">
                  <input
                    type="text"
                    placeholder="Họ"
                    name="firstName"
                    value={registerData.firstName}
                    onChange={handleRegisterChange}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="auth-popup__input-box auth-popup__input-box--half">
                  <input
                    type="text"
                    placeholder="Tên"
                    name="lastName"
                    value={registerData.lastName}
                    onChange={handleRegisterChange}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="auth-popup__input-box">
                <input
                  type="email"
                  placeholder="Email"
                  name="email"
                  value={registerData.email}
                  onChange={handleRegisterChange}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="auth-popup__input-row">
                <div className="auth-popup__input-box auth-popup__input-box--half">
                  <input
                    type="password"
                    placeholder="Mật khẩu"
                    name="password"
                    value={registerData.password}
                    onChange={handleRegisterChange}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="auth-popup__input-box auth-popup__input-box--half">
                  <input
                    type="password"
                    placeholder="Nhập lại mật khẩu"
                    name="confirmPassword"
                    value={registerData.confirmPassword}
                    onChange={handleRegisterChange}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="auth-popup__input-box">
                <select
                  name="role"
                  value={registerData.role || ""}
                  onChange={handleRegisterChange}
                  required
                  className="auth-popup__select"
                  disabled={isLoading}
                >
                  <option value="" disabled>
                    Chọn vai trò
                  </option>
                  <option value="USER">Người tìm việc</option>
                  <option value="EMPLOYER_OWNER">Nhà tuyển dụng</option>
                </select>
              </div>

              <button
                type="submit"
                className={`auth-popup__btn ${
                  isLoading ? "auth-popup__btn--loading" : ""
                }`}
                disabled={isLoading}
              >
                {isLoading ? "Đang xử lý..." : "Đăng Ký"}
              </button>
            </form>
          </div>

          {/* Phần chuyển đổi */}
          <div className="auth-popup__toggle-box">
            <div className="auth-popup__toggle-panel auth-popup__toggle-panel--left">
              <h1>Welcome!</h1>
              <p>Bạn chưa có tài khoản?</p>
              <button
                className="auth-popup__btn auth-popup__btn--transparent"
                onClick={() => setIsActive(true)}
                disabled={isLoading}
              >
                Đăng Ký
              </button>
            </div>

            <div className="auth-popup__toggle-panel auth-popup__toggle-panel--right">
              <h1>Welcome!</h1>
              <p>Bạn đã có tài khoản?</p>
              <button
                className="auth-popup__btn auth-popup__btn--transparent"
                onClick={() => setIsActive(false)}
                disabled={isLoading}
              >
                Đăng Nhập
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPopup;
