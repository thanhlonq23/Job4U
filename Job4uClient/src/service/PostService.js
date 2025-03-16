import axios from "../axios"; // Đảm bảo import axios instance đã cấu hình interceptor

const createPostService = (data) => {
  return axios.post(`api/posts`, data);
};

const getAllPostService = ({ page = 0, size = 10, status }) => {
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

// Cập nhật searchPostService để hỗ trợ tất cả tham số
const searchPostService = ({
  page = 0,
  size = 10,
  keyword = "",
  categoryId = "",
  locationId = "",
  workTypeIds = [],
  jobLevelIds = [],
  experienceIds = [],
  salaryIds = [],
  sortBy = "createdAt",
  direction = "desc",
}) => {
  return axios.get(`/api/posts/search`, {
    params: {
      page,
      size,
      keyword,
      categoryId: categoryId || undefined, // Nếu rỗng thì gửi undefined
      locationId: locationId || undefined,
      workTypeIds: workTypeIds.length > 0 ? workTypeIds.join(",") : undefined,
      jobLevelIds: jobLevelIds.length > 0 ? jobLevelIds.join(",") : undefined,
      experienceIds: experienceIds.length > 0 ? experienceIds.join(",") : undefined,
      salaryIds: salaryIds.length > 0 ? salaryIds.join(",") : undefined,
      sortBy,
      direction,
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

const updatePostStatusService = ({ id, status }) => {
  return axios.put(
    `/api/posts/update-status`,
    {},
    {
      params: { id, status },
    }
  );
};

export {
  updatePostService,
  createPostService,
  getPostByCompanyIdService,
  getAllPostService,
  getPostByIdService,
  updatePostStatusService,
  searchPostService, // Export hàm đã cập nhật
};