import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Lightbox from "react-image-lightbox";
import { toast, ToastContainer } from "react-toastify";
import "react-image-lightbox/style.css";
import CommonUtils from "../../../util/CommonUtils";
import { Spinner, Modal, Row, Col, Card, CardBody } from "reactstrap";
import "./AddCompany.scss";
import {
  updateCompanyService,
  createCompanyService,
  getCompanyByIdService,
} from "../../../service/CompanyService";
import MDEditor from "@uiw/react-md-editor";

const AddCompany = () => {
  const { id } = useParams();
  const [isActionAdd, setIsActionAdd] = useState(!id);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValues, setInputValues] = useState({
    name: "",
    thumbnail: "",
    thumbnailReview: "",
    coverImage: "",
    coverImageReview: "",
    description_Markdown: "",
    website: "",
    address: "",
    email: "",
    taxNumber: "",
    isThumbnailOpen: false,
    isCoverOpen: false,
  });

  useEffect(() => {
    if (!id) return;
    const fetchCompanyDetails = async () => {
      try {
        setIsLoading(true);
        const response = await getCompanyByIdService(id);
        if (response?.status === "SUCCESS") {
          const {
            name,
            thumbnail,
            coverImage,
            description_Markdown,
            website,
            address,
            email,
            taxNumber,
          } = response.data;

          setInputValues({
            name: name || "",
            thumbnail: thumbnail || "",
            thumbnailReview: thumbnail || "",
            coverImage: coverImage || "",
            coverImageReview: coverImage || "",
            description_Markdown: description_Markdown || "",
            website: website || "",
            address: address || "",
            email: email || "",
            taxNumber: taxNumber || "",
            isThumbnailOpen: false,
            isCoverOpen: false,
          });
        } else {
          toast.error(response?.message || "Không thể lấy dữ liệu");
        }
      } catch (error) {
        toast.error("Đã xảy ra lỗi khi lấy dữ liệu");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanyDetails();
  }, [id]);

  const handleInputChange = ({ target: { name, value } }) => {
    setInputValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleThumbnailChange = async ({ target: { files } }) => {
    if (files?.[0]) {
      const base64 = await CommonUtils.getBase64(files[0]);
      const objectUrl = URL.createObjectURL(files[0]);
      setInputValues((prev) => ({
        ...prev,
        thumbnail: base64,
        thumbnailReview: objectUrl,
      }));
    }
  };

  const handleCoverChange = async ({ target: { files } }) => {
    if (files?.[0]) {
      const base64 = await CommonUtils.getBase64(files[0]);
      const objectUrl = URL.createObjectURL(files[0]);
      setInputValues((prev) => ({
        ...prev,
        coverImage: base64,
        coverImageReview: objectUrl,
      }));
    }
  };

  // Cập nhật handler cho Markdown Editor mới
  const handleMarkdownChange = (value) => {
    setInputValues((prev) => ({
      ...prev,
      description_Markdown: value || "",
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    const payload = {
      name: inputValues.name,
      thumbnail: inputValues.thumbnail,
      coverImage: inputValues.coverImage,
      description_Markdown: inputValues.description_Markdown,
      website: inputValues.website,
      address: inputValues.address,
      email: inputValues.email,
      taxNumber: inputValues.taxNumber,
    };

    try {
      const response = isActionAdd
        ? await createCompanyService(payload)
        : await updateCompanyService(id, payload);

      if (response?.errCode === 0) {
        toast.success(
          isActionAdd
            ? "Thêm công ty thành công"
            : "Cập nhật công ty thành công"
        );

        if (isActionAdd) {
          setInputValues({
            name: "",
            thumbnail: "",
            thumbnailReview: "",
            coverImage: "",
            coverImageReview: "",
            description_Markdown: "",
            website: "",
            address: "",
            email: "",
            taxNumber: "",
            isThumbnailOpen: false,
            isCoverOpen: false,
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

  const openThumbnailPreview = () => {
    if (inputValues.thumbnailReview) {
      setInputValues((prev) => ({ ...prev, isThumbnailOpen: true }));
    }
  };

  const openCoverPreview = () => {
    if (inputValues.coverImageReview) {
      setInputValues((prev) => ({ ...prev, isCoverOpen: true }));
    }
  };

  return (
    <div className="add-company-container">
      <Row>
        <Col md={12}>
          <Card className="main-card">
            <CardBody>
              <h4 className="card-title">
                {isActionAdd ? "THÊM MỚI CÔNG TY" : "CẬP NHẬT CÔNG TY"}
              </h4>
              <form className="company-form">
                <Row>
                  {/* Phần thông tin cơ bản */}
                  <Col md={6}>
                    <Card className="section-card">
                      <CardBody>
                        <h4 className="section-title">Thông tin cơ bản</h4>
                        <div className="form-group">
                          <label>
                            Tên công ty <span className="required">*</span>
                          </label>
                          <input
                            type="text"
                            value={inputValues.name}
                            name="name"
                            onChange={handleInputChange}
                            className="form-control"
                            placeholder="Nhập tên công ty"
                          />
                        </div>

                        <div className="form-group">
                          <label>Website</label>
                          <input
                            type="text"
                            value={inputValues.website}
                            name="website"
                            onChange={handleInputChange}
                            className="form-control"
                            placeholder="https://example.com"
                          />
                        </div>

                        <div className="form-group">
                          <label>
                            Email <span className="required">*</span>
                          </label>
                          <input
                            type="email"
                            value={inputValues.email}
                            name="email"
                            onChange={handleInputChange}
                            className="form-control"
                            placeholder="contact@example.com"
                          />
                        </div>

                        <div className="form-group">
                          <label>Địa chỉ</label>
                          <input
                            type="text"
                            value={inputValues.address}
                            name="address"
                            onChange={handleInputChange}
                            className="form-control"
                            placeholder="Địa chỉ công ty"
                          />
                        </div>

                        <div className="form-group">
                          <label>Mã số thuế</label>
                          <input
                            type="text"
                            value={inputValues.taxNumber}
                            name="taxNumber"
                            onChange={handleInputChange}
                            className="form-control"
                            placeholder="VD: 0123456789"
                          />
                        </div>
                      </CardBody>
                    </Card>
                  </Col>

                  {/* Phần hình ảnh */}
                  <Col md={6}>
                    <Card className="section-card">
                      <CardBody>
                        <h4 className="section-title">Hình ảnh</h4>

                        <div className="form-group">
                          <label>
                            Logo công ty <span className="required">*</span>
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleThumbnailChange}
                            className="form-control"
                          />
                          {inputValues.thumbnailReview && (
                            <div className="preview-container mt-2">
                              <div
                                className="thumbnail-preview"
                                style={{
                                  backgroundImage: `url(${inputValues.thumbnailReview})`,
                                }}
                                onClick={openThumbnailPreview}
                              >
                                <div className="preview-overlay">
                                  <span>Xem</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="form-group">
                          <label>Ảnh bìa</label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleCoverChange}
                            className="form-control"
                          />
                          {inputValues.coverImageReview && (
                            <div className="preview-container mt-2">
                              <div
                                className="cover-preview"
                                style={{
                                  backgroundImage: `url(${inputValues.coverImageReview})`,
                                }}
                                onClick={openCoverPreview}
                              >
                                <div className="preview-overlay">
                                  <span>Xem</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </CardBody>
                    </Card>
                  </Col>

                  <Col md={12}>
                    <Card className="section-card mt-4">
                      <CardBody>
                        <h4 className="section-title">Mô tả công ty</h4>
                        <div className="markdown-editor-container">
                          <MDEditor
                            value={inputValues.description_Markdown}
                            onChange={handleMarkdownChange}
                            height={400}
                            preview="edit"
                            previewOptions={{
                              style: { padding: "20px" },
                            }}
                          />
                        </div>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>

                {/* Nút lưu */}
                <div className="form-actions">
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={() => window.history.back()}
                  >
                    <i className="ti-arrow-left"></i> Quay lại
                  </button>
                  <button
                    type="button"
                    className="btn-save"
                    onClick={handleSave}
                  >
                    <i className="ti-save"></i>{" "}
                    {isActionAdd ? "Thêm mới" : "Cập nhật"}
                  </button>
                </div>
              </form>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Lightbox cho thumbnail */}
      {inputValues.isThumbnailOpen && (
        <Lightbox
          mainSrc={inputValues.thumbnailReview}
          onCloseRequest={() =>
            setInputValues((prev) => ({ ...prev, isThumbnailOpen: false }))
          }
        />
      )}

      {/* Lightbox cho cover */}
      {inputValues.isCoverOpen && (
        <Lightbox
          mainSrc={inputValues.coverImageReview}
          onCloseRequest={() =>
            setInputValues((prev) => ({ ...prev, isCoverOpen: false }))
          }
        />
      )}

      {/* Modal loading */}
      {isLoading && (
        <Modal isOpen centered className="loading-modal">
          <div className="spinner-container">
            <Spinner color="primary" />
            <p className="mt-2">Đang xử lý...</p>
          </div>
        </Modal>
      )}

      {/* ToastContainer để hiển thị thông báo */}
      <ToastContainer />
    </div>
  );
};

export default AddCompany;
