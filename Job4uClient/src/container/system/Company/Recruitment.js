import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { inviteStaffService } from "../../../service/InvitationService";

const Recruitment = () => {
  const [inputValues, setInputValues] = useState({
    email: "",
  });
  const [user, setUser] = useState({});

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userData);
  }, []);

  const handleOnChange = (event) => {
    const { name, value } = event.target;
    setInputValues({ ...inputValues, [name]: value });
  };

  const handleSubmit = async () => {
    if (!inputValues.email) {
      toast.error("Vui lòng nhập email!");
      return;
    }

    try {
      const response = await inviteStaffService(user.email, inputValues.email);
      if (response.status === "SUCCESS") {
        toast.success("Lời mời đã được gửi thành công!");
        setInputValues({ ...inputValues, email: "" });
      } else {
        toast.error(response.data.message || "Không thể gửi lời mời!");
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi gửi lời mời!");
      console.error("Error inviting staff:", error);
    }
  };

  return (
    <div className="">
      <div className="col-12 grid-margin">
        <div className="card">
          <div className="card-body">
            <h4 className="card-title">Tuyển dụng nhân viên</h4>
            <br />
            <form className="form-sample">
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group row">
                    <label className="col-sm-3 col-form-label">Email</label>
                    <div className="col-sm-9">
                      <input
                        type="text"
                        value={inputValues.email}
                        name="email"
                        onChange={(event) => handleOnChange(event)}
                        className="form-control"
                        placeholder="Nhập email nhân viên"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleSubmit} // Loại bỏ () để tránh gọi ngay khi render
                type="button"
                className="btn btn-primary mr-2"
              >
                <i className="ti-file btn1-icon-prepend"></i>
                Gửi
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recruitment;
