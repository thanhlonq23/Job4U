import React, { useEffect, useState } from "react";
import { PAGINATION } from "../../../util/constant";
import ReactPaginate from "react-paginate";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import {
  getAllUserService,
  deleteUserService,
} from "../../../service/UserService";
import moment from "moment";

const ManageUser = () => {
  const [dataUser, setDataUser] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Fetch user data with pagination and filter
  const fetchUsers = async (page = 0) => {
    setIsLoading(true);
    try {
      const response = await getAllUserService({
        keyword,
        page,
        size: PAGINATION.pagerow,
      });
      if (response && response.data && response.status === "SUCCESS") {
        const { content, totalPages } = response.data;
        setDataUser(content);
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

  // Fetch data on component mount and keyword change
  useEffect(() => {
    fetchUsers(0);
  }, [keyword]);

  // Handle delete user
  const handleDeleteUser = async (event, id) => {
    event.preventDefault();
    if (window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
      try {
        const res = await deleteUserService(id);
        if (res && res.errCode === 0) {
          toast.success("Xóa người dùng thành công");
          setDataUser((prev) => prev.filter((item) => item.id !== id));

          if (dataUser.length === 1 && currentPage > 0) {
            fetchUsers(currentPage - 1);
            setCurrentPage(currentPage - 1);
          }
        } else {
          toast.error(res?.errMessage || "Xóa người dùng thất bại!");
        }
      } catch (error) {
        console.error("Lỗi khi xóa người dùng:", error);
        toast.error("Đã xảy ra lỗi khi xóa người dùng!");
      }
    }
  };

  // Handle pagination page change
  const handleChangePage = async (selectedPage) => {
    setCurrentPage(selectedPage.selected);
    await fetchUsers(selectedPage.selected);
  };

  // Format date
  const formatDate = (isoDate) => {
    if (!isoDate) return "N/A";
    return moment(isoDate).format("DD/MM/YYYY");
  };

  // Format gender
  const formatGender = (gender) => {
    const genderMap = {
      MALE: "Nam",
      FEMALE: "Nữ",
    };
    return genderMap[gender] || "Khác";
  };

  // Format role function
  const formatRole = (role) => {
    const roleMap = {
      ADMIN: "Quản trị viên",
      EMPLOYER_OWNER: "Chủ doanh nghiệp",
      EMPLOYER_STAFF: "Nhân viên",
      JOB_SEEKER: "Người tìm việc",
    };
    return roleMap[role] || "Không xác định";
  };

  return (
    <div className="col-12 grid-margin">
      <div className="card">
        <div className="card-body">
          <h4 className="card-title">Danh sách người dùng</h4>
          {/* Search form */}
          <div className="d-flex mb-3 align-items-center gap-2">
            <input
              type="text"
              className="form-control"
              placeholder="Tìm kiếm người dùng..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              style={{ flex: 1 }} // Chiếm toàn bộ chiều ngang còn lại
            />
            <button className="btn1 btn1-primary1 btn1-icon-text" type="submit">
              <i className="bi bi-search me-1"></i> Tìm kiếm
            </button>
          </div>
          {isLoading ? (
            <div className="text-center my-3">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <div className="table-responsive pt-2">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Họ và Tên</th>
                    <th>Email</th>
                    <th>Vai trò</th>
                    <th>Giới tính</th>
                    <th>Ngày sinh</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {dataUser && dataUser.length > 0 ? (
                    dataUser.map((item, index) => (
                      <tr key={item.id}>
                        <td>{currentPage * PAGINATION.pagerow + index + 1}</td>
                        <td>{`${item.first_name} ${item.last_name}`}</td>
                        <td>{item.email || "N/A"}</td>
                        <td>{formatRole(item.role.name)}</td>
                        <td>{formatGender(item.gender)}</td>
                        <td>{formatDate(item.dob)}</td>
                        <td>
                          <Link
                            style={{ color: "#4B49AC" }}
                            to={`/admin/edit-user/${item.id}/`}
                          >
                            Cập nhật
                          </Link>
                          &nbsp; &nbsp;
                          <a
                            style={{ color: "#4B49AC" }}
                            href="#"
                            onClick={(event) =>
                              handleDeleteUser(event, item.id)
                            }
                          >
                            Xóa
                          </a>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center">
                        Không có dữ liệu
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
          {/* Pagination */}
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
      {/* ToastContainer để hiển thị thông báo */}
      <ToastContainer />
    </div>
  );
};

export default ManageUser;
