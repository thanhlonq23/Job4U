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
const getAllListCvByPostService = (data) => {
  return axios.get(
    `/api/cv/get-all-list-cv-by-post?limit=${data.limit}&offset=${data.offset}&postId=${data.postId}`
  );
};
const getDetailCvService = (id) => {
  return axios.get(`/api/cv/get-detail-cv-by-id?cvId=${id}`);
};
const getAllListCvByUserIdService = (data) => {
  return axios.get(
    `/api/cv/get-all-cv-by-userId?limit=${data.limit}&offset=${data.offset}&userId=${data.userId}`
  );
};
export {
  createNewCv,
  getAllListCvByPostService,
  getDetailCvService,
  getAllListCvByUserIdService,
};
