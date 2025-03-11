import axios from "../axios";

const getAllRoleService = () => {
  return axios.get(`/api/roles`);
};

export { getAllRoleService };
