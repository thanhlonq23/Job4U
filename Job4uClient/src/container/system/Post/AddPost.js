import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Spinner, Modal, Row, Col, Card, CardBody } from "reactstrap";
import MDEditor from "@uiw/react-md-editor";
import "./AddPost.scss";
import {
  updatePostService,
  createPostService,
  getPostByIdService,
} from "../../../service/PostService.js";
import {
  getAllCategoriesService,
  getAllLocationsService,
  getAllSalariesService,
  getAllJobLevelsService,
  getAllWorkTypesService,
  getAllExperiencesService,
} from "../../../service/DataService.js";

const AddPost = () => {
  const { id } = useParams();
  const [isActionAdd, setIsActionAdd] = useState(!id);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState({});

  // State cho dữ liệu select options
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [salaries, setSalaries] = useState([]);
  const [jobLevels, setJobLevels] = useState([]);
  const [workTypes, setWorkTypes] = useState([]);
  const [experiences, setExperiences] = useState([]);

  // Lấy userInfo từ localStorage
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");

  // Khởi tạo user từ userInfo trong useEffect
  useEffect(() => {
    setUser(userInfo);
  }, []);

  // State cho form input (status luôn là "PENDING")
  const [inputValues, setInputValues] = useState({
    name: "",
    description_Markdown: "",
    status: "PENDING",
    expiration_date: "",
    amount: 1,
    category: { id: "" },
    location: { id: "" },
    salary: { id: "" },
    jobLevel: { id: "" },
    workType: { id: "" },
    experience: { id: "" },
    user: { id: userInfo.userId || "" },
    company: { id: userInfo.companyId || "" },
  });

  // Lấy dữ liệu cho các dropdown
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        setIsLoading(true);
        const [
          categoriesResponse,
          locationsResponse,
          salariesResponse,
          jobLevelsResponse,
          workTypesResponse,
          experiencesResponse,
        ] = await Promise.all([
          getAllCategoriesService(),
          getAllLocationsService(),
          getAllSalariesService(),
          getAllJobLevelsService(),
          getAllWorkTypesService(),
          getAllExperiencesService(),
        ]);

        setCategories(categoriesResponse?.data || []);
        setLocations(locationsResponse?.data || []);
        setSalaries(salariesResponse?.data || []);
        setJobLevels(jobLevelsResponse?.data || []);
        setWorkTypes(workTypesResponse?.data || []);
        setExperiences(experiencesResponse?.data || []);
      } catch (error) {
        toast.error("Đã xảy ra lỗi khi lấy dữ liệu dropdown");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDropdownData();
  }, []);

  // Lấy dữ liệu bài đăng nếu là chế độ cập nhật
  useEffect(() => {
    if (!id) return;

    const fetchPostDetails = async () => {
      try {
        setIsLoading(true);
        const response = await getPostByIdService(id);

        if (response?.status === "SUCCESS") {
          const {
            name,
            description,
            expirationDate,
            amount,
            category,
            location,
            salary,
            jobLevel,
            workType,
            experience,
          } = response.data;

          const formattedDate = expirationDate
            ? new Date(expirationDate).toISOString().split("T")[0]
            : "";

          setInputValues({
            name: name || "",
            description_Markdown: description || "",
            status: "PENDING",
            expiration_date: formattedDate,
            amount: amount || 1,
            category: { id: category?.id || "" },
            location: { id: location?.id || "" },
            salary: { id: salary?.id || "" },
            jobLevel: { id: jobLevel?.id || "" },
            workType: { id: workType?.id || "" },
            experience: { id: experience?.id || "" },
            user: { id: userInfo.userId || "" },
            company: { id: userInfo.companyId || "" },
          });
        } else {
          toast.error(response?.message || "Không thể lấy dữ liệu bài đăng");
        }
      } catch (error) {
        toast.error("Đã xảy ra lỗi khi lấy dữ liệu bài đăng");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPostDetails();
  }, [id, userInfo.userId, userInfo.companyId]);

  // Xử lý thay đổi input text thông thường
  const handleInputChange = ({ target: { name, value } }) => {
    setInputValues((prev) => ({ ...prev, [name]: value }));
  };

  // Xử lý thay đổi cho input số lượng
  const handleAmountChange = ({ target: { value } }) => {
    const numValue = parseInt(value, 10);
    if (isNaN(numValue) || numValue < 1) return;

    setInputValues((prev) => ({ ...prev, amount: numValue }));
  };

  // Xử lý thay đổi cho các select (dropdown)
  const handleSelectChange = (name, value) => {
    setInputValues((prev) => ({
      ...prev,
      [name]: { id: value },
    }));
  };

  // Xử lý thay đổi cho Markdown Editor
  const handleMarkdownChange = (value) => {
    setInputValues((prev) => ({
      ...prev,
      description_Markdown: value || "",
    }));
  };

  // Xử lý lưu dữ liệu với validation ngày hết hạn
  const handleSave = async () => {
    if (!inputValues.name) {
      toast.error("Vui lòng nhập tên bài đăng");
      return;
    }

    if (!inputValues.description_Markdown) {
      toast.error("Vui lòng nhập mô tả bài đăng");
      return;
    }

    if (!inputValues.expiration_date) {
      toast.error("Vui lòng chọn ngày hết hạn");
      return;
    }

    // Validation ngày hết hạn
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Đặt giờ về 0 để so sánh chính xác ngày
    const expirationDate = new Date(inputValues.expiration_date);

    if (expirationDate <= today) {
      toast.error("Ngày hết hạn phải sau ngày hiện tại");
      return;
    }

    if (!inputValues.category.id) {
      toast.error("Vui lòng chọn danh mục");
      return;
    }

    if (!inputValues.company.id) {
      toast.error("Thông tin công ty không hợp lệ, vui lòng đăng nhập lại");
      return;
    }

    setIsLoading(true);

    try {
      const response = isActionAdd
        ? await createPostService(inputValues)
        : await updatePostService(id, inputValues);

      if (response?.status === "SUCCESS") {
        toast.success(
          isActionAdd
            ? "Tạo bài đăng thành công"
            : "Cập nhật bài đăng thành công"
        );

        if (isActionAdd) {
          setInputValues({
            name: "",
            description_Markdown: "",
            status: "PENDING",
            expiration_date: "",
            amount: 1,
            category: { id: "" },
            location: { id: "" },
            salary: { id: "" },
            jobLevel: { id: "" },
            workType: { id: "" },
            experience: { id: "" },
            user: { id: userInfo.userId || "" },
            company: { id: userInfo.companyId || "" },
          });
        }
      } else {
        console.log("Data:", inputValues);
        toast.error(response?.errMessage || "Đã xảy ra lỗi");
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi lưu dữ liệu");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="add-post-container">
      <Row>
        <Col md={12}>
          <Card className="main-card">
            <CardBody>
              <h4 className="card-title">
                {isActionAdd ? "THÊM MỚI BÀI ĐĂNG" : "CẬP NHẬT BÀI ĐĂNG"}
              </h4>
              <form className="post-form">
                <Card className="section-card mb-4">
                  <CardBody>
                    <h4 className="section-title">Thông tin cơ bản</h4>
                    <Row>
                      <Col md={6}>
                        <div className="form-group">
                          <label>
                            Tiêu đề bài đăng <span className="required">*</span>
                          </label>
                          <input
                            type="text"
                            value={inputValues.name}
                            name="name"
                            onChange={handleInputChange}
                            className="form-control"
                            placeholder="Nhập tiêu đề bài đăng"
                          />
                        </div>
                      </Col>
                      <Col md={3}>
                        <div className="form-group">
                          <label>
                            Ngày hết hạn <span className="required">*</span>
                          </label>
                          <input
                            type="date"
                            value={inputValues.expiration_date}
                            name="expiration_date"
                            onChange={handleInputChange}
                            className="form-control"
                          />
                        </div>
                      </Col>
                      <Col md={3}>
                        <div className="form-group">
                          <label>
                            Số lượng cần tuyển{" "}
                            <span className="required">*</span>
                          </label>
                          <input
                            type="number"
                            value={inputValues.amount}
                            name="amount"
                            onChange={handleAmountChange}
                            min="1"
                            className="form-control"
                            placeholder="Nhập số lượng cần tuyển"
                          />
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>

                <Card className="section-card mb-4">
                  <CardBody>
                    <h4 className="section-title">Phân loại</h4>
                    <Row>
                      <Col md={6}>
                        <div className="form-group">
                          <label>
                            Danh mục <span className="required">*</span>
                          </label>
                          <select
                            value={inputValues.category.id}
                            onChange={(e) =>
                              handleSelectChange("category", e.target.value)
                            }
                            className="form-control"
                          >
                            <option value="">-- Chọn danh mục --</option>
                            {categories.map((category) => (
                              <option key={category.id} value={category.id}>
                                {category.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="form-group">
                          <label>
                            Địa điểm <span className="required">*</span>
                          </label>
                          <select
                            value={inputValues.location.id}
                            onChange={(e) =>
                              handleSelectChange("location", e.target.value)
                            }
                            className="form-control"
                          >
                            <option value="">-- Chọn địa điểm --</option>
                            {locations.map((location) => (
                              <option key={location.id} value={location.id}>
                                {location.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="form-group">
                          <label>
                            Mức lương <span className="required">*</span>
                          </label>
                          <select
                            value={inputValues.salary.id}
                            onChange={(e) =>
                              handleSelectChange("salary", e.target.value)
                            }
                            className="form-control"
                          >
                            <option value="">-- Chọn mức lương --</option>
                            {salaries.map((salary) => (
                              <option key={salary.id} value={salary.id}>
                                {salary.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </Col>

                      <Col md={6}>
                        <div className="form-group">
                          <label>
                            Cấp bậc <span className="required">*</span>
                          </label>
                          <select
                            value={inputValues.jobLevel.id}
                            onChange={(e) =>
                              handleSelectChange("jobLevel", e.target.value)
                            }
                            className="form-control"
                          >
                            <option value="">-- Chọn cấp bậc --</option>
                            {jobLevels.map((level) => (
                              <option key={level.id} value={level.id}>
                                {level.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="form-group">
                          <label>
                            Loại công việc <span className="required">*</span>
                          </label>
                          <select
                            value={inputValues.workType.id}
                            onChange={(e) =>
                              handleSelectChange("workType", e.target.value)
                            }
                            className="form-control"
                          >
                            <option value="">-- Chọn loại công việc --</option>
                            {workTypes.map((type) => (
                              <option key={type.id} value={type.id}>
                                {type.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="form-group">
                          <label>
                            Kinh nghiệm <span className="required">*</span>
                          </label>
                          <select
                            value={inputValues.experience.id}
                            onChange={(e) =>
                              handleSelectChange("experience", e.target.value)
                            }
                            className="form-control"
                          >
                            <option value="">-- Chọn kinh nghiệm --</option>
                            {experiences.map((exp) => (
                              <option key={exp.id} value={exp.id}>
                                {exp.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>

                <Card className="section-card mb-4">
                  <CardBody>
                    <h4 className="section-title">Mô tả công việc</h4>
                    <div className="markdown-editor-container">
                      <MDEditor
                        value={inputValues.description_Markdown}
                        onChange={handleMarkdownChange}
                        height={400}
                        preview="edit"
                        previewOptions={{
                          style: { padding: "20px" },
                        }}
                      />
                    </div>
                  </CardBody>
                </Card>

                <div className="form-actions">
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={() => window.history.back()}
                  >
                    <i className="ti-arrow-left"></i> Quay lại
                  </button>
                  <button
                    type="button"
                    className="btn-save"
                    onClick={handleSave}
                  >
                    <i className="ti-save"></i>{" "}
                    {isActionAdd ? "Thêm mới" : "Cập nhật"}
                  </button>
                </div>
              </form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AddPost;
