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
  resetFilters,
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

        if (categoriesRes?.status === "SUCCESS")
          setCategories(categoriesRes.data || []);
        if (locationsRes?.status === "SUCCESS")
          setLocations(locationsRes.data || []);
        if (salariesRes?.status === "SUCCESS")
          setSalaries(salariesRes.data || []);
        if (jobLevelsRes?.status === "SUCCESS")
          setJobLevels(jobLevelsRes.data || []);
        if (workTypesRes?.status === "SUCCESS")
          setWorkTypes(workTypesRes.data || []);
        if (experiencesRes?.status === "SUCCESS")
          setExperiences(experiencesRes.data || []);
      } catch (error) {
        console.error("Error fetching filter data:", error);
        setError("Không thể tải dữ liệu bộ lọc. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

  const selectedCategoryName = selectedCategory
    ? categories.find((c) => c.id.toString() === selectedCategory)?.name ||
      "Đang chọn..."
    : "Tất cả";

  const selectedLocationName = selectedLocation
    ? locations.find((l) => l.id.toString() === selectedLocation)?.name ||
      "Đang chọn..."
    : "Tất cả";

  return (
    <div className="job-category-listing mb-50">
      <div className="single-listing">
        <div className="small-section-tittle2">
          <h4>Lĩnh vực</h4>
        </div>
        <div className="custom-dropdown mb-4">
          <button
            className="btn btn-light dropdown-toggle w-100 d-flex justify-content-between align-items-center"
            type="button"
            id="dropdownCategoryButton"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            {selectedCategoryName}
          </button>
          <div
            className="dropdown-menu w-100"
            aria-labelledby="dropdownCategoryButton"
          >
            <button
              className={`dropdown-item ${!selectedCategory ? "active" : ""}`}
              onClick={() => recieveJobType("")}
            >
              Tất cả
            </button>
            {categories.map((category) => (
              <button
                className={`dropdown-item ${
                  selectedCategory === category.id.toString() ? "active" : ""
                }`}
                key={category.id}
                onClick={() => recieveJobType(category.id.toString())}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <div className="select-Categories pt-80 pb-50">
          <div className="small-section-tittle2">
            <h4>Hình thức làm việc</h4>
          </div>
          {workTypes.map((workType) => (
            <label className="container" key={workType.id}>
              {workType.name}
              <input
                type="checkbox"
                checked={selectedWorkTypes.some(
                  (id) => id === workType.id || id === workType.id.toString()
                )}
                onChange={() => {
                  const newWorkTypeIds = selectedWorkTypes.includes(
                    workType.id.toString()
                  )
                    ? selectedWorkTypes.filter(
                        (id) => id !== workType.id.toString()
                      )
                    : [...selectedWorkTypes, workType.id.toString()];
                  worktype(newWorkTypeIds);
                }}
              />
              <span className="checkmark"></span>
            </label>
          ))}
        </div>
      </div>

      <div className="single-listing">
        <div className="small-section-tittle2">
          <h4>Vị trí</h4>
        </div>
        <div className="custom-dropdown mb-4">
          <button
            className="btn btn-light dropdown-toggle w-100 d-flex justify-content-between align-items-center"
            type="button"
            id="dropdownLocationButton"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            {selectedLocationName}
          </button>
          <div
            className="dropdown-menu w-100"
            aria-labelledby="dropdownLocationButton"
          >
            <button
              className={`dropdown-item ${!selectedLocation ? "active" : ""}`}
              onClick={() => recieveLocation("")}
            >
              Tất cả
            </button>
            {locations.map((location) => (
              <button
                className={`dropdown-item ${
                  selectedLocation === location.id.toString() ? "active" : ""
                }`}
                key={location.id}
                onClick={() => recieveLocation(location.id.toString())}
              >
                {location.name}
              </button>
            ))}
          </div>
        </div>

        <div className="select-Categories pt-80 pb-50">
          <div className="small-section-tittle2">
            <h4>Kinh nghiệm làm việc</h4>
          </div>
          {experiences.map((experience) => (
            <label className="container" key={experience.id}>
              {experience.name}
              <input
                type="checkbox"
                checked={selectedExperiences.some(
                  (id) =>
                    id === experience.id || id === experience.id.toString()
                )}
                onChange={() => {
                  const newExperienceIds = selectedExperiences.includes(
                    experience.id.toString()
                  )
                    ? selectedExperiences.filter(
                        (id) => id !== experience.id.toString()
                      )
                    : [...selectedExperiences, experience.id.toString()];
                  recieveExp(newExperienceIds);
                }}
              />
              <span className="checkmark"></span>
            </label>
          ))}
        </div>
      </div>

      <div className="single-listing">
        <div className="select-Categories pb-50">
          <div className="small-section-tittle2">
            <h4>Cấp bậc</h4>
          </div>
          {jobLevels.map((jobLevel) => (
            <label className="container" key={jobLevel.id}>
              {jobLevel.name}
              <input
                type="checkbox"
                checked={selectedJobLevels.some(
                  (id) => id === jobLevel.id || id === jobLevel.id.toString()
                )}
                onChange={() => {
                  const newJobLevelIds = selectedJobLevels.includes(
                    jobLevel.id.toString()
                  )
                    ? selectedJobLevels.filter(
                        (id) => id !== jobLevel.id.toString()
                      )
                    : [...selectedJobLevels, jobLevel.id.toString()];
                  recieveJobLevel(newJobLevelIds);
                }}
              />
              <span className="checkmark"></span>
            </label>
          ))}
        </div>
      </div>

      <div className="single-listing">
        <div className="select-Categories pb-50">
          <div className="small-section-tittle2">
            <h4>Lương bổng</h4>
          </div>
          {salaries.map((salary) => (
            <label className="container" key={salary.id}>
              {salary.name}
              <input
                type="checkbox"
                checked={selectedSalaries.some(
                  (id) => id === salary.id || id === salary.id.toString()
                )}
                onChange={() => {
                  const newSalaryIds = selectedSalaries.includes(
                    salary.id.toString()
                  )
                    ? selectedSalaries.filter(
                        (id) => id !== salary.id.toString()
                      )
                    : [...selectedSalaries, salary.id.toString()];
                  recieveSalary(newSalaryIds);
                }}
              />
              <span className="checkmark"></span>
            </label>
          ))}
        </div>
      </div>

      <div className="single-listing mt-4">
        <button className="btn btn-secondary w-100" onClick={resetFilters}>
          <i className="fas fa-sync-alt mr-2"></i>
          Đặt lại
        </button>
      </div>
    </div>
  );
};

export default LeftBar;
