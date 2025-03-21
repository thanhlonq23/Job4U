import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import moment from "moment";
import { getCompanyByIdService } from "../../../service/CompanyService";

const ViewCompanyDetail = () => {
  // **STATE KHỞI TẠO**
  const [company, setCompany] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imgPreview, setImgPreview] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [previewType, setPreviewType] = useState("thumbnail"); // Xác định loại ảnh đang xem (thumbnail/coverImage)

  // Lấy id từ params URL
  const { id } = useParams();

  // **FETCH DỮ LIỆU CHI TIẾT CÔNG TY**
  const fetchCompanyDetail = async () => {
    setIsLoading(true);
    try {
      const response = await getCompanyByIdService(id);
      if (response && response.status === "SUCCESS" && response.data) {
        setCompany(response.data);
      } else {
        toast.error(response?.message || "Không thể tải thông tin công ty!");
      }
    } catch (error) {
      console.error("Lỗi khi fetch dữ liệu chi tiết công ty:", error);
      toast.error("Đã xảy ra lỗi khi tải thông tin chi tiết công ty!");
    } finally {
      setIsLoading(false);
    }
  };

  // **GỌI FETCH DỮ LIỆU LẦN ĐẦU**
  useEffect(() => {
    if (id) {
      fetchCompanyDetail();
    }
  }, [id]);

  // **Kiểm tra và xử lý URL ảnh Base64**
  const getImageUrl = (imageData, defaultImage) => {
    if (!imageData) return defaultImage;

    // Kiểm tra xem ảnh đã là base64 hay chưa
    if (imageData.startsWith("data:image")) {
      return imageData;
    }

    // Kiểm tra xem ảnh có phải là URL không
    if (imageData.startsWith("http")) {
      return imageData;
    }

    // Nếu là chuỗi base64 không có prefix, thêm prefix vào
    return `data:image/jpeg;base64,${imageData}`;
  };

  // **MỞ LIGHTBOX XEM HÌNH ẢNH**
  const openPreviewImage = (url, type) => {
    const imageUrl = getImageUrl(
      url,
      type === "thumbnail" ? "default-image-url.jpg" : "default-cover-image.jpg"
    );
    setImgPreview(imageUrl);
    setPreviewType(type);
    setIsOpen(true);
  };

  // **Hàm chuyển đổi trạng thái sang tiếng Việt và màu tương ứng
  const translateStatus = (status) => {
    if (!status) return { text: "Chưa xác định", color: "#6c757d" };

    const statusMap = {
      PENDING: { text: "Đang chờ duyệt", color: "#ffc107" },
      APPROVED: { text: "Đã duyệt", color: "#28a745" },
      REJECTED: { text: "Đã từ chối", color: "#dc3545" },
      SUSPENDED: { text: "Ngừng hoạt động", color: "#6610f2" },
      BANNED: { text: "Cấm hoạt động", color: "#fd7e14" },
    };

    return statusMap[status] || { text: "Chưa xác định", color: "#6c757d" };
  };

  // **Render trạng thái với màu nền tương ứng
  const renderStatus = (status) => {
    const { text, color } = translateStatus(status);

    return (
      <span
        style={{
          backgroundColor: color,
          color: "#fff",
          padding: "4px 8px",
          borderRadius: "4px",
          fontSize: "0.875rem",
          fontWeight: "500",
          display: "inline-block",
        }}
      >
        {text}
      </span>
    );
  };

  // Format date
  const formatDate = (isoDate) => {
    if (!isoDate) return "N/A";
    return moment(isoDate).format("DD/MM/YYYY HH:mm:ss");
  };

  // **RENDER GIAO DIỆN**
  return (
    <div>
      <div className="col-12 grid-margin">
        <div className="card">
          <div className="card-body">
            <div className="d-flex align-items-center justify-content-between mb-4">
              <h4 className="card-title">Chi tiết công ty</h4>
            </div>

            {isLoading ? (
              <div className="text-center py-5">
                <div className="text-primary spinner-border" role="status">
                  <span className="sr-only">Đang tải...</span>
                </div>
                <p className="mt-2">Đang tải thông tin công ty...</p>
              </div>
            ) : company ? (
              <div className="company-detail">
                {/* Phần ảnh cover và thumbnail */}
                <div className="row mb-4">
                  <div className="col-md-8">
                    <div
                      className="cover-image-container"
                      style={{
                        position: "relative",
                        height: "250px",
                        marginBottom: "20px",
                      }}
                    >
                      <div
                        className="cover-image"
                        style={{
                          backgroundImage: `url(${getImageUrl(
                            company.coverImage,
                            "default-cover-image.jpg"
                          )})`,
                          width: "100%",
                          height: "100%",
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          borderRadius: "8px",
                          cursor: "pointer",
                        }}
                        onClick={() =>
                          openPreviewImage(company.coverImage, "coverImage")
                        }
                      ></div>
                      <div
                        className="image-label"
                        style={{
                          position: "absolute",
                          bottom: "10px",
                          right: "10px",
                          background: "rgba(0,0,0,0.5)",
                          color: "#fff",
                          padding: "5px 10px",
                          borderRadius: "4px",
                        }}
                      >
                        Ảnh bìa
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div
                      className="thumbnail-container"
                      style={{
                        position: "relative",
                        height: "250px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <div
                        className="thumbnail"
                        style={{
                          backgroundImage: `url(${getImageUrl(
                            company.thumbnail,
                            "default-image-url.jpg"
                          )})`,
                          width: "100%",
                          height: "100%",
                          backgroundSize: "contain",
                          backgroundPosition: "center",
                          backgroundRepeat: "no-repeat",
                          borderRadius: "8px",
                          cursor: "pointer",
                          maxWidth: "150px",
                          maxHeight: "150px",
                          minWidth: "150px",
                          minHeight: "50px",
                        }}
                        onClick={() =>
                          openPreviewImage(company.thumbnail, "thumbnail")
                        }
                      ></div>
                      <div
                        className="image-label"
                        style={{
                          position: "absolute",
                          bottom: "10px",
                          right: "10px",
                          background: "rgba(0,0,0,0.5)",
                          color: "#fff",
                          padding: "5px 10px",
                          borderRadius: "4px",
                        }}
                      >
                        Logo
                      </div>
                    </div>
                  </div>
                </div>

                {/* Thông tin chi tiết công ty */}
                <div
                  className="p-4 company-info"
                  style={{ backgroundColor: "#f8f9fa", borderRadius: "8px" }}
                >
                  <div className="row mb-3">
                    <div className="col-md-12">
                      <h2
                        className="company-name"
                        style={{
                          fontWeight: "bold",
                          marginBottom: "20px",
                        }}
                      >
                        {company.name}
                      </h2>
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-3">
                      <p className="text-muted mb-1">Trạng thái:</p>
                      {renderStatus(company.status)}
                    </div>
                    <div className="col-md-3">
                      <p className="text-muted mb-1">Số lượng nhân viên:</p>
                      <p>{company.amountEmployer}</p>
                    </div>
                    <div className="col-md-3">
                      <p className="text-muted mb-1">Mã số thuế:</p>
                      <p>{company.taxNumber || "Chưa cung cấp"}</p>
                    </div>
                    <div className="col-md-3">
                      <p className="text-muted mb-1">Ngày tạo:</p>
                      <p>{formatDate(company.createdAt) || "Chưa cung cấp"}</p>
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-3">
                      <p className="text-muted mb-1">Email:</p>
                      <p>{company.email}</p>
                    </div>
                    <div className="col-md-3">
                      <p className="text-muted mb-1">Website:</p>
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: "#506172",
                        }}
                      >
                        {company.website}
                      </a>
                    </div>
                    <div className="col-md-3">
                      <p className="text-muted mb-1">Địa chỉ:</p>
                      <p>{company.address || "Chưa cung cấp"}</p>
                    </div>
                    <div className="col-md-3">
                      <p className="text-muted mb-1">Cập nhật gần nhất:</p>
                      <p>{formatDate(company.updatedAt) || "Chưa cung cấp"}</p>
                    </div>
                  </div>

                  <div className="row mb-3"></div>

                  <div className="row mt-4">
                    <div className="col-md-12">
                      <div className="description-section">
                        <h5 className="description-title mb-3">
                          Mô tả công ty
                        </h5>

                        {/* Hiển thị mô tả chỉ bằng HTML */}
                        <div
                          className="p-3 description-content"
                          style={{
                            border: "1px solid #dee2e6",
                            borderRadius: "5px",
                            minHeight: "200px",
                            backgroundColor: "#fff",
                          }}
                        >
                          <div
                            dangerouslySetInnerHTML={{
                              __html:
                                company.description_HTML ||
                                "<p>Không có mô tả</p>",
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="alert alert-warning">
                Không tìm thấy thông tin công ty hoặc có lỗi xảy ra.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* LIGHTBOX */}
      {isOpen && (
        <Lightbox
          mainSrc={imgPreview}
          onCloseRequest={() => setIsOpen(false)}
          imageTitle={
            previewType === "thumbnail" ? "Logo công ty" : "Ảnh bìa công ty"
          }
        />
      )}
    </div>
  );
};

export default ViewCompanyDetail;
