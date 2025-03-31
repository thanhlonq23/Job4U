import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import CommonUtils from "../../../util/CommonUtils";
import { Spinner, Modal } from "reactstrap";
import "./AddCategory.scss";
import {
  updateCategoryService,
  createCategoryService,
  getCategoryByIdService,
} from "../../../service/CategoriesService";

const AddCategory = () => {
  const { id } = useParams(); // Lấy id từ URL

  // State quản lý
  const [isActionAdd, setIsActionAdd] = useState(!id);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValues, setInputValues] = useState({
    name: "",
    image: "",
    imageReview: "",
    isOpen: false,
  });

  // Lấy thông tin chi tiết nếu chỉnh sửa
  useEffect(() => {
    if (!id) return;
    const fetchCategoryDetails = async () => {
      try {
        const response = await getCategoryByIdService(id);
        if (response?.status === "SUCCESS") {
          const { name, image } = response.data;
          setInputValues({
            name: name || "",
            image: image || "",
            imageReview: image || "",
            isOpen: false,
          });
        } else {
          toast.error(response?.message || "Không thể lấy dữ liệu");
        }
      } catch (error) {
        toast.error("Đã xảy ra lỗi khi lấy dữ liệu");
        console.error(error);
      }
    };

    fetchCategoryDetails();
  }, [id]);

  // Xử lý thay đổi input
  const handleInputChange = ({ target: { name, value } }) => {
    setInputValues((prev) => ({ ...prev, [name]: value }));
  };

  // Xử lý thay đổi hình ảnh
  const handleImageChange = async ({ target: { files } }) => {
    if (files?.[0]) {
      const base64 = await CommonUtils.getBase64(files[0]);
      const objectUrl = URL.createObjectURL(files[0]);
      setInputValues((prev) => ({
        ...prev,
        image: base64,
        imageReview: objectUrl,
      }));
    }
  };

  // Lưu dữ liệu
  const handleSave = async () => {
    setIsLoading(true);
    const payload = {
      name: inputValues.name,
      image: inputValues.image,
    };

    try {
      const response = isActionAdd
        ? await createCategoryService(payload)
        : await updateCategoryService(payload, id);

      if (response?.status === "SUCCESS") {
        toast.success(
          isActionAdd
            ? "Thêm loại công việc thành công"
            : "Cập nhật loại công việc thành công"
        );

        if (isActionAdd) {
          setInputValues({
            name: "",
            image: "",
            imageReview: "",
            isOpen: false,
          });
        }
      } else {
        toast.error(response?.errMessage || "Đã xảy ra lỗi");
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi lưu dữ liệu");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Mở preview hình ảnh
  const openPreviewImage = () => {
    if (inputValues.imageReview) {
      setInputValues((prev) => ({ ...prev, isOpen: true }));
    }
  };

  return (
    <div className="add-job-type">
      <div className="card">
        <div className="card-body">
          <h4 className="card-title">
            {isActionAdd ? "THÊM MỚI CÔNG VIỆC" : "CẬP NHẬT CÔNG VIỆC"}
          </h4>

          <form>
            {/* Input tên loại công việc */}
            <div className="form-group row">
              <label className="col-sm-2 col-form-label">
                Tên loại công việc
              </label>
              <div className="col-sm-9">
                <input
                  type="text"
                  value={inputValues.name}
                  name="name"
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>
            </div>

            {/* Input hình ảnh */}
            <div className="form-group row">
              <label className="col-sm-2 col-form-label">Hình ảnh</label>
              <div className="col-sm-9">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="form-control"
                />
              </div>
            </div>

            {/* Preview hình ảnh */}
            <div className="form-group row">
              <label className="col-sm-2 col-form-label">Preview</label>
              <div className="col-sm-9">
                <div
                  className="box-img-preview"
                  style={{
                    backgroundImage: `url(${inputValues.imageReview})`,
                    width: "50px",
                    height: "50px",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    border: "none",
                  }}
                  onClick={openPreviewImage}
                ></div>
              </div>
            </div>

            {/* Button lưu */}
            <button
              type="button"
              className="btn btn-primary mr-2"
              onClick={handleSave}
              style={{ marginLeft: "90%" }}
            >
              <i className="ti-file btn1-icon-prepend"></i>
              Lưu
            </button>
          </form>
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

export default AddCategory;
