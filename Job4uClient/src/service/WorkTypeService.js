import axios from "../axios";

const createWorkTypeService = (data) => {
  return axios.post(`api/work-types`, data);
};

const getAllWorkTypeService = ({ page = 0, size = 10 }) => {
  return axios.get(`/api/work-types/page`, {
    params: {
      page, // Số trang (bắt đầu từ 0)
      size, // Số lượng phần tử mỗi trang
    },
  });
};


const getWorkTypeByIdService = (id) => {
  return axios.get(`/api/work-types/${id}`);
};

const UpdateWorkTypeService = (data, id) => {
  return axios.put(`/api/work-types/${id}`, data);
};

const DeleteWorkTypeService = (id) => {
  return axios.delete(`/api/work-types/${id}`);
};

export {
  createWorkTypeService,
  getAllWorkTypeService,
  UpdateWorkTypeService,
  DeleteWorkTypeService,
  getWorkTypeByIdService,
};
