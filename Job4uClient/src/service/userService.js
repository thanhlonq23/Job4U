import axios from "../axios";

//==================USER==========================//

const getAllUserService = ({ keyword = "", page = 0, size = 10 }) => {
  return axios.get(`/api/users`, {
    params: {
      keyword,
      page,
      size,
    },
  });
};

const getUserByIdService = (id) => {
  return axios.get(`/api/users/${id}`);
};

const getDetailUserById = (id) => {
  return axios.get(`/api/users/${id}`);
};

const getAllEmployeeService = (data) => {
  return axios.get(`/api/users/get-user-by-company-id`, {
    params: {
      id: data.id,
      page: data.page,
      size: data.size,
    },
  });
};

const updateUserService = (id) => {
  return axios.get(`/api/users/${id}`);
};

const getCompanyIdByIdService = (id) => {
  return axios.get(`/api/users/get-company-id/${id}`);
};

const createNewUser = (data) => {
  return axios.post(`/api/create-new-user`, data);
};

const terminateUserService = (id) => {
  return axios.put(`/api/users/terminate-user-by-id/${id}`);
};

const deleteUserService = (id) => {
  return axios.delete(`/api/users/${id}`);
};

const deleteEmployeeService = (id) => {
  return axios.delete(`/api/users/delete-employee-by-id/${id}`);
};

const getDetailPostByIdService = (id) => {
  return axios.get(`/api/posts/get-post-detail?id=${id}`);
};

export {
  getAllUserService,
  getUserByIdService,
  createNewUser,
  terminateUserService,
  deleteUserService,
  getCompanyIdByIdService,
  getDetailPostByIdService,
  updateUserService,
  getDetailUserById,
  getAllEmployeeService,
  deleteEmployeeService,
};
