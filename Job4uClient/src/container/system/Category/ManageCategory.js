import React, { useEffect, useState } from "react";
import { PAGINATION } from "../../../util/constant";
import ReactPaginate from "react-paginate";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import {
  getAllCategoryService,
  deleteCategoryService,
} from "../../../service/CategoriesService";

const ManageJobType = () => {
  // **STATE KHỞI TẠO**
  const [dataJobType, setdataJobType] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [imgPreview, setimgPreview] = useState("");
  const [isOpen, setisOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // **FETCH DỮ LIỆU DANH SÁCH LOẠI CÔNG VIỆC**
  const fetchJobTypes = async (page = 0) => {
    setIsLoading(true);
    try {
      const response = await getAllCategoryService({
        page,
        size: PAGINATION.pagerow,
      });
      if (response && response.data) {
        const { content, totalPages } = response.data;
        setdataJobType(content);
        setTotalPages(totalPages);
      } else {
        toast.error("Dữ liệu không hợp lệ!");
      }
    } catch (error) {
      console.error("Lỗi khi fetch dữ liệu:", error);
      toast.error("Không thể tải dữ liệu danh sách!");
    } finally {
      setIsLoading(false);
    }
  };

  // **GỌI FETCH DỮ LIỆU LẦN ĐẦU**
  useEffect(() => {
    fetchJobTypes(0);
  }, []);

  // **MỞ LIGHTBOX XEM HÌNH ẢNH**
  const openPreviewImage = (url) => {
    setimgPreview(url || "default-image-url.jpg");
    setisOpen(true);
  };

  // **XÓA LOẠI CÔNG VIỆC**
  const handleDeleteJobType = async (event, id) => {
    event.preventDefault();
    if (window.confirm("Bạn có chắc chắn muốn xóa loại công việc này?")) {
      try {
        const res = await deleteCategoryService(id);
        if (res && res.errCode === 0) {
          toast.success("Xóa loại công việc thành công");
          setdataJobType((prev) => prev.filter((item) => item.id !== id));

          // Nếu xóa hết dữ liệu trên trang hiện tại, load lại trang trước đó
          if (dataJobType.length === 1 && currentPage > 0) {
            fetchJobTypes(currentPage - 1);
            setCurrentPage(currentPage - 1);
          }
        } else {
          toast.error(res?.errMessage || "Xóa loại công việc thất bại!");
        }
      } catch (error) {
        console.error("Lỗi khi xóa loại công việc:", error);
        toast.error("Đã xảy ra lỗi khi xóa loại công việc!");
      }
    }
  };

  // **XỬ LÝ PHÂN TRANG**
  const handleChangePage = async (selectedPage) => {
    setCurrentPage(selectedPage.selected);
    await fetchJobTypes(selectedPage.selected);
  };

  // **RENDER GIAO DIỆN**
  return (
    <div>
      <div className="col-12 grid-margin">
        <div className="card">
          <div className="card-body">
            <h4 className="card-title">DANH SÁCH LOẠI CÔNG VIỆC</h4>

            {/* BẢNG DANH SÁCH LOẠI CÔNG VIỆC */}
            <div className="table-responsive pt-2">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Tên công việc</th>
                    <th>Hình ảnh</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td
                        colSpan="4"
                        style={{ textAlign: "center", padding: "20px" }}
                      >
                        Đang tải dữ liệu...
                      </td>
                    </tr>
                  ) : dataJobType && dataJobType.length > 0 ? ( // Thêm kiểm tra dataJobType
                    dataJobType.map((item, index) => (
                      <tr key={item.id}>
                        <td>{currentPage * PAGINATION.pagerow + index + 1}</td>
                        <td>{item.name}</td>
                        <td
                          style={{
                            width: "30%",
                            textAlign: "center",
                            verticalAlign: "middle",
                          }}
                        >
                          <div
                            onClick={() => openPreviewImage(item.image)}
                            className="box-img-preview"
                            style={{
                              backgroundImage: `url(${
                                item.image || "default-image-url.jpg"
                              })`,
                              width: "50px",
                              height: "50px",
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                              border: "none",
                              margin: "0 auto", // Đảm bảo căn giữa chính xác
                            }}
                          ></div>
                        </td>

                        <td>
                          <Link
                            style={{ color: "#4B49AC" }}
                            to={`/admin/edit-job-type/${item.id}/`}
                          >
                            Cập nhật
                          </Link>
                          &nbsp; &nbsp;
                          <a
                            style={{ color: "#4B49AC" }}
                            href="#"
                            onClick={(event) =>
                              handleDeleteJobType(event, item.id)
                            }
                          >
                            Xóa
                          </a>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
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
      </div>

      {/* LIGHTBOX */}
      {isOpen && (
        <Lightbox
          mainSrc={imgPreview}
          onCloseRequest={() => setisOpen(false)}
        />
      )}
    </div>
  );
};

export default ManageJobType;
