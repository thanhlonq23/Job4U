import axios from "../axios";

const createPostService = (data) => {
  return axios.post(`api/posts`, data);
};

const getAllPostService = ({
  page = 0,
  size = 10,
  status,
}) => {
  return axios.get(`/api/posts`, {
    params: {
      page,
      size,
      status,
    },
  });
};


const getPostByCompanyIdService = ({
  page = 0,
  size = 10,
  companyId,
  status,
}) => {
  return axios.get(`/api/posts/company`, {
    params: {
      page,
      size,
      companyId,
      status,
    },
  });
};

const updatePostService = (id, data) => {
  return axios.put(`/api/posts/${id}`, data);
};

const searchPostService = ({ page = 0, size = 10, keyword = "" }) => {
  return axios.get(`/api/posts/search`, {
    params: {
      page,
      size,
      keyword,
    },
  });
};

const getPostByIdService = (id) => {
  return axios.get(`/api/posts/get-by-id`, {
    params: {
      id,
    },
  });
};

const getCategoryByIdService = (id) => {
  return axios.get(`/api/posts/${id}`);
};

export {
  updatePostService,
  createPostService,
  getPostByCompanyIdService,
  getAllPostService,
  getPostByIdService,
};
