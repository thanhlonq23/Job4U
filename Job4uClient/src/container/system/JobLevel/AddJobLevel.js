import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Spinner, Modal } from "reactstrap";
import "../../../components/modal/modal.css";
import {
  createJobLevelService,
  getJobLevelByIdService,
  updateJobLevelService,
} from "../../../service/JobLevelService";

const AddJobLevel = () => {
  // *** State Management ***
  const [isActionADD, setIsActionADD] = useState(true); // Xác định là thêm mới hay cập nhật
  const [isLoading, setIsLoading] = useState(false); // Quản lý trạng thái tải
  const { id } = useParams(); // Lấy id từ URL để xác định chế độ chỉnh sửa
  const [dataReady, setDataReady] = useState(false); // Đánh dấu dữ liệu đã tải xong

  // Quản lý giá trị các input
  const [inputValues, setInputValues] = useState({
    name: "",
  });

  // *** Fetching Data ***
  useEffect(() => {
    if (id) {
      const fetchDetailJobLevel = async () => {
        setIsActionADD(false); // Chuyển chế độ sang cập nhật
        try {
          setIsLoading(true);
          const response = await getJobLevelByIdService(id);
          if (response?.status === "SUCCESS") {
            setInputValues({
              name: response.data.name || "",
            });
          } else {
            toast.error(response?.errMessage || "Lỗi khi tải dữ liệu!");
          }
        } catch (error) {
          toast.error("Không thể tải dữ liệu!");
          console.error("Error fetching job level details:", error);
        } finally {
          setDataReady(true); // Đánh dấu dữ liệu đã tải xong
          setIsLoading(false); // Tắt trạng thái tải
        }
      };
      fetchDetailJobLevel();
    } else {
      setDataReady(true); // Nếu không có ID, đánh dấu dữ liệu đã sẵn sàng
    }
  }, [id]);

  // *** Event Handlers ***
  // Xử lý thay đổi trong các input
  const handleOnChange = (event) => {
    const { name, value } = event.target;
    setInputValues((prev) => ({ ...prev, [name]: value }));
  };

  // Lưu cấp bậc mới hoặc cập nhật cấp bậc
  const handleSaveJobLevel = async () => {
    setIsLoading(true); // Hiển thị trạng thái tải

    const payload = {
      name: inputValues.name,
    };

    try {
      let response;

      if (isActionADD) {
        response = await createJobLevelService(payload); // Thêm mới cấp bậc
      } else {
        response = await updateJobLevelService(payload, id); // Cập nhật cấp bậc
      }

      if (response?.status === "SUCCESS") {
        toast.success(
          isActionADD
            ? "Thêm cấp bậc thành công!"
            : "Cập nhật cấp bậc thành công!"
        );

        if (isActionADD) {
          // Đặt lại giá trị input sau khi thêm thành công
          setInputValues({
            name: "",
          });
        }
      } else {
        toast.error(response?.errMessage || "Đã xảy ra lỗi!");
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi gửi dữ liệu!");
      console.error("Error saving job level:", error);
    } finally {
      setIsLoading(false); // Tắt trạng thái tải
    }
  };

  // *** Render UI ***
  return (
    <div className="add-job-level">
      <div className="col-12 grid-margin">
        <div className="card">
          <div className="card-body">
            <h4 className="card-title">
              {isActionADD ? "THÊM MỚI CẤP BẬC" : "CẬP NHẬT CẤP BẬC"}
            </h4>
            <form className="form-sample">
              {/* Input tên cấp bậc */}
              <div className="form-group row">
                <label className="col-sm-2 col-form-label">Tên cấp bậc</label>
                <div className="col-sm-9">
                  <input
                    type="text"
                    value={dataReady ? inputValues.name : ""}
                    name="name"
                    onChange={handleOnChange}
                    className="form-control"
                    placeholder="Nhập tên cấp bậc"
                    disabled={!dataReady || isLoading}
                  />
                </div>
              </div>

              {/* Button lưu */}
              <button
                type="button"
                className="btn btn-primary mr-2"
                onClick={handleSaveJobLevel}
                style={{ marginLeft: "90%" }}
                disabled={isLoading}
              >
                <i className="ti-file btn1-icon-prepend"></i>
                {isLoading ? "Đang lưu..." : "Lưu"}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Hiển thị trạng thái loading */}
      {isLoading && (
        <Modal isOpen centered>
          <div className="spinner-container">
            <Spinner />
          </div>
        </Modal>
      )}

      {/* ToastContainer để hiển thị thông báo */}
      <ToastContainer />
    </div>
  );
};

export default AddJobLevel;
