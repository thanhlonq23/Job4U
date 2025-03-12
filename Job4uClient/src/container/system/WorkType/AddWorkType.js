import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { Spinner, Modal } from "reactstrap";
import "../../../components/modal/modal.css";
import {
  getWorkTypeByIdService,
  UpdateWorkTypeService,
  createWorkTypeService,
} from "../../../service/WorkTypeService";

const AddWorkType = () => {
  // *** State Management ***
  const [isActionADD, setIsActionADD] = useState(true); // Xác định là thêm mới hay cập nhật
  const [isLoading, setIsLoading] = useState(false); // Quản lý trạng thái tải
  const { id } = useParams(); // Lấy id từ URL để xác định chế độ chỉnh sửa
  const [dataReady, setDataReady] = useState(false); // Đánh dấu dữ liệu đã tải

  // Quản lý giá trị các input
  const [inputValues, setInputValues] = useState({
    name: "",
  });

  // *** Fetching Data ***
  useEffect(() => {
    if (id) {
      const fetchDetailWorkType = async () => {
        setIsActionADD(false); // Chuyển chế độ sang cập nhật
        try {
          const response = await getWorkTypeByIdService(id);
          if (response?.status === "SUCCESS") {
            setInputValues({
              name: response.data.name || "",
            });
          } else {
            toast.error(response?.errMessage || "Lỗi khi tải dữ liệu!");
          }
        } catch (error) {
          toast.error("Không thể tải dữ liệu!");
          console.error("Error fetching work type details:", error);
        } finally {
          setDataReady(true); // Đánh dấu dữ liệu đã tải xong
        }
      };
      fetchDetailWorkType();
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

  // Lưu hình thức làm việc mới hoặc cập nhật hình thức làm việc
  const handleSaveWorkType = async () => {
    setIsLoading(true); // Hiển thị trạng thái tải

    const payload = {
      name: inputValues.name,
    };

    try {
      let response;

      if (isActionADD) {
        response = await createWorkTypeService(payload); // Thêm mới hình thức làm việc
      } else {
        response = await UpdateWorkTypeService(payload, id); // Cập nhật hình thức làm việc
      }

      setIsLoading(false); // Tắt trạng thái tải

      // Xử lý kết quả trả về
      if (response && response.errCode === 0) {
        toast.success(
          isActionADD
            ? "Thêm hình thức làm việc thành công!"
            : "Cập nhật hình thức làm việc thành công!"
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
      setIsLoading(false);
      toast.error("Đã xảy ra lỗi khi gửi dữ liệu!");
      console.error("Error saving work type:", error);
    }
  };

  // *** Render UI ***
  return (
    <div className="add-work-type">
      <div className="col-12 grid-margin">
        <div className="card">
          <div className="card-body">
            <h4 className="card-title">
              {isActionADD
                ? "THÊM MỚI HÌNH THỨC LÀM VIỆC"
                : "CẬP NHẬT HÌNH THỨC LÀM VIỆC"}
            </h4>
            <form className="form-sample">
              {/* Input tên hình thức làm việc */}
              <div className="form-group row">
                <label className="col-sm-2 col-form-label">
                  Tên hình thức làm việc
                </label>
                <div className="col-sm-9">
                  <input
                    type="text"
                    value={dataReady ? inputValues.name : ""}
                    name="name"
                    onChange={handleOnChange}
                    className="form-control"
                    placeholder="Nhập tên hình thức làm việc"
                  />
                </div>
              </div>

              {/* Button lưu */}
              <button
                type="button"
                className="btn btn-primary mr-2"
                onClick={handleSaveWorkType}
                style={{ marginLeft: "90%" }}
              >
                <i className="ti-file btn1-icon-prepend"></i>
                Lưu
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
    </div>
  );
};

export default AddWorkType;
