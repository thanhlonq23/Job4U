import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
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
    <div className="post-detail-container p-4">
      <Row>
        <Col md={12}>
          <Card className="main-card shadow-sm border-0">
            <CardHeader className="bg-primary text-white py-3">
              <div className="d-flex justify-content-between align-items-center">
                <h4 className="mb-0"></h4>
                <div>
                  <Link
                    to="/admin/list-post-admin"
                    className="btn btn-light me-2"
                  >
                    <i className="ti-arrow-left me-1"></i> Quay lại
                  </Link>
                  <Link
                    to={`/admin/edit-post/${id}`}
                    className="btn btn-warning text-white"
                  >
                    <i className="ti-pencil me-1"></i> Chỉnh sửa
                  </Link>
                </div>
              </div>
            </CardHeader>
            <CardBody className="bg-light">
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
                        <h3 className="post-title text-primary">{post.name}</h3>
                        <Badge
                          color={
                            statusMapping[post.status]?.color || "secondary"
                          }
                          className="px-3 py-2"
                        >
                          {statusMapping[post.status]?.label ||
                            "Không xác định"}
                        </Badge>
                      </div>
                      <p className="text-muted mt-2">
                        Đăng bởi:{" "}
                        <strong>
                          {post.posterFistName} {post.posterLastName}
                        </strong>{" "}
                        | Hết hạn:{" "}
                        <strong>{formatDate(post.expirationDate)}</strong>
                      </p>
                    </div>
                  </Col>

                  <Col md={12}>
                    <div className="post-meta mb-4">
                      <Row>
                        {[
                          {
                            title: "Số lượng tuyển dụng",
                            value: `${post.amount} người`,
                          },
                          { title: "Địa điểm", value: post.location?.name },
                          { title: "Ngành nghề", value: post.category?.name },
                          { title: "Vị trí", value: post.jobLevel?.name },
                          {
                            title: "Hình thức làm việc",
                            value: post.workType?.name,
                          },
                          { title: "Mức lương", value: post.salary?.name },
                          {
                            title: "Kinh nghiệm",
                            value: post.experience?.name,
                          },
                        ].map((meta, index) => (
                          <Col md={3} key={index} className="mb-3">
                            <div className="meta-item bg-white  shadow-sm p-3">
                              <h6 className="meta-title text-secondary">
                                {meta.title}
                              </h6>
                              <p className="meta-value mb-0">{meta.value}</p>
                            </div>
                          </Col>
                        ))}
                      </Row>
                    </div>
                  </Col>

                  <Col md={12}>
                    <div className="post-description mb-4">
                      <h5 className="section-title text-primary">
                        Mô tả công việc
                      </h5>
                      <div className="description-content markdown-content bg-white p-3 rounded shadow-sm">
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
          <div className="spinner-container text-center py-5">
            <Spinner color="primary" />
            <p className="mt-2">Đang xử lý...</p>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default PostDetail;
