import axios from "../axios";

const createJobLevelService = (data) => {
  return axios.post(`api/job-levels`, data);
};

const getAllJobLevelService = ({ page = 0, size = 10 }) => {
  return axios.get(`/api/job-levels/page`, {
    params: {
      page,
      size,
    },
  });
};

const getJobLevelByIdService = (id) => {
  return axios.get(`/api/job-levels/${id}`);
};

const updateJobLevelService = (data, id) => {
  return axios.put(`/api/job-levels/${id}`, data);
};

const deleteJobLevelService = (id) => {
  return axios.delete(`/api/job-levels/${id}`);
};

export {
  createJobLevelService,
  getAllJobLevelService,
  updateJobLevelService,
  deleteJobLevelService,
  getJobLevelByIdService,
};
