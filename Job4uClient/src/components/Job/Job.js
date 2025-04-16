import React from "react";
import moment from "moment";
import "moment/locale/vi";

const Job = ({ data }) => {
  // Set moment locale to Vietnamese
  moment.locale("vi");

  // Format expiration date and created date
  const expirationDate = moment(data.expirationDate).format("DD/MM/YYYY");
  const timeSincePosted = moment(data.createdAt).fromNow();

  // Calculate days left until expiration
  const daysUntilExpiration = moment(data.expirationDate).diff(
    moment(),
    "days"
  );

  return (
    <>
      <div className="job-items d-flex align-items-center n">
        {/* Company Logo */}
        <div className="company-img">
          {data.companyLogo ? (
            <img
              src={data.companyLogo}
              alt={data.companyName}
              style={{ width: "70px", height: "auto", objectFit: "contain" }}
            />
          ) : (
            <img
              src="/assets/img/icon/job-list1.png"
              alt="default company logo"
            />
          )}
        </div>

        {/* Job Details */}
        <div className="job-tittle job-tittle2 flex-grow-1">
          <h4>{data.name}</h4>
          <ul className="job-details-list">
            <li>
              <i className="fas fa-building"></i> {data.companyName}
            </li>
            <li>
              <i className="fas fa-map-marker-alt"></i> {data.locationName}
            </li>
            <li>
              <i className="fas fa-dollar-sign"></i> {data.salaryRange}
            </li>
            <li>
              <i className="fas fa-clock mr-1"></i>Đăng {timeSincePosted}
            </li>
          </ul>
        </div>
      </div>

      {/* Tags Section */}
      <div className="w-100 mt-3">
        <div
          className="items-link items-link2 d-flex flex-wrap justify-content-start"
          style={{ gap: "1rem" }}
        >
          <div>
            <span>
              <i className="fas fa-briefcase mr-1"></i>
              {data.workTypeName}
            </span>
          </div>
          <div>
            <span>
              <i className="fas fa-user-tie mr-1"></i>
              {data.jobLevelName}
            </span>
          </div>
          <div>
            <span>
              <i className="fas fa-star mr-1"></i>
              {data.experienceName}
            </span>
          </div>
          {daysUntilExpiration > 0 ? (
            <div>
              <span className="text-secondary">
                <i className="fas fa-clock mr-1"></i>
                Còn {daysUntilExpiration} ngày để ứng tuyển
              </span>
            </div>
          ) : (
            <div>
              {/* <span className="text-danger">
                <i className="fas fa-calendar-times mr-1"></i>
                Đã hết hạn
              </span> */}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Job;
