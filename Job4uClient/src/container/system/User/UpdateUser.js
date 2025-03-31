import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Spinner, Modal } from "reactstrap";

import {
  getUserByIdService,
  updateUserService,
} from "../../../service/UserService";
import { getAllRoleService } from "../../../service/RoleService";
import DatePicker from "../../../components/input/DatePicker";
import moment from "moment";
import "moment/locale/vi";
import "../../../components/modal/modal.css";

const UpdateUser = () => {
  const { id } = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const [birthday, setBirthday] = useState("");
  const [isChangeDate, setIsChangeDate] = useState(false);
  const [inputValues, setInputValues] = useState({
    email: "",
    first_name: "",
    last_name: "",
    address: "",
    dob: "",
    gender: "",
    role: "",
    status: "",
  });
  const [roleOptions, setRoleOptions] = useState([]);

  const genderOptions = [
    { code: "MALE", value: "Nam" },
    { code: "FEMALE", value: "Nữ" },
    { code: "OTHER", value: "Khác" },
  ];

  // Mapping của role từ tiếng Anh sang tiếng Việt
  const roleTranslations = {
    ADMIN: "Quản trị viên",
    JOB_SEEKER: "Người dùng",
    EMPLOYER_OWNER: "Quản lý",
    EMPLOYER_STAFF: "Nhân viên",
  };

  // Trạng thái được định nghĩa tĩnh
  const statusOptions = [
    { code: "ACTIVE", value: "Đang hoạt động" },
    { code: "INACTIVE", value: "Không hoạt động" },
    { code: "SUSPENDED", value: "Tạm đình chỉ" },
    { code: "BANNED", value: "Cấm" },
  ];

  useEffect(() => {
    if (!id) return;

    const fetchUserDetails = async () => {
      try {
        const response = await getUserByIdService(id);
        if (response?.status === "SUCCESS") {
          const userData = response.data;
          setInputValues({
            email: userData.email || "",
            first_name: userData.first_name || "",
            last_name: userData.last_name || "",
            address: userData.address || "",
            dob: userData.dob || "",
            gender: userData.gender || "",
            role: userData.role?.name || "",
            status: userData.status || "",
          });

          if (userData.dob) {
            setBirthday(moment(userData.dob).locale("vi").format("DD/MM/YYYY"));
          }
        } else {
          toast.error(response?.message || "Không thể lấy dữ liệu người dùng");
        }
      } catch (error) {
        toast.error("Đã xảy ra lỗi khi lấy dữ liệu người dùng");
      }
    };

    const fetchRoleOptions = async () => {
      try {
        const response = await getAllRoleService();
        if (response?.status === "SUCCESS") {
          const roles = response.data.map((role) => ({
            id: role.id,
            code: role.name,
            value: roleTranslations[role.name] || role.name,
          }));
          setRoleOptions(roles);
        } else {
          toast.error(response?.message || "Không thể lấy danh sách vai trò");
        }
      } catch (error) {
        toast.error("Đã xảy ra lỗi khi lấy danh sách vai trò");
      }
    };

    fetchUserDetails();
    fetchRoleOptions();
  }, [id]);

  const handleInputChange = ({ target: { name, value } }) => {
    setInputValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleOnChangeDatePicker = (date) => {
    setBirthday(date[0]);
    setIsChangeDate(true);
  };

  const handleSave = async () => {
    setIsLoading(true);

    try {
      const payload = {
        address: inputValues.address,
        dob: isChangeDate
          ? moment(birthday).format("YYYY-MM-DD HH:mm:ss")
          : moment(inputValues.dob).format("YYYY-MM-DD HH:mm:ss"),
        email: inputValues.email,
        first_name: inputValues.first_name,
        gender: inputValues.gender,
        last_name: inputValues.last_name,
        role: {
          id:
            roleOptions.find((role) => role.code === inputValues.role)?.id ||
            "",
        },
        status: inputValues.status,
      };

      console.log("Payload gửi đi:", payload);

      const response = await updateUserService(id, payload);

      if (response?.status === "SUCCESS") {
        toast.success("Cập nhật người dùng thành công");
      } else {
        toast.error(response?.message || "Đã xảy ra lỗi khi cập nhật");
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi lưu dữ liệu");
    } finally {
      setIsLoading(false);
    }
  };

  const renderFormGroup = (
    label,
    name,
    value,
    onChange,
    type = "text",
    options
  ) => (
    <div className="col-md-6">
      <div className="form-group">
        <label>{label}</label>
        {options ? (
          <select
            className="form-control"
            name={name}
            value={value}
            onChange={onChange}
            style={{ color: "#6c757d" }}
          >
            <option value="" disabled>
              -- Chọn --
            </option>
            {options.map((item, index) => (
              <option key={index} value={item.code}>
                {item.value}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            className="form-control"
            name={name}
            value={value}
            onChange={onChange}
          />
        )}
      </div>
    </div>
  );

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-body">
          <h4 className="card-title mb-4">CẬP NHẬT THÔNG TIN NGƯỜI DÙNG</h4>
          {isLoading ? (
            <div className="text-center">
              <Spinner />
              <p>Đang tải dữ liệu...</p>
            </div>
          ) : (
            <form>
              <div className="row">
                {renderFormGroup(
                  "Họ",
                  "first_name",
                  inputValues.first_name,
                  handleInputChange
                )}
                {renderFormGroup(
                  "Tên",
                  "last_name",
                  inputValues.last_name,
                  handleInputChange
                )}
              </div>
              <div className="row">
                {renderFormGroup(
                  "Email",
                  "email",
                  inputValues.email,
                  handleInputChange,
                  "email"
                )}
                {renderFormGroup(
                  "Trạng thái",
                  "status",
                  inputValues.status,
                  handleInputChange,
                  "text",
                  statusOptions
                )}
              </div>
              <div className="row">
                {renderFormGroup(
                  "Địa chỉ",
                  "address",
                  inputValues.address,
                  handleInputChange
                )}
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Ngày sinh</label>
                    <DatePicker
                      className="form-control"
                      onChange={handleOnChangeDatePicker}
                      value={birthday}
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                {renderFormGroup(
                  "Giới tính",
                  "gender",
                  inputValues.gender,
                  handleInputChange,
                  "text",
                  genderOptions
                )}
                {renderFormGroup(
                  "Vai trò",
                  "role",
                  inputValues.role,
                  handleInputChange,
                  "text",
                  roleOptions
                )}
              </div>
              <div className="text-right">
                <button
                  type="button"
                  className="btn btn-primary mr-2"
                  onClick={handleSave}
                >
                  Lưu
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {isLoading && (
        <Modal isOpen centered>
          <div className="text-center p-4">
            <Spinner />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default UpdateUser;
