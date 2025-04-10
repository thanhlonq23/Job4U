import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getTop5CategoriesByPostCount } from "../../service/CategoriesService";
import "./home.scss";

const Home = () => {
  const [dataFeature, setDataFeature] = useState([]);
  const [topCategories, setTopCategories] = useState([]); // State cho top categories

  // Hàm load top 5 categories
  const loadTopCategories = async () => {
    try {
      const res = await getTop5CategoriesByPostCount();
      console.log("AA");
      console.log(res);

      if (res && res.status === "SUCCESS") {
        setTopCategories(res.data || []);
      }
    } catch (error) {
      console.error("Error fetching top categories:", error);
    }
  };

  // Hàm load posts (giữ nguyên logic của bạn, hiện đang mock = 0)
  const loadPost = async (limit, offset) => {
    // let arrData = await getListPostService({
    //     limit: limit,
    //     offset: offset,
    //     category_job_id: '',
    //     address_id: '',
    //     salary_job_id: '',
    //     category_joblevel_id: '',
    //     category_worktype_id: '',
    //     experience_job_id: '',
    //     sortName: false
    // });
    let arrData = 0; // Giữ nguyên mock của bạn

    if (arrData && arrData.errCode === 0) {
      setDataFeature(arrData.data);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await loadPost(5, 0); // Load posts
      await loadTopCategories(); // Load top categories
    };
    fetchData();
  }, []);

  return (
    <>
      <main>
        {/* Slider Area Start */}
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
                    <form action="#" className="search-box">
                      <div className="input-form">
                        <input
                          type="text"
                          placeholder="Nhập từ khóa tìm kiếm"
                        />
                      </div>
                      <div className="select-form">
                        <div className="select-itms">
                          <select
                            className="form-select form-select-lg mb-3"
                            aria-label=".form-select-lg example"
                          >
                            <option selected>Địa điểm</option>
                            <option value="1">One</option>
                            <option value="2">Two</option>
                            <option value="3">Three</option>
                          </select>
                        </div>
                      </div>
                      <div className="search-form">
                        <a href="#">Tìm kiếm</a>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Slider Area End */}

        {/* Our Services Start */}
        <div className="our-services section-pad-t30">
          <div className="container">
            {/* Section Tittle */}
            <div className="row">
              <div className="col-lg-12">
                <div className="section-tittle text-center">
                  <span>Lĩnh vực công việc nổi bật</span>
                  <h2>Danh mục nghề nghiệp</h2>
                </div>
              </div>
            </div>
            {/* Hiển thị top 5 danh mục */}
            <div className="row d-flex justify-content-center">
              {topCategories.length > 0 ? (
                topCategories.map((category) => (
                  <div key={category.id} className="col-lg-3 col-md-4 col-sm-6">
                    <div className="single-services text-center mb-30">
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
        {/* Our Services End */}

        {/* Online CV Area Start */}
        <div
          className="online-cv cv-bg section-overly pt-90 pb-120"
          style={{
            backgroundImage: `url("assets/img/gallery/cv_bg.jpg")`,
          }}
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
        {/* Online CV Area End */}

        {/* Featured Job Start */}
        <section className="featured-job-area feature-padding">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="section-tittle text-center">
                  <h2>Công việc mới đăng</h2>
                </div>
              </div>
            </div>
            {/* <FeatureJobs dataFeature={dataFeature} /> */}
          </div>
        </section>
        {/* Featured Job End */}

        {/* How Apply Process Start */}
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
        {/* How Apply Process End */}
      </main>
    </>
  );
};

export default Home;
