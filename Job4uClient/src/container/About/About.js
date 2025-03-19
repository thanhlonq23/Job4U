import React from "react";

const About = () => {
  return (
    <>
      {/* ... (phần preloader nếu có) ... */}

      <main>
        {/* ... (phần hero area) ... */}

        {/* */}
        <div className="support-company-area fix section-padding2">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-xl-6 col-lg-6">
                <div className="right-caption">
                  <div className="section-tittle section-tittle2">
                    <h2>
                      Sứ mệnh của chúng tôi là kết nối bạn đến với nhà tuyển dụng
                    </h2>
                  </div>
                  <div className="support-caption">
                    <p className="pera-top">
                      Chúng tôi không chỉ cung cấp danh sách việc làm, mà còn
                      xây dựng một nền tảng giúp bạn tiếp cận trực tiếp với các
                      nhà tuyển dụng đang tìm kiếm những ứng viên có năng lực
                      như bạn.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-xl-6 col-lg-6">
                <div className="support-location-img">
                  <img
                    src="assets/img/service/support-img.jpg"
                    alt=""
                    style={{ height: "500px", width: "auto" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* */}

        {/* ... (các phần khác của trang) ... */}
      </main>

      {/* ... (các phần khác của trang) ... */}
    </>
  );
};

export default About;
