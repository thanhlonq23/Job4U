import axios from "../axios";

const createExperienceService = (data) => {
  return axios.post(`api/experiences`, data);
};

const getAllExperienceService = ({ page = 0, size = 10 }) => {
  return axios.get(`/api/experiences`, {
    params: {
      page,
      size,
    },
  });
};

const getExperienceByIdService = (id) => {
  return axios.get(`/api/experiences/${id}`);
};

const updateExperienceService = (data, id) => {
  return axios.put(`/api/experiences/${id}`, data);
};

const deleteExperienceService = (id) => {
  return axios.delete(`/api/experiences/${id}`);
};

export {
  createExperienceService,
  getAllExperienceService,
  updateExperienceService,
  deleteExperienceService,
  getExperienceByIdService,
};
