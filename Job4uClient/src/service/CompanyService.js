import axios from "../axios";

const createCompanyService = (data) => {
  return axios.post(`api/companies`, data);
};

const getAllCompanyService = ({ page = 0, size = 10 }) => {
  return axios.get(`/api/companies`, {
    params: {
      page,
      size,
    },
  });
};

const searchCompanyService = ({ page = 0, size = 10, keyword = "" }) => {
  return axios.get(`/api/companies/search`, {
    params: {
      page,
      size,
      keyword,
    },
  });
};

const getCompanyByIdService = (id) => {
  return axios.get(`/api/companies/${id}`);
};

const getCompanyStatusByIdService = (id) => {
  return axios.get(`/api/companies/company-status`, {
    params: {
      id,
    },
  });
};

const updateCompanyService = (id, data) => {
  return axios.put(`/api/companies/${id}`, data);
};

const deleteCompanyService = (id) => {
  return axios.delete(`/api/companies/${id}`);
};

export {
  createCompanyService,
  getAllCompanyService,
  updateCompanyService,
  deleteCompanyService,
  getCompanyByIdService,
  searchCompanyService,
  getCompanyStatusByIdService,
};
