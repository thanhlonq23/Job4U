import React, { useEffect, useState } from "react";
import { PAGINATION } from "../../../util/constant";
import ReactPaginate from "react-paginate";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import {
  getAllCategoryService,
  DeleteCategoryService,
} from "../../../service/CategoriesService";

const ManageJobType = () => {
  // **STATE KHỞI TẠO**
  const [dataJobType, setdataJobType] = useState([]); // Dữ liệu danh sách loại công việc
  const [count, setCount] = useState(0); // Tổng số trang
  const [numberPage, setnumberPage] = useState(0); // Trang hiện tại
  const [imgPreview, setimgPreview] = useState(""); // Hình ảnh đang xem
  const [isOpen, setisOpen] = useState(false); // Trạng thái mở Lightbox

  // **FETCH DỮ LIỆU DANH SÁCH LOẠI CÔNG VIỆC**
  const fetchJobTypes = async (offset = 0) => {
    try {
      const response = await getAllCategoryService({
        limit: PAGINATION.pagerow,
        offset,
      });

      if (response && Array.isArray(response)) {
        setdataJobType(response);
        setCount(Math.ceil(response.length / PAGINATION.pagerow));
      }
    } catch (error) {
      console.error("Lỗi khi fetch dữ liệu:", error);
      toast.error("Không thể tải dữ liệu danh sách!");
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
    try {
      const res = await DeleteCategoryService(id);
      if (res && res.errCode === 0) {
        toast.success("Xóa loại công việc thành công");

        // Cập nhật trực tiếp danh sách
        const updatedData = dataJobType.filter((item) => item.id !== id);
        setdataJobType(updatedData);

        // Cập nhật lại số trang nếu cần
        setCount(Math.ceil(updatedData.length / PAGINATION.pagerow));
      } else {
        toast.error(res?.errMessage || "Xóa loại công việc thất bại!");
      }
    } catch (error) {
      console.error("Lỗi khi xóa công việc:", error);
      toast.error("Đã xảy ra lỗi khi xóa loại công việc!");
    }
  };

  // **XỬ LÝ PHÂN TRANG**
  const handleChangePage = async (number) => {
    const offset = number.selected * PAGINATION.pagerow;
    setnumberPage(number.selected);
    await fetchJobTypes(offset);
  };

  // **RENDER GIAO DIỆN**
  return (
    <div>
      <div className="col-12 grid-margin">
        <div className="card">
          <div className="card-body">
            <h4 className="card-title">Danh sách loại công việc</h4>

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
                  {dataJobType && dataJobType.length > 0 ? (
                    dataJobType.map((item, index) => (
                      <tr key={item.id}>
                        <td>{index + 1}</td>
                        <td>{item.categoryName}</td>
                        <td style={{ width: "30%" }}>
                          <div
                            onClick={() => openPreviewImage(item.image)}
                            className="box-img-preview"
                            style={{
                              backgroundImage: `url(${
                                item.image || "default-image-url.jpg"
                              })`,
                              width: "100%",
                              height: "100px",
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                            }}
                          ></div>
                        </td>
                        <td>
                          <Link
                            style={{ color: "#4B49AC" }}
                            to={`/admin/edit-job-type/${item.id}/`}
                          >
                            Edit
                          </Link>
                          &nbsp; &nbsp;
                          <a
                            style={{ color: "#4B49AC" }}
                            href="#"
                            onClick={(event) =>
                              handleDeleteJobType(event, item.id)
                            }
                          >
                            Delete
                          </a>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5">Không có dữ liệu</td>
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
            pageCount={count}
            marginPagesDisplayed={3}
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
            onPageChange={handleChangePage}
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
