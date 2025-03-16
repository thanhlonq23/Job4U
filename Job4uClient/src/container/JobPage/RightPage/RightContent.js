import React from "react";
import { Link } from "react-router-dom";
import Job from "../../../components/Job/Job";

const RightContent = ({ count, post, loading, onSortChange, currentSort }) => {
  return (
    <>
      <section className="featured-job-area">
        <div className="container">
          {/* <!-- Count of Job list Start --> */}
          <div className="row">
            <div className="col-lg-12">
              <div className="count-job mb-35">
                <span>{count} công việc tìm thấy</span>
                {/* <!-- Select job items start --> */}
                <div className="select-job-items">
                  <span>Sắp xếp theo</span>
                  <select
                    name="select"
                    value={currentSort}
                    onChange={(e) => onSortChange(e.target.value)}
                    className="form-control form-control-sm d-inline-block w-auto ml-2"
                  >
                    <option value="createdAt_desc">Mới nhất</option>
                    <option value="createdAt_asc">Cũ nhất</option>
                    <option value="name_asc">Tên A-Z</option>
                    <option value="name_desc">Tên Z-A</option>
                    <option value="expirationDate_asc">
                      Ngày hết hạn (gần nhất)
                    </option>
                    <option value="expirationDate_desc">
                      Ngày hết hạn (xa nhất)
                    </option>
                  </select>
                </div>
                {/* <!--  Select job items End--> */}
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="sr-only">Đang tải...</span>
              </div>
              <p className="mt-2">Đang tải công việc...</p>
            </div>
          ) : post && post.length > 0 ? (
            post.map((data) => (
              <Link to={`/detail-job/${data.id}`} key={data.id}>
                <div className="single-job-items mb-30 transition-hover-shadow">
                  <Job data={data} />
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center py-5">
              <div className="alert alert-info">
                <i className="fas fa-info-circle mr-2"></i>
                Không tìm thấy công việc phù hợp. Vui lòng thử lại với bộ lọc
                khác.
              </div>
              <button
                className="btn btn-outline-primary mt-2"
                onClick={() => window.location.reload()}
              >
                <i className="fas fa-sync-alt mr-2"></i>
                Tải lại trang
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default RightContent;
