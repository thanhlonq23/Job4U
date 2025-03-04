import React from "react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { Spinner, Modal } from "reactstrap";
import "../../../components/modal/modal.css";
import {
  getAllWorkTypeService,
  UpdateWorkTypeService,
  createWorkTypeService,
} from "../../../service/WorkTypeService";
const AddWorkType = () => {
  // *** State Management ***
  const [isActionADD, setIsActionADD] = useState(true); // Xác định là thêm mới hay cập nhật
  const [isLoading, setIsLoading] = useState(false); // Quản lý trạng thái tải
  const { id } = useParams(); // Lấy id từ URL để xác định chế độ chỉnh sửa

  // Quản lý giá trị các input
  const [inputValues, setInputValues] = useState({
    workType_name: "",
  });

  // *** Fetching Data ***
  useEffect(() => {
    if (id) {
      const fetchDetailWorkType = async () => {
        setIsActionADD(false); // Chuyển chế độ sang cập nhật
        try {
          const joblevel = await getAllWorkTypeService(id);
          if (joblevel && joblevel.errCode === 0) {
            setInputValues({
              workType_name: joblevel.data.workType_name,
            });
          }
        } catch (error) {
          console.error("Error fetching work type details:", error);
        }
      };
      fetchDetailWorkType();
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
      workType_name: inputValues.workType_name,
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
            ? "Thêm hình thức làm việc thành công"
            : "Cập nhật hình thức làm việc thành công"
        );

        if (isActionADD) {
          // Đặt lại giá trị input sau khi thêm thành công
          setInputValues({
            workType_name: "",
          });
        }
      } else {
        toast.error(response?.errMessage || "Đã xảy ra lỗi!");
      }
    } catch (error) {
      setIsLoading(false);
      toast.error("Đã xảy ra lỗi khi gửi dữ liệu!");
      console.error(error);
    }
  };

  return (
    <div className="">
      <div className="col-12 grid-margin">
        <div className="card">
          <div className="card-body">
            <h4 className="card-title">
              {isActionADD === true
                ? "Thêm mới hình thức làm việc"
                : "Cập nhật hình thức làm việc"}
            </h4>
            <br></br>
            <form className="form-sample">
              <div className="row">
                <div className="col-md-8">
                  <div className="form-group row">
                    <label className="col-sm-3 col-form-label">
                      Tên hình thức làm việc
                    </label>
                    <div className="col-sm-9">
                      <input
                        type="text"
                        value={inputValues.workType_name}
                        name="workType_name"
                        onChange={(event) => handleOnChange(event)}
                        className="form-control"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <button
                type="button"
                className="btn1 btn1-primary1 btn1-icon-text"
                onClick={() => handleSaveWorkType()}
              >
                <i class="ti-file btn1-icon-prepend"></i>
                Lưu
              </button>
            </form>
          </div>
        </div>
      </div>
      {isLoading && (
        <Modal isOpen="true" centered contentClassName="closeBorder">
          <div
            style={{
              position: "absolute",
              right: "50%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Spinner animation="border"></Spinner>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AddWorkType;
