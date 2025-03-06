import React, { useEffect, useState } from "react";
import {
  getAllSalaryService,
  deleteSalaryService,
} from "../../../service/SalaryService";
import { PAGINATION } from "../../../util/constant";
import ReactPaginate from "react-paginate";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const ManageSalary = () => {
  const [dataSalary, setDataSalary] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // **FETCH DỮ LIỆU DANH SÁCH CẤP BẬC**
  const fetchSalarys = async (page = 0) => {
    setIsLoading(true);
    try {
      const response = await getAllSalaryService({
        page,
        size: PAGINATION.pagerow,
      });
      if (response && response.data) {
        const { content, totalPages } = response.data;
        setDataSalary(content);
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
    fetchSalarys(0);
  }, []);

  // **XÓA CẤP BẬC**
  const handleDeleteSalary = async (event, id) => {
    event.preventDefault();
    if (window.confirm("Bạn có chắc chắn muốn xóa khoảng lương này?")) {
      try {
        const res = await deleteSalaryService(id);
        if (res && res.errCode === 0) {
          toast.success("Xóa khoảng lương thành công");
          // Xóa phần tử khỏi danh sách hiện tại
          const updatedData = dataSalary.filter((item) => item.id !== id);
          setDataSalary(updatedData);

          // Kiểm tra xem có cần giảm số trang không
          if (updatedData.length === 0 && currentPage > 0) {
            setCurrentPage((prev) => prev - 1);
            fetchSalarys(currentPage - 1);
          }
        } else {
          toast.error(res?.errMessage || "Xóa khoảng lương thất bại!");
        }
      } catch (error) {
        console.error("Lỗi khi xóa khoảng lương:", error);
        toast.error("Đã xảy ra lỗi khi xóa khoảng lương!");
      }
    }
  };

  // **XỬ LÝ PHÂN TRANG**
  const handlePageChange = async (selectedPage) => {
    setCurrentPage(selectedPage.selected);
    await fetchSalarys(selectedPage.selected);
  };

  // **RENDER GIAO DIỆN**
  return (
    <div>
      <div className="col-12 grid-margin">
        <div className="card">
          <div className="card-body">
            <h4 className="card-title">Danh sách khoảng lương</h4>
            <div className="table-responsive pt-2">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Tên khoảng lương</th>
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
                  ) : dataSalary.length > 0 ? (
                    dataSalary.map((item, index) => (
                      <tr key={item.id}>
                        {/* Số thứ tự chính xác dựa trên trang hiện tại */}
                        <td>{currentPage * PAGINATION.pagerow + index + 1}</td>
                        <td>{item.salaryRange}</td>
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
                              handleDeleteSalary(event, item.id)
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

export default ManageSalary;
