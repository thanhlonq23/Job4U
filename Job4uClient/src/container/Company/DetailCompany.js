import React, { useEffect, useState } from "react";
import { getDetailCompanyById } from "../../service/CompanyService";
import "./DetailCompany.scss";
import { useParams } from "react-router-dom";

const DetailCompany = () => {
  const [dataCompany, setDataCompany] = useState({});
  const [isLoading, setIsLoading] = useState(true); // Thêm state để kiểm soát loading
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      const fetchCompany = async () => {
        try {
          setIsLoading(true); // Bắt đầu loading
          const res = await getDetailCompanyById(id);

          if (res && res.status === "SUCCESS") {
            setDataCompany(res.data || {});
          } else {
            console.log("No SUCCESS status in response");
          }
        } catch (error) {
          console.error("Error fetching company:", error);
        } finally {
          setIsLoading(false); // Kết thúc loading
        }
      };
      fetchCompany();
    }
  }, [id]);

  // Nếu đang loading, hiển thị thông báo
  if (isLoading) {
    return <div className="container-detail-company">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="container-detail-company">
      <div className="company-cover">
        <div className="container">
          <div className="cover-wrapper">
            <img
              src={dataCompany.coverImage || ""}
              alt="Cover image"
              className="img-responsive cover-img"
              width="100%"
              height="236px"
            />
          </div>
          <div className="company-detail-overview">
            <div id="company-logo">
              <div className="company-image-logo">
                <img
                  src={dataCompany.thumbnail || ""}
                  alt={`${dataCompany.name || "Company"} logo`}
                  className="img-responsive"
                />
              </div>
            </div>
            <div className="company-info">
              <h1 className="company-detail-name text-highlight">
                {dataCompany.name || "N/A"}
              </h1>
              <div className="d-flex">
                {dataCompany.website && (
                  <p className="website">
                    <i className="fas fa-globe-americas"></i>
                    <a
                      href={dataCompany.website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {dataCompany.website}
                    </a>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="detail">
        <div className="container">
          <div className="row">
            <div className="col-md-8">
              <div className="company-info box-white">
                <h4 className="title">Giới thiệu công ty</h4>
                <div className="box-body">
                  <p>
                    {dataCompany.description_Markdown || "Chưa có thông tin"}
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="box-address box-white">
                <h4 className="title">Địa chỉ công ty</h4>
                <div className="box-body">
                  <p className="text-dark-gray">
                    <i className="fas fa-map-marker-alt" />{" "}
                    {dataCompany.address || "Chưa có thông tin"}
                  </p>
                  <div className="company-map">
                    <p className="map">Bản đồ:</p>
                    <iframe
                      width="100%"
                      height="270"
                      frameBorder="0"
                      style={{ border: 0 }}
                      src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyCVgO8KzHQ8iKcfqXgrMnUIGlD-piWiPpo&q=${encodeURIComponent(
                        dataCompany.address || "Hanoi"
                      )}&zoom=15&language=vi`}
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              </div>
              <div className="box-sharing box-white">
                <h4 className="title">Chia sẻ công ty tới bạn bè</h4>
                <div className="box-body">
                  <p>Sao chép đường dẫn</p>
                  <div className="box-copy">
                    <input
                      type="text"
                      value={window.location.href}
                      className="url-copy"
                      readOnly
                    />
                    <div className="btn-copy">
                      <button className="btn-copy-url">
                        <i className="fa-regular fa-copy" />
                      </button>
                    </div>
                  </div>
                  <p>Chia sẻ qua mạng xã hội</p>
                  <div className="box-share">
                    <a
                      href={`http://www.facebook.com/sharer/sharer.php?u=${window.location.href}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src="https://www.topcv.vn/v4/image/job-detail/share/facebook.png"
                        alt="Facebook"
                      />
                    </a>
                    <a
                      href={`https://twitter.com/intent/tweet?url=${window.location.href}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src="https://www.topcv.vn/v4/image/job-detail/share/twitter.png"
                        alt="Twitter"
                      />
                    </a>
                    <a
                      href={`https://www.linkedin.com/cws/share?url=${window.location.href}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src="https://www.topcv.vn/v4/image/job-detail/share/linkedin.png"
                        alt="LinkedIn"
                      />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailCompany;
