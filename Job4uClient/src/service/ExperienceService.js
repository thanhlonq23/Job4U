import axios from "../axios";

const createExperienceService = (data) => {
  return axios.post(`api/experiences`, data);
};

const getAllExperienceService = (data) => {
  return axios.get(`/api/experiences`);
};

const UpdateExperienceService = (data, id) => {
  return axios.put(`/api/experiences/${id}`, data);
};

const DeleteExperienceService = (id) => {
  return axios.delete(`/api/experiences/${id}`);
};

export {
  createExperienceService,
  getAllExperienceService,
  UpdateExperienceService,
  DeleteExperienceService,
};
