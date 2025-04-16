import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getDetailCompanyById } from "../../service/CompanyService";
import { searchPostService } from "../../service/PostService";
import Job from "../../components/Job/Job";
import ReactMarkdown from "react-markdown"; // Thêm thư viện react-markdown
import "./DetailCompany.scss";

const DetailCompany = () => {
  const [dataCompany, setDataCompany] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [recentPosts, setRecentPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const { id } = useParams();
  const postsPerPage = 3;
  const maxPosts = 12;

  useEffect(() => {
    if (id) {
      const fetchCompany = async () => {
        try {
          setIsLoading(true);
          const res = await getDetailCompanyById(id);
          if (res && res.status === "SUCCESS") {
            setDataCompany(res.data || {});
          }
        } catch (error) {
          console.error("Error fetching company:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchCompany();
    }
  }, [id]);

  const loadRecentPosts = async (page) => {
    try {
      const res = await searchPostService({
        page,
        size: postsPerPage,
        companyId: id,
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
    if (!isLoading) {
      loadRecentPosts(0);
    }
  }, [isLoading]);

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    loadRecentPosts(nextPage);
    setCurrentPage(nextPage);
  };

  const showLoadMore =
    recentPosts.length < maxPosts &&
    recentPosts.length < totalPosts &&
    totalPosts > (currentPage + 1) * postsPerPage;

  if (isLoading) {
    return (
      <div className="container-detail-company container-lg">
        Đang tải dữ liệu...
      </div>
    );
  }

  return (
    <div className="container-detail-company container-lg">
      <div className="company-cover">
        <div className="cover-wrapper">
          <img
            src={dataCompany.coverImage || ""}
            alt="Cover image"
            className="img-responsive cover-img"
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
      <div className="detail">
        <div className="row">
          <div className="col-md-8">
            <div className="company-info box-white">
              <h4 className="title">Giới thiệu công ty</h4>
              <div className="box-body">
                {dataCompany.description_Markdown ? (
                  <ReactMarkdown>
                    {dataCompany.description_Markdown}
                  </ReactMarkdown>
                ) : (
                  <p>Chưa có thông tin</p>
                )}
              </div>
            </div>
            <div className="company-jobs box-white mt-6">
              <h4 className="title">Công việc mới đăng</h4>
              <div className="box-body">
                {recentPosts.length > 0 ? (
                  recentPosts.map((post) => (
                    <Link to={`/detail-job/${post.id}`} key={post.id}>
                      <div className="single-job-items mb-30">
                        <Job data={post} />
                      </div>
                    </Link>
                  ))
                ) : (
                  <p>Chưa có bài đăng nào từ công ty này.</p>
                )}
                {showLoadMore && (
                  <div className="text-center mt-30">
                    <button
                      className="btn btn-primary"
                      onClick={handleLoadMore}
                    >
                      Xem thêm
                    </button>
                  </div>
                )}
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
                  <iframe
                    width="100%"
                    height="270"
                    frameBorder="0"
                    style={{ border: 0 }}
                    src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyCVgO8KzHQ8iKcfqXgrMnUIGlD-piWiPpo&q=${encodeURIComponent(
                      dataCompany.address || "vietnam"
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
  );
};

export default DetailCompany;