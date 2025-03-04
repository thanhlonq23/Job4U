import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Spinner, Modal } from "reactstrap";
import "../../../components/modal/modal.css";
import {
  createSkillService,
  getAllSkillService,
  UpdateSkillService,
} from "../../../service/SkillService";

const AddSkill = () => {
  // *** State Management ***
  const [isActionADD, setIsActionADD] = useState(true); // Xác định là thêm mới hay cập nhật
  const [isLoading, setIsLoading] = useState(false); // Quản lý trạng thái tải
  const { id } = useParams(); // Lấy id từ URL để xác định chế độ chỉnh sửa

  // Quản lý giá trị các input
  const [inputValues, setInputValues] = useState({
    skillName: "",
  });

  // *** Fetching Data ***
  useEffect(() => {
    if (id) {
      const fetchDetailSkill = async () => {
        setIsActionADD(false); // Chuyển chế độ sang cập nhật
        try {
          const skill = await getAllSkillService(id);
          if (skill && skill.errCode === 0) {
            setInputValues({
              skillName: skill.data.skillName,
            });
          }
        } catch (error) {
          console.error("Error fetching job level details:", error);
        }
      };
      fetchDetailSkill();
    }
  }, [id]);

  // *** Event Handlers ***
  // Xử lý thay đổi trong các input
  const handleOnChange = (event) => {
    const { name, value } = event.target;
    setInputValues((prev) => ({ ...prev, [name]: value }));
  };

  // Lưu cấp bậc mới hoặc cập nhật cấp bậc
  const handleSaveSkill = async () => {
    setIsLoading(true); // Hiển thị trạng thái tải
    const payload = {
      skillName: inputValues.skillName,
    };

    try {
      let response;
      if (isActionADD) {
        response = await createSkillService(payload); // Thêm mới cấp bậc
      } else {
        response = await UpdateSkillService(payload, id); // Cập nhật cấp bậc
      }

      setIsLoading(false); // Tắt trạng thái tải

      // Xử lý kết quả trả về
      if (response && response.errCode === 0) {
        toast.success(
          isActionADD
            ? "Thêm cấp bậc thành công"
            : "Cập nhật cấp bậc thành công"
        );

        if (isActionADD) {
          // Đặt lại giá trị input sau khi thêm thành công
          setInputValues({
            skillName: "",
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

  // *** Render UI ***
  return (
    <div className="add-job-level">
      <div className="col-12 grid-margin">
        <div className="card">
          <div className="card-body">
            <h4 className="card-title">
              {isActionADD ? "Thêm mới cấp bậc" : "Cập nhật cấp bậc"}
            </h4>
            <form className="form-sample">
              {/* Input tên cấp bậc */}
              <div className="form-group row">
                <label className="col-sm-3 col-form-label">Tên cấp bậc</label>
                <div className="col-sm-9">
                  <input
                    type="text"
                    value={inputValues.skillName}
                    name="skillName"
                    onChange={handleOnChange}
                    className="form-control"
                  />
                </div>
              </div>

              {/* Button lưu */}
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSaveSkill}
              >
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

export default AddSkill;
