import axios from "../axios";

const createCategoryService = (data) => {
  return axios.post(`api/categories`, data);
};

const getAllCategoryService = (data) => {
  return axios.get(`/api/categories`);
};

const getCategoryByIdService = (id) => {
  return axios.get(`/api/categories/${id}`);
};

const UpdateCategoryService = (data, id) => {
  return axios.put(`/api/categories/${id}`, data);
};

const DeleteCategoryService = (id) => {
  return axios.delete(`/api/categories/${id}`);
};

export {
  createCategoryService,
  getAllCategoryService,
  UpdateCategoryService,
  DeleteCategoryService,
  getCategoryByIdService,
};
