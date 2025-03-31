import React, { useState, useEffect } from "react";
import {
  handleLoginService,
  handleRegisterService,
  sendOTPService,
  verifyOTPService,
} from "../../service/AuthService";
import { toast } from "react-toastify";
import "./AuthPopup.scss";
import { getCompanyIdByIdService } from "../../service/UserService";

const AuthPopup = ({ isOpen, onClose }) => {
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showOTPPopup, setShowOTPPopup] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpTimer, setOtpTimer] = useState(60);
  const [otpAttempts, setOtpAttempts] = useState(0);
  const [otpExpired, setOtpExpired] = useState(false);
  const [otpLocked, setOtpLocked] = useState(false);

  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  // Kiểm tra trạng thái đăng nhập khi component mount
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("authToken");
      if (token && isOpen) onClose();
    };
    checkAuth();
  }, [isOpen]);

  // Reset form khi đóng popup
  useEffect(() => {
    if (!isOpen) resetAll();
  }, [isOpen]);

  // Đếm ngược thời gian OTP
  useEffect(() => {
    let timer;
    if (showOTPPopup && otpTimer > 0) {
      timer = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    } else if (otpTimer === 0) {
      setOtpExpired(true);
      setShowOTPPopup(false);
      toast.error("Mã OTP đã hết hạn!");
    }
    return () => clearInterval(timer);
  }, [showOTPPopup, otpTimer]);

  const resetAll = () => {
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
    setShowOTPPopup(false);
    setOtp("");
    setOtpTimer(60);
    setOtpAttempts(0);
    setOtpExpired(false);
    setOtpLocked(false);
    setIsLoading(false);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await handleLoginService({
        email: loginData.email,
        password: loginData.password,
      });

      if (!response?.data) {
        toast.error(response?.message || "Đăng nhập thất bại!");
        return;
      }

      const user = response.data;
      localStorage.setItem("authToken", user.token);

      const userInfo = {
        userId: user.userId,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      };

      const redirectPath = ["ADMIN", "EMPLOYER_OWNER", "EMPLOYER_STAFF"].includes(user.role)
        ? "/admin/"
        : "/";

      if (["EMPLOYER_STAFF", "EMPLOYER_OWNER"].includes(user.role)) {
        try {
          const companyResponse = await getCompanyIdByIdService(user.userId);
          userInfo.companyId = companyResponse.data;
        } catch (error) {
          console.error("Error fetching company ID:", error);
        }
      }

      localStorage.setItem("userInfo", JSON.stringify(userInfo));
      toast.success("Đăng nhập thành công!");
      onClose();

      setTimeout(() => {
        window.location.href = redirectPath;
      }, 100);
    } catch (error) {
      toast.error("Đăng nhập thất bại!");
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
      const otpResponse = await sendOTPService(registerData.email);
      console.log("OTP Response:", otpResponse); // Debug response

      if (otpResponse.status === "SUCCESS") {
        setShowOTPPopup(true);
        toast.success("Mã OTP đã được gửi đến email của bạn!");
      } else {
        toast.error(otpResponse.message || "Không thể gửi OTP!");
      }
    } catch (error) {
      toast.error("Không thể kết nối đến máy chủ!");
      console.error("Error sending OTP:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const verifyResponse = await verifyOTPService(registerData.email, otp);
      console.log("Verify OTP Response:", verifyResponse); // Debug response

      if (verifyResponse.status === "SUCCESS") {
        const registerPayload = {
          firstName: registerData.firstName,
          lastName: registerData.lastName,
          email: registerData.email,
          password: registerData.password,
          employer: registerData.role === "EMPLOYER_OWNER",
        };

        const response = await handleRegisterService(registerPayload);
        if (response && response.data) {
          toast.success("Đăng ký thành công! Vui lòng đăng nhập.");
          setIsActive(false);
          resetAll();
        } else {
          toast.error(response.message || "Đăng ký thất bại!");
        }
      } else {
        setOtpAttempts((prev) => prev + 1);
        if (otpAttempts >= 3) {
          setOtpLocked(true);
          toast.error("Bạn đã nhập sai quá số lần cho phép!");
        } else {
          toast.error(verifyResponse.message || "Mã OTP không đúng!");
        }
      }
    } catch (error) {
      toast.error("Không thể kết nối đến máy chủ!");
      console.error("Error verifying OTP:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData({ ...registerData, [name]: value });
  };

  const handleOTPChange = (e) => setOtp(e.target.value);

  const handlePopupClick = (e) => e.stopPropagation();

  if (!isOpen) return null;

  return (
    <div className="auth-popup__overlay" onClick={onClose}>
      <div className="auth-popup__wrapper" onClick={handlePopupClick}>
        {!showOTPPopup ? (
          <div className={`auth-popup__container ${isActive ? "auth-popup__container--active" : ""}`}>
            <button className="auth-popup__close-btn" onClick={onClose}>×</button>

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
                  className={`auth-popup__btn ${isLoading ? "auth-popup__btn--loading" : ""}`}
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
                  className={`auth-popup__btn ${isLoading ? "auth-popup__btn--loading" : ""}`}
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
        ) : (
          <div className="auth-popup__otp-container">
            <h2>Nhập mã OTP</h2>
            <p>
              Mã OTP đã được gửi đến {registerData.email}. Thời gian còn lại: {otpTimer}s
            </p>
            <form onSubmit={handleOTPSubmit}>
              <div className="auth-popup__input-box">
                <input
                  type="text"
                  placeholder="Nhập mã OTP"
                  value={otp}
                  onChange={handleOTPChange}
                  required
                  disabled={isLoading || otpExpired || otpLocked}
                />
              </div>
              <button
                type="submit"
                className={`auth-popup__btn ${isLoading ? "auth-popup__btn--loading" : ""}`}
                disabled={isLoading || otpExpired || otpLocked}
              >
                {isLoading ? "Đang xử lý..." : "Xác minh"}
              </button>
            </form>
            {otpLocked && (
              <p className="auth-popup__error">
                Tài khoản đã bị khóa do nhập sai quá số lần cho phép!
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthPopup;