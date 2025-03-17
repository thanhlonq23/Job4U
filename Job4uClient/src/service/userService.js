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
//fdfsdfsd
const getDetailUserById = (id) => {
  return axios.get(`/api/users/${id}`);
};

const UpdateUserService = (id) => {
  return axios.get(`/api/users/${id}`);
};

//fdsfsdfdsfsd

const getCompanyIdByIdService = (id) => {
  return axios.get(`/api/users/get-company-id/${id}`);
};

const createNewUser = (data) => {
  return axios.post(`/api/create-new-user`, data);
};

const updateUserService = (id, companyId) => {
  return axios.put(`/api/users/update-company`, null, {
    params: {
      userId: id,
      companyId: companyId,
    },
  });
};

const deleteUserService = (id) => {
  return axios.delete(`/api/users/${id}`);
};

const getDetailPostByIdService = (id) => {
  return axios.get(`/api/posts/get-post-detail?id=${id}`);
};

export {
  getAllUserService,
  getUserByIdService,
  createNewUser,
  updateUserService,
  deleteUserService,
  getCompanyIdByIdService,
  getDetailPostByIdService,
  //dsadas
  UpdateUserService,
  getDetailUserById,
};
