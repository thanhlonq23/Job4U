import axios from "../axios";

const createCategoryService = (data) => {
  return axios.post(`api/categories`, data);
};

const getAllCategoryService = ({ page = 0, size = 10 }) => {
  return axios.get(`/api/categories`, {
    params: {
      page,
      size,
    },
  });
};

const getCategoryByIdService = (id) => {
  return axios.get(`/api/categories/${id}`);
};

const updateCategoryService = (data, id) => {
  return axios.put(`/api/categories/${id}`, data);
};

const deleteCategoryService = (id) => {
  return axios.delete(`/api/categories/${id}`);
};

export {
  createCategoryService,
  getAllCategoryService,
  updateCategoryService,
  deleteCategoryService,
  getCategoryByIdService,
};
