import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Spinner,
  Modal,
  Row,
  Col,
  Card,
  CardBody,
  Button,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import ReactPaginate from "react-paginate";
import moment from "moment";
import { PAGINATION } from "../../../util/constant";
import {
  banPostService,
  activePostService,
} from "../../../service/userService1";
import {
  getAllPostService,
  updatePostStatusService,
} from "../../../service/PostService";

const ManagePostAdmin = () => {
  const [dataPost, setDataPost] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // State cho modal xét duyệt
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("PENDING");
  const [selectedPostName, setSelectedPostName] = useState("");

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

      // Tạo params cho API call - không cần companyId vì đây là admin
      const params = {
        page,
        size: PAGINATION.pagerow,
      };

      // Chỉ thêm tham số status nếu không phải "all"
      if (filterStatus !== "all") {
        params.status = filterStatus;
      }

      const response = await getAllPostService(params, {
        signal: controller.signal,
      });

      if (response && response.data) {
        setDataPost(response.data.content || []);
        setTotalPages(response.data.totalPages || 0);
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

  // Functions for modal
  const openModal = (id, postName) => {
    setSelectedPostId(id);
    setSelectedPostName(postName);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedPostId(null);
    setSelectedStatus("PENDING");
  };

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  };

  const handleUpdatePostStatus = async () => {
    try {
      setIsLoading(true);

      const response = await updatePostStatusService({
        id: selectedPostId,
        status: selectedStatus,
      });

      if (response?.status === "SUCCESS") {
        toast.success("Cập nhật trạng thái bài đăng thành công!");
        await fetchPosts(currentPage);
        closeModal();
      } else {
        toast.error(response?.data?.errMessage || "Đã xảy ra lỗi!");
      }
    } catch (error) {
      console.error("Error updating post status:", error);
      toast.error("Đã xảy ra lỗi khi cập nhật trạng thái bài đăng!");
    } finally {
      setIsLoading(false);
    }
  };

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
                <h4 className="card-title">QUẢN LÝ BÀI ĐĂNG - ADMIN</h4>
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
                      <th>Công ty</th>
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
                            <td>{item.companyName}</td>
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
                                  to={`/admin/post-detail/${item.id}`}
                                >
                                  Chi tiết bài đăng
                                </Link>
                                &nbsp; &nbsp;
                                <a
                                  href="#"
                                  style={{ color: "#4B49AC" }}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    openModal(item.id, item.name);
                                  }}
                                >
                                  Xét duyệt
                                </a>
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

      <Modal
        isOpen={modalOpen}
        toggle={closeModal}
        style={{ top: "25%", transform: "translateY(-20%)" }}
      >
        <ModalHeader toggle={closeModal}>XÉT DUYỆT BÀI ĐĂNG</ModalHeader>
        <ModalBody>
          <p>
            <strong>Bài đăng:</strong> {selectedPostName}
          </p>
          <div className="form-group">
            <label>Trạng thái</label>
            <select
              value={selectedStatus}
              onChange={handleStatusChange}
              className="form-control"
              disabled={isLoading}
            >
              <option value="">Xét duyệt</option>
              <option value="ACTIVE">Hoạt động</option>
              <option value="REJECTED">Từ chối</option>
            </select>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="secondary"
            onClick={closeModal}
            disabled={isLoading}
            className="mx-3"
          >
            Hủy
          </Button>

          <Button
            color="primary"
            onClick={handleUpdatePostStatus}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Spinner size="sm" /> Đang lưu...
              </>
            ) : (
              "Lưu"
            )}
          </Button>
        </ModalFooter>
      </Modal>

      {/* Loading Modal */}
      {isLoading && !modalOpen && (
        <Modal isOpen centered className="loading-modal">
          <div className="spinner-container">
            <Spinner color="primary" />
            <p className="mt-2">Đang xử lý...</p>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ManagePostAdmin;
