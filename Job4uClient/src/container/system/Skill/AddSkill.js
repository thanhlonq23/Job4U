import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Spinner, Modal } from "reactstrap";
import "../../../components/modal/modal.css";
import {
  createSkillService,
  getSkillByIdService,
  updateSkillService,
} from "../../../service/SkillService";

import { searchCategoryService } from "../../../service/CategoriesService";

const AddSkill = () => {
  const [isActionADD, setIsActionADD] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();
  const [dataReady, setDataReady] = useState(false);

  const [inputValues, setInputValues] = useState({
    name: "",
    category: {
      id: "",
    },
  });

  const [categories, setCategories] = useState([]); // Danh sách category
  const [searchKeyword, setSearchKeyword] = useState(""); // Từ khóa nhập vào
  const [debouncedKeyword, setDebouncedKeyword] = useState(""); // Từ khóa debounce

  // Lấy chi tiết kỹ năng nếu có ID
  useEffect(() => {
    if (id) {
      const fetchDetailSkill = async () => {
        setIsActionADD(false);
        try {
          setIsLoading(true);
          const response = await getSkillByIdService(id);
          if (response?.status === "SUCCESS") {
            setInputValues({
              name: response.data.name || "",
              category: {
                id: response.data.category?.id || "",
              },
            });
          } else {
            toast.error(response?.errMessage || "Lỗi khi tải dữ liệu!");
          }
        } catch (error) {
          toast.error("Không thể tải dữ liệu!");
          console.error("Error fetching skill details:", error);
        } finally {
          setDataReady(true);
          setIsLoading(false);
        }
      };
      fetchDetailSkill();
    } else {
      setDataReady(true);
    }
  }, [id]);

  // Debounce logic cho tìm kiếm
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedKeyword(searchKeyword);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchKeyword]);

  // Gọi API tìm kiếm khi `debouncedKeyword` thay đổi
  useEffect(() => {
    const fetchCategories = async () => {
      if (!debouncedKeyword.trim()) {
        setCategories([]);
        return;
      }

      try {
        setIsLoading(true);
        const response = await searchCategoryService({
          page: 0,
          size: 10,
          keyword: debouncedKeyword.trim(),
        });

        if (response?.status === "SUCCESS" && response.data?.content) {
          setCategories(response.data.content); // Gán danh sách từ API
        } else {
          setCategories([]); // Không có dữ liệu, gán mảng trống
          toast.warn("Không tìm thấy lĩnh vực phù hợp!");
        }
      } catch (error) {
        toast.error("Đã xảy ra lỗi khi tìm kiếm!");
        console.error("Error fetching categories:", error);
        setCategories([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [debouncedKeyword]);

  const handleOnChange = (event) => {
    const { name, value } = event.target;
    if (name === "category") {
      setInputValues((prev) => ({
        ...prev,
        category: { ...prev.category, id: value },
      }));
    } else {
      setInputValues((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSaveSkill = async () => {
    setIsLoading(true);

    const payload = {
      name: inputValues.name,
      category: {
        id: inputValues.category.id,
      },
    };

    try {
      let response;

      if (isActionADD) {
        response = await createSkillService(payload);
      } else {
        response = await updateSkillService(payload, id);
      }

      if (response?.status === "SUCCESS") {
        toast.success(
          isActionADD
            ? "Thêm kỹ năng thành công!"
            : "Cập nhật kỹ năng thành công!"
        );

        if (isActionADD) {
          setInputValues({
            name: "",
            category: {
              id: "",
            },
          });
        }
      } else {
        toast.error(response?.errMessage || "Đã xảy ra lỗi!");
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi gửi dữ liệu!");
      console.error("Error saving skill:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="add-skill">
      <div className="col-12 grid-margin">
        <div className="card">
          <div className="card-body">
            <h4 className="card-title">
              {isActionADD ? "THÊM MỚI KỸ NĂNG" : "CẬP NHẬT KỸ NĂNG"}
            </h4>
            <form className="form-sample">
              {/* Input tên kỹ năng */}
              <div className="form-group row">
                <label className="col-sm-2 col-form-label">Tên kỹ năng</label>
                <div className="col-sm-9">
                  <input
                    type="text"
                    value={dataReady ? inputValues.name : ""}
                    name="name"
                    onChange={handleOnChange}
                    className="form-control"
                    placeholder="Nhập tên kỹ năng"
                    disabled={!dataReady || isLoading}
                  />
                </div>
              </div>

              {/* Tìm kiếm lĩnh vực */}
              <div className="form-group row">
                <label className="col-sm-2 col-form-label">
                  Tìm kiếm lĩnh vực
                </label>
                <div className="col-sm-9">
                  <input
                    type="text"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    className="form-control"
                    placeholder="Nhập từ khóa tìm kiếm"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Chọn lĩnh vực */}
              <div className="form-group row">
                <label className="col-sm-2 col-form-label">Chọn lĩnh vực</label>
                <div className="col-sm-9">
                  <select
                    name="category"
                    value={inputValues.category.id}
                    onChange={handleOnChange}
                    className="form-control"
                    disabled={!dataReady || isLoading}
                  >
                    <option value="">Chọn lĩnh vực</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Button lưu */}
              <button
                type="button"
                className="btn btn-primary mr-2"
                onClick={handleSaveSkill}
                style={{ marginLeft: "90%" }}
                disabled={isLoading}
              >
                <i className="ti-file btn1-icon-prepend"></i>
                {isLoading ? "Đang lưu..." : "Lưu"}
              </button>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AddSkill;
