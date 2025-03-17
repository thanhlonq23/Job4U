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

  // Thêm state local để theo dõi giá trị được chọn
  const [localCategory, setLocalCategory] = useState(selectedCategory || "");
  const [localLocation, setLocalLocation] = useState(selectedLocation || "");

  // Cập nhật state local khi prop thay đổi
  useEffect(() => {
    setLocalCategory(selectedCategory || "");
    setLocalLocation(selectedLocation || "");
  }, [selectedCategory, selectedLocation]);

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

  // Xử lý thay đổi lĩnh vực
  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setLocalCategory(value);
    recieveJobType(value);
  };

  // Xử lý thay đổi vị trí
  const handleLocationChange = (e) => {
    const value = e.target.value;
    setLocalLocation(value);
    recieveLocation(value);
  };

  // Xử lý worktype
  const handleWorkTypeChange = (id) => {
    if (!selectedWorkTypes) {
      worktype([id]);
      return;
    }

    const isSelected =
      selectedWorkTypes.includes(id) ||
      selectedWorkTypes.includes(id.toString());

    if (isSelected) {
      const updatedTypes = selectedWorkTypes.filter(
        (item) => item !== id && item !== id.toString()
      );
      worktype(updatedTypes);
    } else {
      worktype([...selectedWorkTypes, id]);
    }
  };

  // Xử lý experience
  const handleExperienceChange = (id) => {
    if (!selectedExperiences) {
      recieveExp([id]);
      return;
    }

    const isSelected =
      selectedExperiences.includes(id) ||
      selectedExperiences.includes(id.toString());

    if (isSelected) {
      const updatedExps = selectedExperiences.filter(
        (item) => item !== id && item !== id.toString()
      );
      recieveExp(updatedExps);
    } else {
      recieveExp([...selectedExperiences, id]);
    }
  };

  // Xử lý job level
  const handleJobLevelChange = (id) => {
    if (!selectedJobLevels) {
      recieveJobLevel([id]);
      return;
    }

    const isSelected =
      selectedJobLevels.includes(id) ||
      selectedJobLevels.includes(id.toString());

    if (isSelected) {
      const updatedLevels = selectedJobLevels.filter(
        (item) => item !== id && item !== id.toString()
      );
      recieveJobLevel(updatedLevels);
    } else {
      recieveJobLevel([...selectedJobLevels, id]);
    }
  };

  // Xử lý salary
  const handleSalaryChange = (id) => {
    if (!selectedSalaries) {
      recieveSalary([id]);
      return;
    }

    const isSelected =
      selectedSalaries.includes(id) || selectedSalaries.includes(id.toString());

    if (isSelected) {
      const updatedSalaries = selectedSalaries.filter(
        (item) => item !== id && item !== id.toString()
      );
      recieveSalary(updatedSalaries);
    } else {
      recieveSalary([...selectedSalaries, id]);
    }
  };

  const resetFilters = () => {
    setLocalCategory("");
    setLocalLocation("");
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

  // Tìm tên của lĩnh vực đã chọn
  const selectedCategoryName = localCategory
    ? categories.find((c) => c.id.toString() === localCategory.toString())
        ?.name || "Đang chọn..."
    : "Tất cả";

  // Tìm tên của vị trí đã chọn
  const selectedLocationName = localLocation
    ? locations.find((l) => l.id.toString() === localLocation.toString())
        ?.name || "Đang chọn..."
    : "Tất cả";

  return (
    <>
      <div className="job-category-listing mb-50">
        {/* <!-- single one --> */}
        <div className="single-listing">
          <div className="small-section-tittle2">
            <h4>Lĩnh vực</h4>
          </div>
          {/* <!-- Custom dropdown start --> */}
          <div className="custom-dropdown mb-4">
            <div className="">
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
                  className={`dropdown-item ${!localCategory ? "active" : ""}`}
                  onClick={() => {
                    setLocalCategory("");
                    recieveJobType("");
                  }}
                >
                  Tất cả
                </button>
                {Array.isArray(categories) &&
                  categories.map((category) => (
                    <button
                      className={`dropdown-item ${
                        localCategory === category.id.toString() ? "active" : ""
                      }`}
                      key={category.id}
                      onClick={() => {
                        setLocalCategory(category.id.toString());
                        recieveJobType(category.id.toString());
                      }}
                    >
                      {category.name}
                    </button>
                  ))}
              </div>
            </div>
          </div>
          {/* <!-- Custom dropdown end --> */}

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
                    checked={selectedWorkTypes?.some(
                      (item) =>
                        item === workType.id || item === workType.id.toString()
                    )}
                    onChange={() => handleWorkTypeChange(workType.id)}
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
          {/* <!-- Custom dropdown start --> */}
          <div className="custom-dropdown mb-4">
            <div className="">
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
                  className={`dropdown-item ${!localLocation ? "active" : ""}`}
                  onClick={() => {
                    setLocalLocation("");
                    recieveLocation("");
                  }}
                >
                  Tất cả
                </button>
                {Array.isArray(locations) &&
                  locations.map((location) => (
                    <button
                      className={`dropdown-item ${
                        localLocation === location.id.toString() ? "active" : ""
                      }`}
                      key={location.id}
                      onClick={() => {
                        setLocalLocation(location.id.toString());
                        recieveLocation(location.id.toString());
                      }}
                    >
                      {location.name}
                    </button>
                  ))}
              </div>
            </div>
          </div>
          {/* <!-- Custom dropdown end --> */}

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
                    checked={selectedExperiences?.some(
                      (item) =>
                        item === experience.id ||
                        item === experience.id.toString()
                    )}
                    onChange={() => handleExperienceChange(experience.id)}
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
                    checked={selectedJobLevels?.some(
                      (item) =>
                        item === jobLevel.id || item === jobLevel.id.toString()
                    )}
                    onChange={() => handleJobLevelChange(jobLevel.id)}
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
                    checked={selectedSalaries?.some(
                      (item) =>
                        item === salary.id || item === salary.id.toString()
                    )}
                    onChange={() => handleSalaryChange(salary.id)}
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
