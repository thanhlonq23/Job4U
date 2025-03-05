import axios from "../axios";

const createSalaryService = (data) => {
  return axios.post(`api/salaries`, data);
};

const getAllSalaryService = ({ page = 0, size = 10 }) => {
  return axios.get(`/api/salaries`, {
    params: {
      page,
      size,
    },
  });
};

const UpdateSalaryService = (data, id) => {
  return axios.put(`/api/salaries/${id}`, data);
};

const DeleteSalaryService = (id) => {
  return axios.delete(`/api/salaries/${id}`);
};

export {
  createSalaryService,
  getAllSalaryService,
  UpdateSalaryService,
  DeleteSalaryService,
};
