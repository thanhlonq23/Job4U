import axios from "../axios";

const createSalaryService = (data) => {
  return axios.post(`api/salaries`, data);
};

const getAllSalaryService = ({ page = 0, size = 10 }) => {
  return axios.get(`/api/salaries/page`, {
    params: {
      page,
      size,
    },
  });
};

const getSalaryByIdService = (id) => {
  return axios.get(`/api/salaries/${id}`);
};

const updateSalaryService = (data, id) => {
  return axios.put(`/api/salaries/${id}`, data);
};

const deleteSalaryService = (id) => {
  return axios.delete(`/api/salaries/${id}`);
};

export {
  createSalaryService,
  getAllSalaryService,
  updateSalaryService,
  deleteSalaryService,
  getSalaryByIdService,
};
