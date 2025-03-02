import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import CommonUtils from "../../../util/CommonUtils";
import { Spinner, Modal } from "reactstrap";
import "../../../components/modal/modal.css";
import "./AddJobType.scss";

import {
  getDetailAllcodeById,
  UpdateAllcodeService,
} from "../../../service/userService";
import {
  UpdateCategoryService,
  createCategoryService,
} from "../../../service/CategoriesService";

const AddJobType = () => {
  // *** State Management ***
  const [isActionADD, setIsActionADD] = useState(true); // Xác định là thêm mới hay cập nhật
  const [isLoading, setIsLoading] = useState(false); // Quản lý trạng thái tải
  const { id } = useParams(); // Lấy id từ URL để xác định chế độ chỉnh sửa

  // Quản lý giá trị các input
  const [inputValues, setInputValues] = useState({
    categoryName: "",
    image: "",
    imageReview: "",
    isOpen: false,
  });

  // *** Fetching Data ***
  useEffect(() => {
    if (id) {
      const fetchDetailJobType = async () => {
        setIsActionADD(false); // Chuyển chế độ sang cập nhật
        try {
          const response = await getDetailAllcodeById(id); // Lấy thông tin chi tiết loại công việc
          if (response && response.errCode === 0) {
            setInputValues({
              categoryName: response.data.value,
              image: response.data.image,
              imageReview: response.data.image,
              isOpen: false,
            });
          }
        } catch (error) {
          console.error("Error fetching job type details:", error);
        }
      };
      fetchDetailJobType();
    }
  }, [id]);

  // *** Event Handlers ***
  // Xử lý thay đổi trong các input
  const handleOnChange = (event) => {
    const { name, value } = event.target;
    setInputValues((prev) => ({ ...prev, [name]: value }));
  };

  // Xử lý thay đổi hình ảnh
  const handleOnChangeImage = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const base64 = await CommonUtils.getBase64(file);
      const objectUrl = URL.createObjectURL(file);
      setInputValues((prev) => ({
        ...prev,
        image: base64,
        imageReview: objectUrl,
      }));
    }
  };

  // Mở preview hình ảnh
  const openPreviewImage = () => {
    if (inputValues.imageReview) {
      setInputValues((prev) => ({ ...prev, isOpen: true }));
    }
  };

  // Lưu loại công việc mới hoặc cập nhật loại công việc
  const handleSaveJobType = async () => {
    setIsLoading(true); // Hiển thị trạng thái tải

    const payload = {
      categoryName: inputValues.categoryName,
      image: inputValues.image,
    };

    try {
      let response;

      if (isActionADD) {
        response = await createCategoryService(payload); // Thêm mới loại công việc
      } else {
        response = await UpdateCategoryService(payload, id); // Cập nhật loại công việc
      }

      setIsLoading(false); // Tắt trạng thái tải

      // Xử lý kết quả trả về
      if (response && response.errCode === 0) {
        toast.success(
          isActionADD
            ? "Thêm loại công việc thành công"
            : "Cập nhật loại công việc thành công"
        );

        if (isActionADD) {
          // Đặt lại giá trị input sau khi thêm thành công
          setInputValues({
            categoryName: "",
            image: "",
            imageReview: "",
            isOpen: false,
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
    <div className="add-job-type">
      <div className="col-12 grid-margin">
        <div className="card">
          <div className="card-body">
            <h4 className="card-title">
              {isActionADD
                ? "Thêm mới loại công việc"
                : "Cập nhật loại công việc"}
            </h4>
            <form className="form-sample">
              {/* Input tên loại công việc */}
              <div className="form-group row">
                <label className="col-sm-3 col-form-label">
                  Tên loại công việc
                </label>
                <div className="col-sm-9">
                  <input
                    type="text"
                    value={inputValues.categoryName}
                    name="categoryName"
                    onChange={handleOnChange}
                    className="form-control"
                  />
                </div>
              </div>

              {/* Input hình ảnh */}
              <div className="form-group row">
                <label className="col-sm-3 col-form-label">Hình ảnh</label>
                <div className="col-sm-9">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleOnChangeImage}
                    className="form-control"
                  />
                </div>
              </div>

              {/* Preview hình ảnh */}
              <div className="form-group row">
                <label className="col-sm-3 col-form-label">Preview</label>
                <div className="col-sm-9">
                  <div
                    className="box-img-preview"
                    style={{
                      backgroundImage: `url(${inputValues.imageReview})`,
                    }}
                    onClick={openPreviewImage}
                  ></div>
                </div>
              </div>

              {/* Button lưu */}
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSaveJobType}
              >
                Lưu
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Hiển thị preview hình ảnh */}
      {inputValues.isOpen && (
        <Lightbox
          mainSrc={inputValues.imageReview}
          onCloseRequest={() =>
            setInputValues((prev) => ({ ...prev, isOpen: false }))
          }
        />
      )}

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

export default AddJobType;
