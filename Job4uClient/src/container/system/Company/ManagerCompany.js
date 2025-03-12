import React, { useEffect, useState } from "react";
import { PAGINATION } from "../../../util/constant";
import ReactPaginate from "react-paginate";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import {
  getAllCompanyService,
  deleteCompanyService,
} from "../../../service/CompanyService";

const ManagerCompany = () => {
  // **STATE KHỞI TẠO**
  const [dataCompany, setDataCompany] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [imgPreview, setImgPreview] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // **FETCH DỮ LIỆU DANH SÁCH CÔNG TY**
  const fetchCompanies = async (page = 0) => {
    setIsLoading(true);
    try {
      const response = await getAllCompanyService({
        page,
        size: PAGINATION.pagerow,
      });
      if (response && response.data) {
        const { content, totalPages } = response.data;
        setDataCompany(content);
        setTotalPages(totalPages);
      } else {
        toast.error("Dữ liệu không hợp lệ!");
      }
    } catch (error) {
      console.error("Lỗi khi fetch dữ liệu:", error);
      toast.error("Không thể tải dữ liệu danh sách công ty!");
    } finally {
      setIsLoading(false);
    }
  };

  // **GỌI FETCH DỮ LIỆU LẦN ĐẦU**
  useEffect(() => {
    fetchCompanies(0);
  }, []);

  // **MỞ LIGHTBOX XEM HÌNH ẢNH**
  const openPreviewImage = (url) => {
    setImgPreview(url || "default-image-url.jpg");
    setIsOpen(true);
  };

  // **XÓA CÔNG TY**
  const handleDeleteCompany = async (event, id) => {
    event.preventDefault();
    if (window.confirm("Bạn có chắc chắn muốn xóa công ty này?")) {
      try {
        const res = await deleteCompanyService(id);
        if (res && res.status === "SUCCESS") {
          toast.success("Xóa công ty thành công");
          setDataCompany((prev) => prev.filter((item) => item.id !== id));

          // Nếu xóa hết dữ liệu trên trang hiện tại, load lại trang trước đó
          if (dataCompany.length === 1 && currentPage > 0) {
            fetchCompanies(currentPage - 1);
            setCurrentPage(currentPage - 1);
          }
        } else {
          toast.error(res?.message || "Xóa công ty thất bại!");
        }
      } catch (error) {
        console.error("Lỗi khi xóa công ty:", error);
        toast.error("Đã xảy ra lỗi khi xóa công ty!");
      }
    }
  };

  // **XỬ LÝ PHÂN TRANG**
  const handleChangePage = async (selectedPage) => {
    setCurrentPage(selectedPage.selected);
    await fetchCompanies(selectedPage.selected);
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

  // **RENDER GIAO DIỆN**
  return (
    <div className="col-12 grid-margin">
      <div className="card">
        <div className="card-body">
          <h4 className="card-title">DANH SÁCH CÔNG TY</h4>

          {/* BẢNG DANH SÁCH CÔNG TY */}
          <div className="table-responsive pt-2">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Tên công ty</th>
                  <th>Hình ảnh</th>
                  <th>Email</th>
                  <th>Website</th>
                  <th>Số lượng nhân viên</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td
                      colSpan="8"
                      style={{ textAlign: "center", padding: "20px" }}
                    >
                      Đang tải dữ liệu...
                    </td>
                  </tr>
                ) : dataCompany && dataCompany.length > 0 ? (
                  dataCompany.map((item, index) => (
                    <tr key={item.id}>
                      <td>{currentPage * PAGINATION.pagerow + index + 1}</td>
                      <td>{item.name}</td>
                      <td
                        style={{
                          width: "15%",
                          textAlign: "center",
                          verticalAlign: "middle",
                        }}
                      >
                        <div
                          onClick={() => openPreviewImage(item.thumbnail)}
                          className="box-img-preview"
                          style={{
                            backgroundImage: `url(${
                              item.thumbnail || "default-image-url.jpg"
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
                      <td>{item.email}</td>
                      <td>
                        <a
                          href={item.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: "#212529",
                          }}
                        >
                          {item.website}
                        </a>
                      </td>
                      <td>{item.amountEmployer}</td>
                      <td>{renderStatus(item.status)}</td>

                      <td>
                        <Link
                          style={{ color: "#4B49AC" }}
                          to={`/admin/identify-company/${item.id}/`}
                        >
                          Xét duyệt
                        </Link>
                        &nbsp; &nbsp;
                        <Link
                          style={{ color: "#4B49AC" }}
                          to={`/admin/view-company/${item.id}/`}
                        >
                          Xem chi tiết
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="8"
                      style={{ textAlign: "center", padding: "20px" }}
                    >
                      Không có dữ liệu.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* PHÂN TRANG */}
        <ReactPaginate
          previousLabel={"Quay lại"}
          nextLabel={"Tiếp"}
          breakLabel={"..."}
          pageCount={totalPages}
          marginPagesDisplayed={3}
          pageRangeDisplayed={5}
          onPageChange={handleChangePage}
          containerClassName={"pagination justify-content-center pb-3"}
          pageClassName={"page-item"}
          pageLinkClassName={"page-link"}
          previousLinkClassName={"page-link"}
          previousClassName={"page-item"}
          nextClassName={"page-item"}
          nextLinkClassName={"page-link"}
          breakLinkClassName={"page-link"}
          breakClassName={"page-item"}
          activeClassName={"active"}
          forcePage={currentPage}
        />
      </div>
      {/* LIGHTBOX */}
      {isOpen && (
        <Lightbox
          mainSrc={imgPreview}
          onCloseRequest={() => setIsOpen(false)}
        />
      )}

      {/* ToastContainer để hiển thị thông báo */}
      <ToastContainer />
    </div>
  );
};

export default ManagerCompany;
