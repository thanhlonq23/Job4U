import axios from "../axios";

const handleLoginService = (data) => {
  return axios.post(`/api/auth/login`, data);
};

const handleRegisterService = (data) => {
  return axios.post(`/api/auth/register`, data);
};
export { handleLoginService, handleRegisterService };
