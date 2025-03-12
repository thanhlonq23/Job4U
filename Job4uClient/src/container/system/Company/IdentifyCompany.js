import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

import {
  getCompanyByIdService,
  updateCompanyService,
} from "../../../service/CompanyService";

const IdentifyCompany = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [company, setCompany] = useState(null);
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Danh sách trạng thái
  const statusOptions = [
    { value: "APPROVED", label: "Đã duyệt", color: "#28a745" },
    { value: "PENDING", label: "Đang chờ duyệt", color: "#ffc107" },
    { value: "REJECTED", label: "Từ chối", color: "#dc3545" },
    { value: "SUSPENDED", label: "Tạm ngưng", color: "#fd7e14" },
    { value: "BANNED", label: "Cấm hoạt động", color: "#6610f2" },
  ];

  // Lấy thông tin công ty
  useEffect(() => {
    const fetchCompanyData = async () => {
      setIsLoading(true);
      try {
        const response = await getCompanyByIdService(id);
        if (response && response.status === "SUCCESS") {
          setCompany(response.data);
          setStatus(response.data.status || "");
        } else {
          toast.error("Không thể tải thông tin công ty!");
          navigate("/admin/manage-company");
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin công ty:", error);
        toast.error("Đã xảy ra lỗi khi tải thông tin công ty!");
        navigate("/admin/manage-company");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanyData();
  }, [id, navigate]);

  // Xử lý thay đổi trạng thái
  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  // Xử lý khi gửi form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await updateCompanyService(id, { status });

      if (result && result.status === "SUCCESS") {
        toast.success("Cập nhật trạng thái công ty thành công!");
        // navigate("/admin/list-companies");
      } else {
        toast.error(result?.message || "Cập nhật trạng thái thất bại!");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
      toast.error("Đã xảy ra lỗi khi cập nhật trạng thái công ty!");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Hiển thị màu cho trạng thái hiện tại
  const getStatusBadge = (statusValue) => {
    const statusInfo = statusOptions.find(
      (opt) => opt.value === statusValue
    ) || { label: "Chưa xác định", color: "#6c757d" };

    return (
      <span
        style={{
          backgroundColor: statusInfo.color,
          color: "#fff",
          padding: "4px 8px",
          borderRadius: "4px",
          fontSize: "0.875rem",
          fontWeight: "500",
          display: "inline-block",
        }}
      >
        {statusInfo.label}
      </span>
    );
  };

  // Quay lại trang quản lý
  const handleCancel = () => {
    navigate("/admin/list-companies");
  };

  if (isLoading) {
    return (
      <div className="col-12 grid-margin">
        <div className="card">
          <div className="card-body text-center p-5">
            <h4>Đang tải thông tin công ty...</h4>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="col-12 grid-margin">
      <div className="card">
        <div className="card-body">
          <h4 className="card-title">XÉT DUYỆT CÔNG TY</h4>

          {company && (
            <div className="row mb-4">
              <div className="col-md-6">
                <div className="form-group">
                  <label className="font-weight-bold">Tên công ty:</label>
                  <p className="mb-0">{company.name}</p>
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group">
                  <label className="font-weight-bold">Email:</label>
                  <p className="mb-0">{company.email}</p>
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group">
                  <label className="font-weight-bold">Mã số thuế:</label>
                  <p className="mb-0">{company.taxNumber}</p>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label className="font-weight-bold">Logo:</label>
                  <td
                    style={{
                      width: "15%",
                      textAlign: "center",
                      verticalAlign: "middle",
                    }}
                  >
                    <div
                      className="box-img-preview"
                      style={{
                        backgroundImage: `url(${
                          company.thumbnail || "default-image-url.jpg"
                        })`,
                        width: "50px",
                        height: "50px",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        border: "none",
                        margin: "0 auto",
                      }}
                    ></div>
                  </td>
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group">
                  <label className="font-weight-bold">
                    Trạng thái hiện tại:
                  </label>
                  <p className="mb-0">{getStatusBadge(company.status)}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="status" className="font-weight-bold">
                Chọn trạng thái mới:
              </label>
              <select
                id="status"
                className="form-control"
                value={status}
                onChange={handleStatusChange}
                required
              >
                <option value="">-- Chọn trạng thái --</option>
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-4">
              <button
                type="submit"
                className="btn btn-primary mr-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Đang cập nhật..." : "Cập nhật trạng thái"}
              </button>
              <button
                type="button"
                className="btn btn-light"
                onClick={handleCancel}
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      </div>
      {/* ToastContainer để hiển thị thông báo */}
      <ToastContainer />
    </div>
  );
};

export default IdentifyCompany;
