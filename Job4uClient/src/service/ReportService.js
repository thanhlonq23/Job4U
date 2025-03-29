const getSkillDemandService = async (categoryId) => {
  try {
    const url = new URL("http://localhost:8088/api/analytics/skill-demand");
    if (categoryId) {
      url.searchParams.append("categoryId", categoryId);
    }

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching skill demand:", error);
    throw error;
  }
};

const getApplicationTrendService = async () => {
  try {
    const response = await fetch(
      `http://localhost:8088/api/analytics/application-trends`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching application trends:", error);
    throw error;
  }
};

export { getSkillDemandService, getApplicationTrendService };
