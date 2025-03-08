import axios from "../axios";

const handleLoginService = (data) => {
  return axios.post(`/api/auth/login`, data);
};

export { handleLoginService };
