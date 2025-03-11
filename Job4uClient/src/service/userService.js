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

const createNewUser = (data) => {
  return axios.post(`/api/create-new-user`, data);
};

const updateUserService = (id, data) => {
  return axios.put(`/api/users/${id}`, data);
};

const deleteUserService = (id) => {
  return axios.delete(`/api/users/${id}`);
};

export {
  getAllUserService,
  getUserByIdService,
  createNewUser,
  updateUserService,
  deleteUserService,
};
