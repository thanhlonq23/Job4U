import axios from "../axios";

// Analytics Admin Page services
const getJobStatisticsService = () => {
  return axios.get(`/api/analytics/jobs`);
};

const getDashboardSummaryService = () => {
  return axios.get(`/api/analytics/dashboard`);
};

// Analytics Employer Page services
const getCVStatisticsService = (companyId) => {
  return axios.get(`/api/analytics/cvs`, {
    params: {
      companyId,
    },
  });
};

export {
  getJobStatisticsService,
  getCVStatisticsService,
  getDashboardSummaryService,
};
