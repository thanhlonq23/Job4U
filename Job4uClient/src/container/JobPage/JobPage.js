import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LeftBar from "./LeftPage/LeftBar";
import RightContent from "./RightPage/RightContent";
import ReactPaginate from "react-paginate";
import { searchPostService } from "../../service/PostService";

const JobPage = () => {
  const [posts, setPosts] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [searchLoading, setSearchLoading] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [locationId, setLocationId] = useState("");
  const [workTypeIds, setWorkTypeIds] = useState([]);
  const [jobLevelIds, setJobLevelIds] = useState([]);
  const [experienceIds, setExperienceIds] = useState([]);
  const [salaryIds, setSalaryIds] = useState([]);
  const [sortBy, setSortBy] = useState("createdAt");
  const [direction, setDirection] = useState("desc");
  const [error, setError] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  // Hàm lấy dữ liệu từ API
  const fetchPosts = async ({
    page,
    keyword,
    categoryId,
    locationId,
    workTypeIds,
    jobLevelIds,
    experienceIds,
    salaryIds,
    sortBy,
    direction,
  }) => {
    setSearchLoading(true);
    setError(null);

    try {
      const response = await searchPostService({
        page,
        size: pageSize,
        keyword,
        categoryId,
        locationId,
        workTypeIds,
        jobLevelIds,
        experienceIds,
        salaryIds,
        companyId: null,
        sortBy,
        direction,
      });

      if (response && response.status === "SUCCESS") {
        setPosts(response.data.content || []);
        setTotalElements(response.data.totalElements || 0);
        setTotalPages(response.data.totalPages || 0);
      } else {
        throw new Error(response.message || "Không thể tải dữ liệu công việc.");
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      setPosts([]);
      setTotalElements(0);
      setTotalPages(0);
      setError(
        "Đã xảy ra lỗi khi tải dữ liệu: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setSearchLoading(false);
    }
  };

  // Hàm cập nhật URL dựa trên state hiện tại
  const updateUrl = (newPage = currentPage) => {
    const query = new URLSearchParams();
    if (keyword) query.set("keyword", keyword);
    if (categoryId) query.set("categoryId", categoryId);
    if (locationId) query.set("locationId", locationId);
    if (workTypeIds.length) query.set("workTypeIds", workTypeIds.join(","));
    if (jobLevelIds.length) query.set("jobLevelIds", jobLevelIds.join(","));
    if (experienceIds.length)
      query.set("experienceIds", experienceIds.join(","));
    if (salaryIds.length) query.set("salaryIds", salaryIds.join(","));
    if (sortBy) query.set("sortBy", sortBy);
    if (direction) query.set("direction", direction);
    query.set("page", newPage.toString());

    navigate(`/job?${query.toString()}`, { replace: true });
  };

  // Khởi tạo state từ URL và truy vấn API
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);

    // Trích xuất tham số từ URL
    const urlKeyword = queryParams.get("keyword") || "";
    const urlCategoryId = queryParams.get("categoryId") || "";
    const urlLocationId = queryParams.get("locationId") || "";
    const urlWorkTypeIds =
      queryParams.get("workTypeIds")?.split(",").filter(Boolean) || [];
    const urlJobLevelIds =
      queryParams.get("jobLevelIds")?.split(",").filter(Boolean) || [];
    const urlExperienceIds =
      queryParams.get("experienceIds")?.split(",").filter(Boolean) || [];
    const urlSalaryIds =
      queryParams.get("salaryIds")?.split(",").filter(Boolean) || [];
    const urlSortBy = queryParams.get("sortBy") || "createdAt";
    const urlDirection = queryParams.get("direction") || "desc";
    const urlPage = parseInt(queryParams.get("page") || "0", 10);

    // Cập nhật state để UI hiển thị đúng
    setKeyword(urlKeyword);
    setCategoryId(urlCategoryId);
    setLocationId(urlLocationId);
    setWorkTypeIds(urlWorkTypeIds);
    setJobLevelIds(urlJobLevelIds);
    setExperienceIds(urlExperienceIds);
    setSalaryIds(urlSalaryIds);
    setSortBy(urlSortBy);
    setDirection(urlDirection);
    setCurrentPage(urlPage);

    // Gọi fetchPosts với tham số từ URL
    fetchPosts({
      page: urlPage,
      keyword: urlKeyword,
      categoryId: urlCategoryId,
      locationId: urlLocationId,
      workTypeIds: urlWorkTypeIds,
      jobLevelIds: urlJobLevelIds,
      experienceIds: urlExperienceIds,
      salaryIds: urlSalaryIds,
      sortBy: urlSortBy,
      direction: urlDirection,
    });
  }, [location.search]);

  // Xử lý tìm kiếm
  const handleSearch = () => {
    setCurrentPage(0);
    updateUrl(0);
  };

  // Xử lý thay đổi trang
  const handlePageChange = (selectedPage) => {
    const newPage = selectedPage.selected;
    setCurrentPage(newPage);
    updateUrl(newPage);
  };

  // Reset bộ lọc
  const resetFilters = () => {
    setKeyword("");
    setCategoryId("");
    setLocationId("");
    setWorkTypeIds([]);
    setJobLevelIds([]);
    setExperienceIds([]);
    setSalaryIds([]);
    setSortBy("createdAt");
    setDirection("desc");
    setCurrentPage(0);
    updateUrl(0);
  };

  // Xử lý thay đổi sắp xếp
  const handleSortChange = (sortOption) => {
    const [sort, dir] = sortOption.split("_");
    setSortBy(sort);
    setDirection(dir);
    setCurrentPage(0);
    updateUrl(0);
  };

  return (
    <>
      <main>
        <div className="slider-area">
          <div
            className="single-slider section-overly slider-height2 d-flex align-items-center"
            style={{ backgroundImage: `url("assets/img/hero/about.jpg")` }}
          >
            <div className="container">
              <div className="row">
                <div className="col-xl-12">
                  <div className="hero-cap text-center">
                    <h2>Tìm việc</h2>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="job-listing-area pt-120 pb-120">
          <div className="container">
            {error && (
              <div
                className="alert alert-danger alert-dismissible fade show"
                role="alert"
              >
                <strong>Lỗi!</strong> {error}
                <button
                  type="button"
                  className="close"
                  data-dismiss="alert"
                  aria-label="Close"
                  onClick={() => setError(null)}
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
            )}
            <div className="row">
              <div className="col-xl-3 col-lg-3 col-md-4">
                <div className="mb-3">
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Tìm kiếm công việc..."
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                      style={{ height: "55px" }}
                    />
                    <div className="input-group-append">
                      <button
                        className="btn btn-primary"
                        type="button"
                        onClick={handleSearch}
                        style={{ width: "auto", padding: "5px 10px" }}
                      >
                        Tìm kiếm
                      </button>
                    </div>
                  </div>
                </div>
                <LeftBar
                  selectedCategory={categoryId}
                  selectedLocation={locationId}
                  selectedWorkTypes={workTypeIds}
                  selectedJobLevels={jobLevelIds}
                  selectedExperiences={experienceIds}
                  selectedSalaries={salaryIds}
                  recieveJobType={(id) => setCategoryId(id)}
                  recieveLocation={(id) => setLocationId(id)}
                  worktype={(ids) => setWorkTypeIds(ids)}
                  recieveJobLevel={(ids) => setJobLevelIds(ids)}
                  recieveExp={(ids) => setExperienceIds(ids)}
                  recieveSalary={(ids) => setSalaryIds(ids)}
                  resetFilters={resetFilters}
                />
              </div>
              <div className="col-xl-9 col-lg-9 col-md-8">
                <RightContent
                  count={totalElements}
                  post={posts}
                  loading={searchLoading}
                  onSortChange={handleSortChange}
                  currentSort={`${sortBy}_${direction}`}
                />
              </div>
            </div>
            {totalPages > 0 && (
              <ReactPaginate
                previousLabel={"Quay lại"}
                nextLabel={"Tiếp"}
                breakLabel={"..."}
                pageCount={totalPages}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageChange}
                containerClassName={"pagination justify-content-center pb-3"}
                pageClassName={"page-item"}
                pageLinkClassName={"page-link"}
                previousLinkClassName={"page-link"}
                previousClassName={"page-item"}
                nextClassName={"page-item"}
                nextLinkClassName={"page-link"}
                breakLinkClassName={"page-link"}
                breakClassName={"page-item"}
                activeClassName={"active"}
                forcePage={currentPage}
              />
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default JobPage;
