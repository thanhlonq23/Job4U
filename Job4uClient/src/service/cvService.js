import axios from "../axios";

//==================CV==========================//
const createNewCv = (data) => {
  // Tạo FormData object để gửi dữ liệu dạng multipart/form-data
  const formData = new FormData();

  // Thêm các trường dữ liệu vào formData
  formData.append("userId", data.userId);
  formData.append("postId", data.postId);
  formData.append("file", data.file);

  // Thêm description
  if (data.description) {
    formData.append("description", data.description);
  }

  // Gửi request với content-type tự động được set là multipart/form-data
  return axios.post("/api/cv/create", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

const getAllListCvByUserIdService = (data) => {
  return axios.get("/api/cv/get-all-cv-by-userId", {
    params: {
      userId: data.userId,
      page: data.page,
      size: data.size,
    },
  });
};

const getAllListCvByPostIdService = ({
  page = 0,
  size = 10,
  postId,
  keyword = "",
}) => {
  return axios.get(`/api/cv/page`, {
    params: {
      postId: postId,
      keyword: keyword,
      page: page,
      size: size,
      sort: "id,desc",
    },
  });
};

const getDetailCvService = (id) => {
  return axios.get("/api/cv/get-detail-cv-by-id", {
    params: {
      id: id,
    },
  });
};

export {
  createNewCv,
  getAllListCvByPostIdService,
  getDetailCvService,
  getAllListCvByUserIdService,
};
