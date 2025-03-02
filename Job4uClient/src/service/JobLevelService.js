import axios from "../axios";

const createJobLevelService = (data) => {
  return axios.post(`api/job-levels`, data);
};

const getAllJobLevelService = (data) => {
  return axios.get(`/api/job-levels`);
};

const UpdateJobLevelService = (data, id) => {
  return axios.put(`/api/job-levels/${id}`, data);
};

const DeleteJobLevelService = (id) => {
  return axios.delete(`/api/job-levels/${id}`);
};

export {
  createJobLevelService,
  getAllJobLevelService,
  UpdateJobLevelService,
  DeleteJobLevelService,
};
