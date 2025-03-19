import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Spinner, Modal, Row, Col, Card, CardBody, Button } from "reactstrap";
import ReactPaginate from "react-paginate";
import moment from "moment";
import { PAGINATION } from "../../../util/constant";
import {
  banPostService,
  activePostService,
} from "../../../service/userService1";
import { getPostByCompanyIdService } from "../../../service/PostService";

const ManagePost = () => {
  const [dataPost, setDataPost] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Mapping trạng thái từ backend
  const statusMapping = {
    PENDING: { label: "Chờ duyệt", className: "bg-warning" },
    ACTIVE: { label: "Hoạt động", className: "bg-success" },
    EXPIRED: { label: "Đã hết hạn", className: "bg-secondary" },
    REJECTED: { label: "Đã từ chối", className: "bg-danger" },
  };

  const fetchPosts = async (page = 0) => {
    const controller = new AbortController();
    try {
      setIsLoading(true);
      const userData = JSON.parse(localStorage.getItem("userInfo") || "{}");
      if (!userData || !userData.companyId) {
        toast.error("Thông tin người dùng không hợp lệ!");
        return;
      }

      if (userData) {
        // Tạo params cho API call
        const params = {
          page,
          size: PAGINATION.pagerow,
          companyId: userData.companyId,
        };

        // Chỉ thêm tham số status nếu không phải "all"
        if (filterStatus !== "all") {
          params.status = filterStatus;
        }

        const response = await getPostByCompanyIdService(params, {
          signal: controller.signal,
        });

        if (response && response.data) {
          setDataPost(response.data.content || []);
          setTotalPages(response.data.totalPages || 0);
        }
        setUser(userData);
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error(error);
        toast.error("Không thể tải dữ liệu bài đăng!");
      }
    } finally {
      setIsLoading(false);
    }

    return () => controller.abort();
  };

  useEffect(() => {
    fetchPosts(0);
    setCurrentPage(0);
  }, [filterStatus]);

  const handlePageChange = async (selectedPage) => {
    setCurrentPage(selectedPage.selected);
    await fetchPosts(selectedPage.selected);
  };

  const handleBanPost = async (id) => {
    try {
      setIsLoading(true);
      let res = await banPostService(id);

      if (res && res.errCode === 0) {
        toast.success("Ẩn bài đăng thành công");
        await fetchPosts(currentPage);
      } else {
        toast.error("Ẩn bài đăng thất bại");
      }
    } catch (error) {
      console.error(error);
      toast.error("Đã xảy ra lỗi khi ẩn bài đăng");
    } finally {
      setIsLoading(false);
    }
  };

  const handleActivePost = async (id) => {
    try {
      setIsLoading(true);
      let res = await activePostService({
        id: id,
      });

      if (res && res.errCode === 0) {
        toast.success("Hiện bài đăng thành công");
        await fetchPosts(currentPage);
      } else {
        toast.error("Hiện bài đăng thất bại");
      }
    } catch (error) {
      console.error(error);
      toast.error("Đã xảy ra lỗi khi hiện bài đăng");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilterStatus(e.target.value);
  };

  const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    };
  };

  const handleSearch = debounce((value) => {
    setSearchTerm(value);
  }, 300);

  const filteredPosts = dataPost.filter((post) =>
    post.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="manage-post-container">
      <Row>
        <Col md={12}>
          <Card className="main-card">
            <CardBody>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="card-title">QUẢN LÝ BÀI ĐĂNG</h4>
                <Link to="/admin/add-post" className="btn btn-primary">
                  <i className="ti-plus"></i> Thêm mới bài đăng
                </Link>
              </div>

              <Row className="mb-3">
                <Col md={4}>
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Tìm kiếm bài đăng..."
                      onChange={(e) => handleSearch(e.target.value)}
                    />
                  </div>
                </Col>
                <Col md={3}>
                  <div className="form-group">
                    <select
                      className="form-control"
                      value={filterStatus}
                      onChange={handleFilterChange}
                    >
                      <option value="all">Tất cả trạng thái</option>
                      <option value="PENDING">Đang chờ duyệt</option>
                      <option value="ACTIVE">Đang hoạt động</option>
                      <option value="EXPIRED">Đã hết hạn</option>
                      <option value="REJECTED">Đã bị từ chối</option>
                    </select>
                  </div>
                </Col>
              </Row>

              <div className="table-responsive">
                <table className="table table-bordered table-hover">
                  <thead className="bg-light">
                    <tr>
                      <th className="text-center">STT</th>
                      <th>Tên bài đăng</th>
                      <th>Ngành</th>
                      <th>Vị trí</th>
                      <th>Hình thức làm việc</th>
                      <th>Người đăng</th>
                      <th className="text-center">Ngày kết thúc</th>
                      <th className="text-center">Trạng thái</th>
                      <th className="text-center">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td colSpan="9" className="text-center">
                          <Spinner size="sm" color="primary" /> Đang tải dữ
                          liệu...
                        </td>
                      </tr>
                    ) : filteredPosts && filteredPosts.length > 0 ? (
                      filteredPosts.map((item, index) => {
                        const expirationDate = moment(
                          item.expirationDate
                        ).format("DD/MM/YYYY");
                        const statusInfo = statusMapping[item.status] || {
                          label: "Không xác định",
                          className: "bg-secondary",
                        };

                        return (
                          <tr key={index}>
                            <td className="text-center">
                              {currentPage * PAGINATION.pagerow + index + 1}
                            </td>
                            <td>{item.name}</td>
                            <td>{item.category}</td>
                            <td>{item.jobLevel}</td>
                            <td>{item.workType}</td>
                            <td>
                              {item.posterFistName + " " + item.posterLastName}
                            </td>
                            <td className="text-center">{expirationDate}</td>
                            <td className="text-center">
                              <span className={`badge ${statusInfo.className}`}>
                                {statusInfo.label}
                              </span>
                            </td>
                            <td className="text-center">
                              <div className="btn-group">
                                <Link
                                  style={{ color: "#4B49AC" }}
                                  to={`/admin/list-cv/${item.id}`}
                                >
                                  Xem CV
                                </Link>
                                &nbsp; &nbsp;
                                <Link
                                  style={{ color: "#4B49AC" }}
                                  to={`/admin/edit-post/${item.id}`}
                                >
                                  Cập nhật
                                </Link>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="9" className="text-center">
                          Không có bài đăng nào
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="mt-4">
                  <ReactPaginate
                    previousLabel={"Trước"}
                    nextLabel={"Sau"}
                    breakLabel={"..."}
                    pageCount={totalPages}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={3}
                    onPageChange={handlePageChange}
                    containerClassName={"pagination justify-content-center"}
                    pageClassName={"page-item"}
                    pageLinkClassName={"page-link"}
                    previousClassName={"page-item"}
                    previousLinkClassName={"page-link"}
                    nextClassName={"page-item"}
                    nextLinkClassName={"page-link"}
                    breakClassName={"page-item"}
                    breakLinkClassName={"page-link"}
                    activeClassName={"active"}
                    forcePage={currentPage}
                  />
                </div>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ManagePost;
