import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import SendCvModal from "../../components/modal/SendCvModal";
import { getDetailPostByIdService } from "../../service/UserService";
import ReactMarkdown from "react-markdown"; // Import thư viện ReactMarkdown
import moment from "moment";

const JobDetail = () => {
  const { id } = useParams();
  const [isActiveModal, setActiveModal] = useState(false);
  const [dataPost, setDataPost] = useState({});

  useEffect(() => {
    if (id) {
      fetchPost(id);
    }
  }, [id]);

  let fetchPost = async (id) => {
    let res = await getDetailPostByIdService(id);
    if (res && res.status === "SUCCESS") {
      setDataPost(res.data);
    }
  };

  const handleOpenModal = () => {
    const currentDate = new Date();
    const expirationDate = new Date(dataPost.expirationDate);

    if (expirationDate > currentDate) {
      const userData = JSON.parse(localStorage.getItem("userData"));
      if (userData) setActiveModal(true);
      else toast.error("Xin hãy đăng nhập để có thể thực hiện nộp CV");
    } else toast.error("Hạn ứng tuyển đã hết");
  };

  return (
    <>
      {dataPost.company && (
        <main>
          <div className="slider-area">
            <div
              className="single-slider slider-height2 d-flex align-items-center"
              style={{
                backgroundImage: `url(${dataPost.company.coverImage})`,
              }}
            >
              <div className="container">
                <div className="row">
                  <div className="col-xl-12">
                    <div className="hero-cap text-center"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="job-post-company pt-120 pb-120">
            <div className="container">
              <div className="row justify-content-between">
                <div className="col-xl-7 col-lg-8">
                  <div className="single-job-items mb-30">
                    <div className="job-items">
                      <div className="company-img company-img-details">
                        <img
                          src={dataPost.company.thumbnail}
                          alt="Ảnh công ty"
                          width={100}
                          height={100}
                        />
                      </div>
                      <div className="job-tittle">
                        <h4>{dataPost.name}</h4>

                        <ul>
                          <li>{dataPost.workType?.name}</li>
                          <li>
                            <i className="fas fa-map-marker-alt"></i>
                            {dataPost.location?.name}
                          </li>
                          <li>{dataPost.salary?.name}</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="job-post-details">
                    <div className="post-details1 mb-50">
                      <div className="small-section-tittle">
                        <h4>Mô tả công việc</h4>
                      </div>
                    </div>
                    <div className="markdown-content">
                      {/* Sử dụng ReactMarkdown để render nội dung markdown */}
                      <ReactMarkdown>
                        {dataPost.descriptionMarkdown}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>

                <div className="col-xl-4 col-lg-4">
                  <div className="post-details3 mb-50">
                    <div className="small-section-tittle">
                      <h4>Thông tin công việc</h4>
                    </div>
                    <ul>
                      <li>
                        Nơi làm việc : <span>{dataPost.location?.name}</span>
                      </li>
                      <li>
                        Hình thức làm việc :{" "}
                        <span>{dataPost.workType?.name}</span>
                      </li>
                      <li>
                        Lương : <span>{dataPost.salary?.name}</span>
                      </li>
                      <li>
                        Vị trí : <span>{dataPost.jobLevel?.name}</span>
                      </li>
                      <li>
                        Kinh nghiệm : <span>{dataPost.experience?.name}</span>
                      </li>
                      <li>
                        Hạn nộp :{" "}
                        <span>
                          {dataPost.expirationDate &&
                            moment(dataPost.expirationDate).format(
                              "DD/MM/YYYY"
                            )}
                        </span>
                      </li>
                    </ul>
                    <div className="btn" onClick={() => handleOpenModal()}>
                      Ứng tuyển ngay
                    </div>
                  </div>
                  <div className="post-details4 mb-50">
                    <div className="small-section-tittle">
                      <h4>Thông tin công ty</h4>
                    </div>
                    <span>Tên công ty : {dataPost.company?.name}</span>
                    <ul>
                      <li>
                        Website : <span>{dataPost.company?.website}</span>
                      </li>
                      <li>
                        Địa chỉ : <span>{dataPost.company?.address}</span>
                      </li>
                      <li>
                        Email : <span>{dataPost.company?.email}</span>
                      </li>
                      <li>
                        Số nhân viên cần tuyển: <span>{dataPost.amount}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* <!-- job post company End --> */}
          <SendCvModal
            isOpen={isActiveModal}
            onHide={() => setActiveModal(false)}
            postId={id}
          />

          <ToastContainer />
        </main>
      )}
    </>
  );
};

export default JobDetail;
