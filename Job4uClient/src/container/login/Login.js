import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import { handleLoginService } from "../../service/AuthService";
import { toast } from "react-toastify";

const Login = () => {
  const [inputValues, setInputValues] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      // Nếu token tồn tại, chuyển hướng người dùng tới trang chính
      window.location.href = "/";
    }
  }, []);

  const handleOnChange = (event) => {
    const { name, value } = event.target;
    setInputValues({ ...inputValues, [name]: value });
  };

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      let response = await handleLoginService({
        email: inputValues.email,
        password: inputValues.password,
      });

      if (response && response.data) {
        const user = response.data;
        localStorage.setItem("authToken", user.token);
        localStorage.setItem(
          "userInfo",
          JSON.stringify({
            userId: user.userId,
            email: user.email,
            fullName: user.fullName,
            role: user.role,
          })
        );

        if (
          user.role === "ADMIN" ||
          user.role === "EMPLOYER_OWNER" ||
          user.role === "EMPLOYER_STAFF"
        ) {
          window.location.href = "/admin/";
        } else {
          window.location.href = "/";
        }
      } else {
        toast.error(response.errMessage || "Đăng nhập thất bại!");
      }
    } catch (error) {
      toast.error("Không thể kết nối đến máy chủ. Vui lòng thử lại sau!");
      console.error("Error during login:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="container-scroller">
        <div className="container-fluid page-body-wrapper full-page-wrapper">
          <div className="content-wrapper d-flex align-items-center auth px-0">
            <div className="row w-100 mx-0">
              <div className="col-lg-4 mx-auto">
                <div className="auth-form-light text-left py-5 px-4 px-sm-5">
                  <div className="brand-logo">
                    <img src="/assets/img/logo/logo.png" alt="logo" />
                  </div>
                  <h4>Chào bạn! Tham gia ứng tuyển ngay</h4>
                  <h6 className="font-weight-light">Đăng nhập để tiếp tục.</h6>
                  <form className="pt-3">
                    <div className="form-group">
                      <input
                        type="email"
                        value={inputValues.email}
                        name="email"
                        onChange={(event) => handleOnChange(event)}
                        className="form-control form-control-lg"
                        id="exampleInputEmail1"
                        placeholder="Email"
                      />
                    </div>
                    <div className="form-group">
                      <input
                        type="password"
                        value={inputValues.password}
                        name="password"
                        onChange={(event) => handleOnChange(event)}
                        className="form-control form-control-lg"
                        id="exampleInputPassword1"
                        placeholder="Mật khẩu"
                      />
                    </div>
                    <div className="mt-3">
                      <a
                        onClick={() => !isLoading && handleLogin()}
                        className={`btn1 btn1-block btn1-primary1 btn1-lg font-weight-medium auth-form-btn1 ${
                          isLoading ? "disabled" : ""
                        }`}
                      >
                        {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
                      </a>
                    </div>
                    <div className="my-2 d-flex justify-content-between align-items-center">
                      <div className="form-check">
                        <label className="form-check-label text-muted">
                          <input type="checkbox" className="form-check-input" />
                          Ghi nhớ số điện thoại
                        </label>
                      </div>
                      <Link
                        to="/forget-password"
                        className="auth-link text-black"
                        style={{ color: "blue" }}
                      >
                        Quên mật khẩu?
                      </Link>
                    </div>

                    <div className="text-center mt-4 font-weight-light">
                      Không có tài khoản?{" "}
                      <Link to="/register" className="text-primary">
                        Tạo ngay
                      </Link>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
