import axios from "../axios";

const createWorkTypeService = (data) => {
  return axios.post(`api/work-types`, data);
};

const getAllWorkTypeService = (data) => {
  return axios.get(`/api/work-types`);
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
};
