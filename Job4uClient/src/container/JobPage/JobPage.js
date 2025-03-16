import React, { useState, useEffect } from "react";
import LeftBar from "./LeftPage/LeftBar";
import RightContent from "./RightPage/RightContent";
import ReactPaginate from "react-paginate";
import { searchPostService } from "../../service/PostService";

const JobPage = () => {
  const [posts, setPosts] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
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

  const fetchPosts = async (page) => {
    setSearchLoading(true);
    setError(null);

    try {
      const response = await searchPostService({
        page: page,
        size: pageSize,
        keyword,
        categoryId,
        locationId,
        workTypeIds,
        jobLevelIds,
        experienceIds,
        salaryIds,
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

  useEffect(() => {
    fetchPosts(0);
  }, []);

  const handleSearch = () => {
    setCurrentPage(0);
    fetchPosts(0);
  };

  const handlePageChange = (selectedPage) => {
    const newPage = selectedPage.selected;
    setCurrentPage(newPage);
    fetchPosts(newPage);
  };

  const resetFilters = () => {
    setKeyword("");
    setCategoryId("");
    setLocationId("");
    setWorkTypeIds([]);
    setJobLevelIds([]);
    setExperienceIds([]);
    setSalaryIds([]);
    setCurrentPage(0);
    setSortBy("createdAt");
    setDirection("desc");
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
                      style={{
                        height: "55px",
                      }}
                    />
                    <div className="input-group-append">
                      <button
                        className="btn btn-primary"
                        type="button"
                        onClick={handleSearch}
                        style={{
                          width: "auto",
                          padding: "5px 10px",
                        }}
                      >
                        Tìm kiếm
                      </button>
                    </div>
                  </div>
                </div>
                <LeftBar
                  worktype={(id) =>
                    setWorkTypeIds((prev) =>
                      prev.includes(id)
                        ? prev.filter((item) => item !== id)
                        : [...prev, id]
                    )
                  }
                  recieveSalary={(id) =>
                    setSalaryIds((prev) =>
                      prev.includes(id)
                        ? prev.filter((item) => item !== id)
                        : [...prev, id]
                    )
                  }
                  recieveExp={(id) =>
                    setExperienceIds((prev) =>
                      prev.includes(id)
                        ? prev.filter((item) => item !== id)
                        : [...prev, id]
                    )
                  }
                  recieveJobType={(id) => setCategoryId(id)}
                  recieveJobLevel={(id) =>
                    setJobLevelIds((prev) =>
                      prev.includes(id)
                        ? prev.filter((item) => item !== id)
                        : [...prev, id]
                    )
                  }
                  recieveLocation={(id) => setLocationId(id)}
                  resetFilters={resetFilters}
                />
              </div>
              <div className="col-xl-9 col-lg-9 col-md-8">
                <RightContent
                  count={totalElements}
                  post={posts}
                  loading={searchLoading}
                  onSortChange={(sortOption) => {
                    const [sort, dir] = sortOption.split("_");
                    setSortBy(sort);
                    setDirection(dir);
                    handleSearch();
                  }}
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