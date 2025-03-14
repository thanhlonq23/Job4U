import axios from "../axios";

const getAllCategoriesService = () => {
  return axios.get(`/api/categories`);
};
const getAllLocationsService = () => {
  return axios.get(`/api/locations`);
};
const getAllSalariesService = () => {
  return axios.get(`/api/salaries`);
};
const getAllJobLevelsService = () => {
  return axios.get(`/api/job-levels`);
};
const getAllWorkTypesService = () => {
  return axios.get(`/api/work-types`);
};
const getAllExperiencesService = () => {
  return axios.get(`/api/experiences`);
};

export {
  getAllCategoriesService,
  getAllLocationsService,
  getAllSalariesService,
  getAllJobLevelsService,
  getAllWorkTypesService,
  getAllExperiencesService,
};
