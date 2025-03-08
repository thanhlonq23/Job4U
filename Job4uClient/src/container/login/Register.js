import React from "react";
import { Link } from "react-router-dom";

const Register = () => {
  return (
    <div className="container-scroller">
      <div className="container-fluid page-body-wrapper full-page-wrapper">
        <div className="content-wrapper d-flex align-items-center auth px-0">
          <div className="row w-100 mx-0">
            <div className="col-lg-4 mx-auto">
              <div className="auth-form-light text-left py-5 px-4 px-sm-5">
                <div className="brand-logo">
                  <img src="/assetsAdmin/images/logo.svg" alt="logo" />
                </div>
                <h4>New here?</h4>
                <h6 className="font-weight-light">
                  Signing up is easy. It only takes a few steps
                </h6>
                <form className="pt-3">
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      placeholder="Họ"
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      placeholder="Tên"
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="number"
                      className="form-control form-control-lg"
                      placeholder="Số điện thoại"
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="password"
                      className="form-control form-control-lg"
                      placeholder="Password"
                    />
                  </div>
                  <div className="form-group">
                    <select className="form-control">
                      <option value="">Role</option>
                    </select>
                  </div>
                  <div className="mt-3">
                    <button
                      type="button"
                      className="btn1 btn1-block btn1-primary1 btn1-lg font-weight-medium auth-form-btn1"
                    >
                      SIGN UP
                    </button>
                  </div>
                  <div className="text-center mt-4 font-weight-light">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary">
                      Login
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

export default Register;
