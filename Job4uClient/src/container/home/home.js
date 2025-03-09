import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
// import Categories from '../../components/home/Categories'
// import FeatureJobs from '../../components/home/FeaturesJobs'
import { getListPostService } from "../../service/userService";

import "./home.scss";

const Home = () => {
  const [dataFeature, setDataFeature] = useState([]);

  let loadPost = async (limit, offset) => {
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
    // })
    let arrData = 0;

    if (arrData && arrData.errCode === 0) {
      setDataFeature(arrData.data);
    }
  };
  useEffect(() => {
    let fetchPost = async () => {
      await loadPost(5, 0);
    };
    fetchPost();
  }, []);
  return (
    <>
      {/* <div id="preloader-active">
        <div class="preloader d-flex align-items-center justify-content-center">
          <div class="preloader-inner position-relative">
            <div class="preloader-circle"></div>
            <div class="preloader-img pere-text">
              <img src="assets/img/logo/logo.png" alt="" />
            </div>
          </div>
        </div>
      </div> */}
      {/* <!-- Preloader Start --> */}

      <main>
        {/* <!-- slider Area Start--> */}
        <div class="slider-area ">
          {/* <!-- Mobile Menu --> */}
          <div class="slider-active">
            <div
              class="single-slider slider-height d-flex align-items-center"
              style={{
                backgroundImage: `url("./assets/img/banner/banner-1.png")`,
              }}
            >
              <div class="container">
                <div class="row">
                  <div class="col-xl-6 col-lg-9 col-md-10">
                    <div class="hero__caption">
                      {/* <h1>NƠI KHỞI ĐẦU CHO HÀNH TRÌNH SỰ NGHIỆP CỦA BẠN </h1> */}
                      <h1>TÌM CÔNG VIỆC PHÙ HỢP VỚI BẠN</h1>
                    </div>
                  </div>
                </div>
                {/* <!-- Search Box --> */}
                <div class="row">
                  <div class="col-xl-8">
                    <form action="#" class="search-box">
                      <div class="input-form">
                        <input
                          type="text"
                          placeholder="Job Tittle or keyword"
                        />
                      </div>
                      <div class="select-form">
                        <div class="select-itms">
                          <select
                            class="form-select form-select-lg mb-3"
                            aria-label=".form-select-lg example"
                          >
                            <option selected>Địa điểm</option>
                            <option value="1">One</option>
                            <option value="2">Two</option>
                            <option value="3">Three</option>
                          </select>
                        </div>
                      </div>
                      <div class="search-form">
                        <a href="#">Find job</a>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <!-- slider Area End-->
        <!-- Our Services Start --> */}
        <div class="our-services section-pad-t30">
          <div class="container">
            {/* <!-- Section Tittle --> */}
            <div class="row">
              <div class="col-lg-12">
                <div class="section-tittle text-center">
                  <span>Lĩnh vực công việc nổi bật</span>
                  <h2>Danh mục nghề nghiệp </h2>
                </div>
              </div>
            </div>
            {/* <Categories /> */}
            {/* <!-- More Btn -->
                <!-- Section Button --> */}
          </div>
        </div>
        {/* <!-- Our Services End -->
        <!-- Online CV Area Start --> */}
        <div
          class="online-cv cv-bg section-overly pt-90 pb-120"
          style={{
            backgroundImage: `url("assets/img/gallery/cv_bg.jpg")`,
          }}
        >
          <div class="container">
            <div class="row justify-content-center">
              <div class="col-xl-10">
                <div class="cv-caption text-center">
                  <p class="pera1">Nhiều công việc đang chờ bạn</p>
                  <p class="pera2"> Bạn đã hứng thú đã tìm việc chưa ?</p>
                  <Link to="/job" class="border-btn2 border-btn4">
                    Tìm việc ngay
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <!-- Online CV Area End-->
        <!-- Featured_job_start --> */}
        <section class="featured-job-area feature-padding">
          <div class="container">
            {/* <!-- Section Tittle --> */}
            <div class="row">
              <div class="col-lg-12">
                <div class="section-tittle text-center">
                  <h2>Công việc mới đăng</h2>
                </div>
              </div>
            </div>
            {/* <FeatureJobs dataFeature={dataFeature} /> */}
          </div>
        </section>
        {/* <!-- Featured_job_end -->
        <!-- How  Apply Process Start--> */}
        <div
          class="apply-process-area apply-bg pt-150 pb-150"
          style={{
            backgroundImage: `url("assets/img/gallery/how-applybg.png")`,
          }}
        >
          <div class="container">
            {/* <!-- Section Tittle --> */}
            <div class="row">
              <div class="col-lg-12">
                <div class="section-tittle white-text text-center">
                  <span>Quy trình tìm việc</span>
                  <h2> Thực hiện như thế nào ?</h2>
                </div>
              </div>
            </div>
            {/* <!-- Apply Process Caption --> */}
            <div class="row">
              <div class="col-lg-4 col-md-6">
                <div class="single-process text-center mb-30">
                  <div class="process-ion">
                    <span class="flaticon-search"></span>
                  </div>
                  <div class="process-cap">
                    <h5>1. Tìm kiếm công việc</h5>
                  </div>
                </div>
              </div>
              <div class="col-lg-4 col-md-6">
                <div class="single-process text-center mb-30">
                  <div class="process-ion">
                    <span class="flaticon-curriculum-vitae"></span>
                  </div>
                  <div class="process-cap">
                    <h5>2. Ứng tuyển công việc</h5>
                  </div>
                </div>
              </div>
              <div class="col-lg-4 col-md-6">
                <div class="single-process text-center mb-30">
                  <div class="process-ion">
                    <span class="flaticon-tour"></span>
                  </div>
                  <div class="process-cap">
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
