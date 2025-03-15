import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactMarkdown from "react-markdown";
import {
  Spinner,
  Modal,
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  Button,
  Badge,
} from "reactstrap";
import moment from "moment";
import { getPostByIdService } from "../../../service/PostService";

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mapping trạng thái từ backend với màu sắc tương ứng
  const statusMapping = {
    PENDING: { label: "Chờ duyệt", color: "warning" },
    ACTIVE: { label: "Hoạt động", color: "success" },
    EXPIRED: { label: "Đã hết hạn", color: "secondary" },
    REJECTED: { label: "Đã từ chối", color: "danger" },
  };

  const fetchPostDetail = async () => {
    try {
      setIsLoading(true);
      const response = await getPostByIdService(id);
      console.log("Data: ");
      console.log(response);

      if (response && response.data && response.status == "SUCCESS") {
        setPost(response.data);
      } else {
        toast.error("Không thể tải thông tin bài đăng!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Đã xảy ra lỗi khi tải thông tin bài đăng!");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchPostDetail();
    }
  }, [id]);

  // Format date to display
  const formatDate = (dateString) => {
    return moment(dateString).format("DD/MM/YYYY");
  };

  return (
    <div className="post-detail-container">
      <Row>
        <Col md={12}>
          <Card className="main-card">
            <CardHeader>
              <div className="d-flex justify-content-between align-items-center">
                <h4 className="mb-0">CHI TIẾT BÀI ĐĂNG</h4>
                <div>
                  <Link
                    to="/admin/list-post-admin"
                    className="btn btn-secondary mr-2"
                  >
                    <i className="ti-arrow-left mr-1"></i> Quay lại
                  </Link>
                  <Link
                    to={`/admin/edit-post/${id}`}
                    className="btn btn-primary"
                  >
                    <i className="ti-pencil mr-1"></i> Chỉnh sửa
                  </Link>
                </div>
              </div>
            </CardHeader>
            <CardBody>
              {isLoading ? (
                <div className="text-center py-5">
                  <Spinner color="primary" />
                  <p className="mt-2">Đang tải thông tin bài đăng...</p>
                </div>
              ) : post ? (
                <Row>
                  <Col md={12}>
                    <div className="post-header mb-4">
                      <div className="d-flex justify-content-between align-items-start">
                        <h3 className="post-title">{post.name}</h3>
                        <Badge
                          color={
                            statusMapping[post.status]?.color || "secondary"
                          }
                        >
                          {statusMapping[post.status]?.label ||
                            "Không xác định"}
                        </Badge>
                      </div>
                      <p className="text-muted">
                        Đăng bởi: {post.posterFistName} {post.posterLastName} |
                        Hết hạn: {formatDate(post.expirationDate)}
                      </p>
                    </div>
                  </Col>

                  <Col md={12}>
                    <div className="post-meta mb-4">
                      <Row>
                        <Col md={3} className="mb-3">
                          <div className="meta-item">
                            <h6 className="meta-title">Số lượng tuyển dụng</h6>
                            <p className="meta-value">{post.amount} người</p>
                          </div>
                        </Col>
                        <Col md={3} className="mb-3">
                          <div className="meta-item">
                            <h6 className="meta-title">Địa điểm</h6>
                            <p className="meta-value">{post.location?.name}</p>
                          </div>
                        </Col>
                        <Col md={3} className="mb-3">
                          <div className="meta-item">
                            <h6 className="meta-title">Ngành nghề</h6>
                            <p className="meta-value">{post.category?.name}</p>
                          </div>
                        </Col>
                        <Col md={3} className="mb-3">
                          <div className="meta-item">
                            <h6 className="meta-title">Vị trí</h6>
                            <p className="meta-value">{post.jobLevel?.name}</p>
                          </div>
                        </Col>
                        <Col md={3} className="mb-3">
                          <div className="meta-item">
                            <h6 className="meta-title">Hình thức làm việc</h6>
                            <p className="meta-value">{post.workType?.name}</p>
                          </div>
                        </Col>
                        <Col md={3} className="mb-3">
                          <div className="meta-item">
                            <h6 className="meta-title">Mức lương</h6>
                            <p className="meta-value">{post.salary?.name}</p>
                          </div>
                        </Col>
                        <Col md={3} className="mb-3">
                          <div className="meta-item">
                            <h6 className="meta-title">Kinh nghiệm</h6>
                            <p className="meta-value">
                              {post.experience?.name}
                            </p>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </Col>

                  <Col md={12}>
                    <div className="post-description mb-4">
                      <h5 className="section-title">Mô tả công việc</h5>
                      <div className="description-content markdown-content">
                        <ReactMarkdown>{post.description}</ReactMarkdown>
                      </div>
                    </div>
                  </Col>
                </Row>
              ) : (
                <div className="text-center py-5">
                  <p>
                    Không tìm thấy thông tin bài đăng hoặc bài đăng không tồn
                    tại.
                  </p>
                  <Link
                    to="/admin/list-post-admin"
                    className="btn btn-primary mt-3"
                  >
                    Quay lại danh sách
                  </Link>
                </div>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Loading Modal */}
      {isLoading && (
        <Modal isOpen centered className="loading-modal">
          <div className="spinner-container">
            <Spinner color="primary" />
            <p className="mt-2">Đang xử lý...</p>
          </div>
        </Modal>
      )}

      {/* ToastContainer để hiển thị thông báo */}
      <ToastContainer />
    </div>
  );
};

export default PostDetail;
