import axios from "../axios";

const createSkillService = (data) => {
  return axios.post(`api/skills`, data);
};

const getAllSkillService = ({ page = 0, size = 10 }) => {
  return axios.get(`/api/skills`, {
    params: {
      page,
      size,
    },
  });
};

const getSkillByIdService = (id) => {
  return axios.get(`/api/job-levels/${id}`);
};

const updateSkillService = (data, id) => {
  return axios.put(`/api/skills/${id}`, data);
};

const deleteSkillService = (id) => {
  return axios.delete(`/api/skills/${id}`);
};

export {
  createSkillService,
  getAllSkillService,
  updateSkillService,
  deleteSkillService,
  getSkillByIdService,
};
