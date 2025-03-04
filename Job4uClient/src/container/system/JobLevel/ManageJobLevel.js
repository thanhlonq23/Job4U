import React, { useEffect, useState } from "react";
import moment from "moment";
import { PAGINATION } from "../../../util/constant";
import ReactPaginate from "react-paginate";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getAllJobLevelService,
  DeleteJobLevelService,
} from "../../../service/JobLevelService";

const ManageJobLevel = () => {
  // **STATE KHỞI TẠO**
  const [dataJobLevel, setDataJobLevel] = useState([]); // Dữ liệu danh sách cấp bậc
  const [totalPages, setTotalPages] = useState(0); // Tổng số trang
  const [currentPage, setCurrentPage] = useState(0); // Trang hiện tại
  const [isLoading, setIsLoading] = useState(false); // Trạng thái loading

  // **FETCH DỮ LIỆU DANH SÁCH CẤP BẬC**
  const fetchJobLevels = async (offset = 0) => {
    setIsLoading(true);
    try {
      const response = await getAllJobLevelService({
        limit: PAGINATION.pagerow,
        offset,
      });

      if (response && Array.isArray(response)) {
        setDataJobLevel(response);
        setTotalPages(Math.ceil(response.count / PAGINATION.pagerow));
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
    fetchJobLevels(0);
  }, []);

  // **XÓA CẤP BẬC**
  const handleDeleteJobLevel = async (event, id) => {
    event.preventDefault();
    if (window.confirm("Bạn có chắc chắn muốn xóa cấp bậc này?")) {
      try {
        const res = await DeleteJobLevelService(id);
        if (res && res.errCode === 0) {
          toast.success("Xóa cấp bậc thành công");

          // Cập nhật trực tiếp danh sách
          const updatedData = dataJobLevel.filter((item) => item.id !== id);
          setDataJobLevel(updatedData);

          // Cập nhật lại số trang nếu cần
          setTotalPages(Math.ceil(updatedData.length / PAGINATION.pagerow));
        } else {
          toast.error(res?.errMessage || "Xóa cấp bậc thất bại!");
        }
      } catch (error) {
        console.error("Lỗi khi xóa cấp bậc:", error);
        toast.error("Đã xảy ra lỗi khi xóa cấp bậc!");
      }
    }
  };

  // **XỬ LÝ PHÂN TRANG**
  const handlePageChange = async (selectedPage) => {
    const offset = selectedPage.selected * PAGINATION.pagerow;
    setCurrentPage(selectedPage.selected);
    await fetchJobLevels(offset);
  };

  // **RENDER GIAO DIỆN**
  return (
    <div>
      <div className="col-12 grid-margin">
        <div className="card">
          <div className="card-body">
            <h4 className="card-title">Danh sách cấp bậc</h4>

            {/* BẢNG DANH SÁCH CẤP BẬC */}
            <div className="table-responsive pt-2">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Tên cấp bậc</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td
                        colSpan="3"
                        style={{ textAlign: "center", padding: "20px" }}
                      >
                        Đang tải dữ liệu...
                      </td>
                    </tr>
                  ) : dataJobLevel.length > 0 ? (
                    dataJobLevel.map((item, index) => (
                      <tr key={item.id}>
                        <td>{index + 1}</td>
                        <td>{item.jobLevel_name}</td>
                        <td>
                          <Link
                            style={{ color: "#4B49AC" }}
                            to={`/admin/edit-job-level/${item.id}/`}
                          >
                            Edit
                          </Link>
                          &nbsp; &nbsp;
                          <a
                            style={{ color: "#4B49AC" }}
                            href="#"
                            onClick={(event) =>
                              handleDeleteJobLevel(event, item.id)
                            }
                          >
                            Delete
                          </a>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="3"
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
            onPageChange={handlePageChange}
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
    </div>
  );
};

export default ManageJobLevel;
