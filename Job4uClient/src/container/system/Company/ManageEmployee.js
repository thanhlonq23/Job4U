import React, { useEffect, useState } from "react";
import {
  getAllEmployeeService,
  terminateUserService,
} from "../../../service/UserService";
import { PAGINATION } from "../../../util/constant";
import ReactPaginate from "react-paginate";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const ManageEmployee = () => {
  const [dataEmployees, setDataEmployees] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // FETCH DỮ LIỆU DANH SÁCH NHÂN VIÊN
  const fetchEmployees = async (page = 0) => {
    setIsLoading(true);
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");

      const response = await getAllEmployeeService({
        id: userInfo.companyId,
        page,
        size: PAGINATION.pagerow,
      });

      if (response && response.status === "SUCCESS" && response.data) {
        setDataEmployees(response.data.content);
        setTotalPages(response.data.totalPages);
        setTotalElements(response.data.totalElements);
      } else {
        toast.error("Dữ liệu không hợp lệ!");
      }
    } catch (error) {
      console.error("Lỗi khi fetch dữ liệu nhân viên:", error);
      toast.error("Không thể tải dữ liệu danh sách nhân viên!");
    } finally {
      setIsLoading(false);
    }
  };

  // GỌI FETCH DỮ LIỆU LẦN ĐẦU
  useEffect(() => {
    fetchEmployees(0);
  }, []);

  // XỬ LÝ PHÂN TRANG
  const handlePageChange = async (selectedPage) => {
    setCurrentPage(selectedPage.selected);
    await fetchEmployees(selectedPage.selected);
  };

  // XÓA NHÂN VIÊN
  const handleDeleteEmployee = async (event, id) => {
    event.preventDefault();
    if (window.confirm("Bạn có chắc chắn muốn xóa nhân viên này?")) {
      try {
        const res = await terminateUserService(id);
        if (res && res.status === "SUCCESS") {
          toast.success("Xóa nhân viên thành công");
          // Xóa phần tử khỏi danh sách hiện tại
          const updatedData = dataEmployees.filter((item) => item.id !== id);
          setDataEmployees(updatedData);

          // Kiểm tra xem có cần giảm số trang không
          if (updatedData.length === 0 && currentPage > 0) {
            setCurrentPage((prev) => prev - 1);
            fetchEmployees(currentPage - 1);
          }
        } else {
          toast.error(res?.message || "Xóa nhân viên thất bại!");
        }
      } catch (error) {
        console.error("Lỗi khi xóa nhân viên:", error);
        toast.error("Đã xảy ra lỗi khi xóa nhân viên!");
      }
    }
  };

  // Chuyển đổi giới tính từ enum sang tiếng Việt
  const formatGender = (gender) => {
    switch (gender) {
      case "MALE":
        return "Nam";
      case "FEMALE":
        return "Nữ";
      case "OTHER":
        return "Khác";
      default:
        return "Không xác định";
    }
  };

  // Định dạng ngày tháng
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  // RENDER GIAO DIỆN
  return (
    <div className="col-12 grid-margin">
      <div className="card">
        <div className="card-body">
          <h4 className="card-title">DANH SÁCH NHÂN VIÊN</h4>
          <div className="table-responsive pt-2">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Họ và tên</th>
                  <th>Email</th>
                  <th>Ngày sinh</th>
                  <th>Giới tính</th>
                  <th>Vai trò</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td
                      colSpan="7"
                      style={{ textAlign: "center", padding: "20px" }}
                    >
                      Đang tải dữ liệu...
                    </td>
                  </tr>
                ) : dataEmployees && dataEmployees.length > 0 ? (
                  dataEmployees.map((item, index) => (
                    <tr key={item.id}>
                      <td>{currentPage * PAGINATION.pagerow + index + 1}</td>
                      <td>{item.fullName}</td>
                      <td>{item.email}</td>
                      <td>{formatDate(item.dob)}</td>
                      <td>{formatGender(item.gender)}</td>
                      <td>
                        {item.roleName === "EMPLOYER_OWNER"
                          ? "Chủ công ty"
                          : item.roleName === "EMPLOYER_STAFF"
                          ? "Nhân viên"
                          : item.roleName}
                      </td>
                      <td>
                        {item.roleName !== "EMPLOYER_OWNER" && (
                          <>
                            &nbsp; &nbsp;
                            <a
                              style={{ color: "#4B49AC" }}
                              href="#"
                              onClick={(event) =>
                                handleDeleteEmployee(event, item.id)
                              }
                            >
                              Xóa
                            </a>
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="7"
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

        {totalPages > 1 && (
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
        )}
      </div>
    </div>
  );
};

export default ManageEmployee;
