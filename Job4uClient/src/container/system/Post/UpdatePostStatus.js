import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Spinner, Modal } from "reactstrap";
import { updatePostStatusService } from "../../../service/PostService";

const UpdatePostStatus = () => {
  // *** State Management ***
  const [isLoading, setIsLoading] = useState(false); // Quản lý trạng thái tải
  const { id } = useParams(); // Lấy id từ URL để xác định bài đăng cần cập nhật
  const [dataReady, setDataReady] = useState(false); // Đánh dấu dữ liệu đã tải xong
  const [inputValues, setInputValues] = useState({
    status: "PENDING", // Giá trị mặc định
  });

  // *** Fetching Data ***
  useEffect(() => {
    if (id) {
      setDataReady(true); // Đánh dấu dữ liệu sẵn sàng nếu có ID
    }
  }, [id]);

  // *** Event Handlers ***
  const handleOnChange = (event) => {
    const { name, value } = event.target;
    setInputValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdatePostStatus = async () => {
    setIsLoading(true); // Hiển thị trạng thái tải
    console.log("Updating Post Status:", { id, status: inputValues.status });

    try {
      const response = await updatePostStatusService({
        id,
        status: inputValues.status,
      });

      console.log("Data:", response);

      if (response?.status === "SUCCESS") {
        toast.success("Cập nhật trạng thái bài đăng thành công!");
      } else {
        toast.error(response?.data?.errMessage || "Đã xảy ra lỗi!");
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi cập nhật trạng thái bài đăng!");
      console.error("Error updating post status:", error);
    } finally {
      setIsLoading(false); // Tắt trạng thái tải
    }
  };

  // *** Render UI ***
  return (
    <div className="update-post-status">
      <div className="col-12 grid-margin">
        <div className="card">
          <div className="card-body">
            <h4 className="card-title">XÉT DUYỆT BÀI ĐĂNG</h4>
            <form className="form-sample">
              {/* Select trạng thái bài đăng */}
              <div className="form-group row">
                <label className="col-sm-2 col-form-label">Trạng thái</label>
                <div className="col-sm-9">
                  <select
                    value={dataReady ? inputValues.status : "PENDING"}
                    name="status"
                    onChange={handleOnChange}
                    className="form-control"
                    disabled={!dataReady || isLoading}
                  >
                    <option value="">Xét duyệt</option>
                    <option value="ACTIVE">Hoạt động</option>
                    {/* <option value="EXPIRED">Hết hạn</option> */}
                    <option value="REJECTED">Từ chối</option>
                  </select>
                </div>
              </div>

              {/* Button lưu */}
              <button
                type="button"
                className="btn btn-primary mr-2"
                onClick={handleUpdatePostStatus}
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
    </div>
  );
};

export default UpdatePostStatus;
