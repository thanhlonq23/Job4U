import React, { useState, useEffect } from "react";
import {
  getAllCategoriesService,
  getAllLocationsService,
  getAllSalariesService,
  getAllJobLevelsService,
  getAllWorkTypesService,
  getAllExperiencesService,
} from "../../../service/DataService";

const LeftBar = ({
  selectedCategory,
  selectedLocation,
  selectedWorkTypes,
  selectedJobLevels,
  selectedExperiences,
  selectedSalaries,
  recieveJobType,
  recieveLocation,
  worktype,
  recieveJobLevel,
  recieveExp,
  recieveSalary,
}) => {
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [salaries, setSalaries] = useState([]);
  const [jobLevels, setJobLevels] = useState([]);
  const [workTypes, setWorkTypes] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Khởi tạo tất cả arrays là mảng rỗng để tránh undefined
        setCategories([]);
        setLocations([]);
        setSalaries([]);
        setJobLevels([]);
        setWorkTypes([]);
        setExperiences([]);

        // Fetch all filter data in parallel
        const [
          categoriesRes,
          locationsRes,
          salariesRes,
          jobLevelsRes,
          workTypesRes,
          experiencesRes,
        ] = await Promise.all([
          getAllCategoriesService(),
          getAllLocationsService(),
          getAllSalariesService(),
          getAllJobLevelsService(),
          getAllWorkTypesService(),
          getAllExperiencesService(),
        ]);

        // Process categories
        if (categoriesRes?.status === "SUCCESS" && categoriesRes?.data) {
          setCategories(categoriesRes.data || []);
        }

        // Process locations
        if (locationsRes?.status === "SUCCESS" && locationsRes?.data) {
          setLocations(locationsRes.data || []);
        }

        // Process salaries
        if (salariesRes?.status === "SUCCESS" && salariesRes?.data) {
          setSalaries(salariesRes.data || []);
        }

        // Process job levels
        if (jobLevelsRes?.status === "SUCCESS" && jobLevelsRes?.data) {
          setJobLevels(jobLevelsRes.data || []);
        }

        // Process work types
        if (workTypesRes?.status === "SUCCESS" && workTypesRes?.data) {
          setWorkTypes(workTypesRes.data || []);
        }

        // Process experiences
        if (experiencesRes?.status === "SUCCESS" && experiencesRes?.data) {
          setExperiences(experiencesRes.data || []);
        }
      } catch (error) {
        console.error("Error fetching filter data:", error);
        setError("Không thể tải dữ liệu bộ lọc. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const resetFilters = () => {
    recieveJobType("");
    recieveLocation("");
    recieveJobLevel([]);
    worktype([]);
    recieveExp([]);
    recieveSalary([]);
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Đang tải bộ lọc...</span>
        </div>
        <p className="mt-2">Đang tải bộ lọc...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
        <button
          className="btn btn-outline-danger btn-sm mt-2"
          onClick={() => window.location.reload()}
        >
          Tải lại
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="job-category-listing mb-50">
        {/* <!-- single one --> */}
        <div className="single-listing">
          <div className="small-section-tittle2">
            <h4>Lĩnh vực</h4>
          </div>
          {/* <!-- Select job items start --> */}
          <div className="select-job-items2">
            <select
              name="select"
              value={selectedCategory || ""}
              onChange={(e) => recieveJobType(e.target.value)}
              className="form-control"
            >
              <option value="">Tất cả</option>
              {Array.isArray(categories) &&
                categories.map((category) => (
                  <option value={category.id} key={category.id}>
                    {category.name}
                  </option>
                ))}
            </select>
          </div>
          {/* <!--  Select job items End--> */}
          {/* <!-- select-Categories start --> */}
          <div className="select-Categories pt-80 pb-50">
            <div className="small-section-tittle2">
              <h4>Hình thức làm việc</h4>
            </div>
            {Array.isArray(workTypes) &&
              workTypes.map((workType) => (
                <label className="container" key={workType.id}>
                  {workType.name}
                  <input
                    type="checkbox"
                    value={workType.id}
                    checked={selectedWorkTypes?.includes(
                      workType.id.toString()
                    )}
                    onChange={(e) => worktype(e.target.value)}
                  />
                  <span className="checkmark"></span>
                </label>
              ))}
          </div>
          {/* <!-- select-Categories End --> */}
        </div>
        {/* <!-- single two --> */}
        <div className="single-listing">
          <div className="small-section-tittle2">
            <h4>Vị trí</h4>
          </div>
          {/* <!-- Select job items start --> */}
          <div className="select-job-items2">
            <select
              name="select"
              value={selectedLocation || ""}
              onChange={(e) => recieveLocation(e.target.value)}
              className="form-control"
            >
              <option value="">Tất cả</option>
              {Array.isArray(locations) &&
                locations.map((location) => (
                  <option value={location.id} key={location.id}>
                    {location.name}
                  </option>
                ))}
            </select>
          </div>
          {/* <!--  Select job items End--> */}
          {/* <!-- select-Categories start --> */}
          <div className="select-Categories pt-80 pb-50">
            <div className="small-section-tittle2">
              <h4>Kinh nghiệm làm việc</h4>
            </div>
            {Array.isArray(experiences) &&
              experiences.map((experience) => (
                <label className="container" key={experience.id}>
                  {experience.name}
                  <input
                    type="checkbox"
                    value={experience.id}
                    checked={selectedExperiences?.includes(
                      experience.id.toString()
                    )}
                    onChange={(e) => recieveExp(e.target.value)}
                  />
                  <span className="checkmark"></span>
                </label>
              ))}
          </div>
          {/* <!-- select-Categories End --> */}
        </div>
        {/* <!-- single three --> */}
        <div className="single-listing">
          {/* <!-- select-Categories start --> */}
          <div className="select-Categories pb-50">
            <div className="small-section-tittle2">
              <h4>Cấp bậc</h4>
            </div>
            {Array.isArray(jobLevels) &&
              jobLevels.map((jobLevel) => (
                <label className="container" key={jobLevel.id}>
                  {jobLevel.name}
                  <input
                    type="checkbox"
                    value={jobLevel.id}
                    checked={selectedJobLevels?.includes(
                      jobLevel.id.toString()
                    )}
                    onChange={(e) => recieveJobLevel(e.target.value)}
                  />
                  <span className="checkmark"></span>
                </label>
              ))}
          </div>
          {/* <!-- select-Categories End --> */}
        </div>
        <div className="single-listing">
          {/* <!-- select-Categories start --> */}
          <div className="select-Categories pb-50">
            <div className="small-section-tittle2">
              <h4>Lương bổng</h4>
            </div>
            {Array.isArray(salaries) &&
              salaries.map((salary) => (
                <label className="container" key={salary.id}>
                  {salary.name}
                  <input
                    type="checkbox"
                    value={salary.id}
                    checked={selectedSalaries?.includes(salary.id.toString())}
                    onChange={(e) => recieveSalary(e.target.value)}
                  />
                  <span className="checkmark"></span>
                </label>
              ))}
          </div>
        </div>

        {/* Filter reset button */}
        <div className="single-listing mt-4">
          <button className="btn btn-secondary w-100" onClick={resetFilters}>
            <i className="fas fa-sync-alt mr-2"></i>
            Đặt lại
          </button>
        </div>
      </div>
    </>
  );
};

export default LeftBar;
