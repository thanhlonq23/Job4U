import axios from "../axios";

const handleLoginService = (data) => {
  return axios.post(`/api/auth/login`, data);
};

const handleRegisterService = (data) => {
  return axios.post(`/api/auth/register`, data);
};

const sendOTPService = (email) => {
  return axios.post(`/api/auth/send-otp`, { email });
};

const verifyOTPService = (email, otp) => {
  return axios.post(`/api/auth/verify-otp`, { email, otp });
};

export { handleLoginService, handleRegisterService, sendOTPService, verifyOTPService };