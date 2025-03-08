import React from "react";
import { Link } from "react-router-dom";

const ForgetPassword = () => {
  return (
    <div className="container-scroller">
      <div className="container-fluid page-body-wrapper full-page-wrapper">
        <div className="content-wrapper d-flex align-items-center auth px-0">
          <div className="row w-100 mx-0">
            <div className="col-lg-4 mx-auto">
              <div className="auth-form-light text-left py-5 px-4 px-sm-5">
                <div className="brand-logo">
                  <img src="/assets/img/logo/logo.png" alt="logo" />
                </div>
                <h4>Quên mật khẩu?</h4>
                <h6 className="font-weight-light">
                  Đừng lo! Khôi phục trong vài giây
                </h6>
                <form className="pt-3">
                  <div className="form-group">
                    <input
                      type="number"
                      className="form-control form-control-lg"
                      placeholder="Số điện thoại"
                    />
                  </div>
                  <div className="mt-3">
                    <button
                      type="button"
                      className="btn1 btn1-block btn1-primary1 btn1-lg font-weight-medium auth-form-btn1"
                    >
                      Xác nhận
                    </button>
                  </div>
                  <div className="text-center mt-4 font-weight-light">
                    Chưa có tài khoản?{" "}
                    <Link to="/register" className="text-primary">
                      Đăng ký
                    </Link>
                    <br />
                    <br />
                    Đã có tài khoản?{" "}
                    <Link to="/login" className="text-primary">
                      Đăng nhập
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
