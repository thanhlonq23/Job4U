import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getTop5CategoriesByPostCount } from "../../service/CategoriesService";
import { searchPostService } from "../../service/PostService";
import Job from "../../components/Job/Job";
import "./home.scss";

const Home = () => {
  const [topCategories, setTopCategories] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const postsPerPage = 3;
  const maxPosts = 12;
  const [keyword, setKeyword] = useState("");
  const [locationId, setLocationId] = useState("");
  const navigate = useNavigate();

  const loadTopCategories = async () => {
    try {
      const res = await getTop5CategoriesByPostCount();
      if (res && res.status === "SUCCESS") {
        setTopCategories(res.data || []);
      }
    } catch (error) {
      console.error("Error fetching top categories:", error);
    }
  };

  const loadRecentPosts = async (page) => {
    try {
      const res = await searchPostService({
        page,
        size: postsPerPage,
        sortBy: "createdAt",
        direction: "desc",
      });
      if (res && res.status === "SUCCESS") {
        const newPosts = res.data.content || [];
        setTotalPosts(res.data.totalElements);
        setRecentPosts((prevPosts) => {
          const updatedPosts = [...prevPosts, ...newPosts].slice(0, maxPosts);
          return updatedPosts;
        });
      }
    } catch (error) {
      console.error("Error fetching recent posts:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await loadTopCategories();
      await loadRecentPosts(0);
    };
    fetchData();
  }, []);

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    loadRecentPosts(nextPage);
    setCurrentPage(nextPage);
  };

  const handleSearch = () => {
    // Chuyển hướng sang /job với query string
    const query = new URLSearchParams();
    if (keyword) query.set("keyword", keyword);
    if (locationId) query.set("locationId", locationId);
    navigate(`/job?${query.toString()}`);
  };

  const showLoadMore =
    recentPosts.length < maxPosts &&
    recentPosts.length < totalPosts &&
    totalPosts > (currentPage + 1) * postsPerPage;

  return (
    <>
      <main>
        <div className="slider-area">
          <div className="slider-active">
            <div
              className="single-slider slider-height d-flex align-items-center"
              style={{
                backgroundImage: `url("./assets/img/banner/banner-1.png")`,
              }}
            >
              <div className="container">
                <div className="row">
                  <div className="col-xl-6 col-lg-9 col-md-10">
                    <div className="hero__caption">
                      <h1>TÌM CÔNG VIỆC PHÙ HỢP VỚI BẠN</h1>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-xl-8">
                    <form
                      className="search-box"
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSearch();
                      }}
                    >
                      <div className="input-form">
                        <input
                          type="text"
                          placeholder="Nhập từ khóa tìm kiếm"
                          value={keyword}
                          onChange={(e) => setKeyword(e.target.value)}
                        />
                      </div>
                      <div className="select-form">
                        <div className="select-itms">
                          <select
                            className="form-select form-select-lg"
                            value={locationId}
                            onChange={(e) => setLocationId(e.target.value)}
                          >
                            <option value="">Địa điểm</option>
                            <option value="1">Hà Nội</option>
                            <option value="2">TP. Hồ Chí Minh</option>
                            <option value="3">Đà Nẵng</option>
                          </select>
                        </div>
                      </div>
                      <div className="search-form">
                        <button
                          type="submit"
                          style={{
                            backgroundColor: "#2b55ff",
                            border: "none",
                            color: "white",
                            padding: "15% 28%",
                            cursor: "pointer",
                          }}
                        >
                          Tìm kiếm
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="our-services section-pad-t30">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="section-tittle text-center">
                  <span>Lĩnh vực công việc nổi bật</span>
                  <h2>Danh mục nghề nghiệp</h2>
                </div>
              </div>
            </div>
            <div className="row d-flex justify-content-center">
              {topCategories.length > 0 ? (
                topCategories.map((category) => (
                  <div key={category.id} className="col-lg-3 col-md-4 col-sm-6">
                    <div className="text-center mb-30">
                      <div className="services-ion">
                        <img
                          src={category.image}
                          alt={category.name}
                          style={{ width: "80px", height: "80px" }}
                        />
                      </div>
                      <div className="services-cap">
                        <h5>{category.name}</h5>
                        <p>{category.postCount} bài đăng</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>Đang tải dữ liệu...</p>
              )}
            </div>
          </div>
        </div>

        <div
          className="online-cv cv-bg section-overly pt-90 pb-120"
          style={{ backgroundImage: `url("assets/img/gallery/cv_bg.jpg")` }}
        >
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-xl-10">
                <div className="cv-caption text-center">
                  <p className="pera1">Nhiều công việc đang chờ bạn</p>
                  <p className="pera2">Bạn đã hứng thú đã tìm việc chưa?</p>
                  <Link to="/job" className="border-btn2 border-btn4">
                    Tìm việc ngay
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="featured-job-area feature-padding">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="section-tittle text-center">
                  <h2>Công việc mới đăng</h2>
                </div>
              </div>
            </div>
            <div className="row justify-content-center">
              <div className="col-lg-9">
                {recentPosts.length > 0 ? (
                  recentPosts.map((post) => (
                    <Link to={`/detail-job/${post.id}`} key={post.id}>
                      <div className="single-job-items mb-30 transition-hover-shadow">
                        <Job data={post} />
                      </div>
                    </Link>
                  ))
                ) : (
                  <p>Đang tải bài đăng...</p>
                )}
              </div>
            </div>
            {showLoadMore && (
              <div className="row justify-content-center mt-30">
                <button className="btn btn-primary" onClick={handleLoadMore}>
                  Xem thêm
                </button>
              </div>
            )}
          </div>
        </section>

        <div
          className="apply-process-area apply-bg pt-150 pb-150"
          style={{
            backgroundImage: `url("assets/img/gallery/how-applybg.png")`,
          }}
        >
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="section-tittle white-text text-center">
                  <span>Quy trình tìm việc</span>
                  <h2>Thực hiện như thế nào?</h2>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-4 col-md-6">
                <div className="single-process text-center mb-30">
                  <div className="process-ion">
                    <span className="flaticon-search"></span>
                  </div>
                  <div className="process-cap">
                    <h5>1. Tìm kiếm công việc</h5>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-6">
                <div className="single-process text-center mb-30">
                  <div className="process-ion">
                    <span className="flaticon-curriculum-vitae"></span>
                  </div>
                  <div className="process-cap">
                    <h5>2. Ứng tuyển công việc</h5>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-6">
                <div className="single-process text-center mb-30">
                  <div className="process-ion">
                    <span className="flaticon-tour"></span>
                  </div>
                  <div className="process-cap">
                    <h5>3. Nhận công việc</h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
