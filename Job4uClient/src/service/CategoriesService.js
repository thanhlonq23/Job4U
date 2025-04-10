import axios from "../axios";

const createCategoryService = (data) => {
  return axios.post(`api/categories`, data);
};

const getAllCategoryService = ({ page = 0, size = 10 }) => {
  return axios.get(`/api/categories/page`, {
    params: {
      page,
      size,
    },
  });
};

const searchCategoryService = ({ page = 0, size = 10, keyword = "" }) => {
  return axios.get(`/api/categories/page`, {
    params: {
      page,
      size,
      keyword,
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

const getTop5CategoriesByPostCount = async () => {
  try {
    const response = await axios.get("/api/categories/top-5-by-posts");
    return response;
  } catch (error) {
    console.error("Error fetching top categories:", error);
    throw error;
  }
};

export {
  createCategoryService,
  getAllCategoryService,
  updateCategoryService,
  deleteCategoryService,
  getCategoryByIdService,
  searchCategoryService,
  getTop5CategoriesByPostCount,
};
