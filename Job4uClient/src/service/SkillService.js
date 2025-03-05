import axios from "../axios";

const createSkillService = (data) => {
  return axios.post(`api/skills`, data);
};


const getAllSkillService = ({ page = 0, size = 10 }) => {
  return axios.get(`/api/skills`, {
    params: {
      page,
      size,
    },
  });
};

const UpdateSkillService = (data, id) => {
  return axios.put(`/api/skills/${id}`, data);
};

const DeleteSkillService = (id) => {
  return axios.delete(`/api/skills/${id}`);
};

export {
  createSkillService,
  getAllSkillService,
  UpdateSkillService,
  DeleteSkillService,
};
