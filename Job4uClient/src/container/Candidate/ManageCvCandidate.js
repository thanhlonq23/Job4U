import React, { useEffect, useState } from "react";
import { getAllListCvByUserIdService } from "../../service/cvService";
import { PAGINATION } from "../../util/constant";
import ReactPaginate from "react-paginate";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const ManageCvCandidate = () => {
  const [dataCv, setDataCv] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [user, setUser] = useState({});

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userData);

    if (userData && userData.userId) {
      fetchData(userData.userId, 0);
    } else {
      toast.error(
        "Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại."
      );
    }
  }, []);

  const fetchData = async (userId, page) => {
    try {
      if (!userId) {
        throw new Error("userId is undefined");
      }
      const response = await getAllListCvByUserIdService({
        userId: userId,
        page: page,
        size: PAGINATION.pagerow,
      });

      console.log("API Response:", response);

      if (response.status === "SUCCESS") {
        setDataCv(response.data.content);
        setTotalPages(response.data.totalPages);
      } else {
        toast.error(response.message);
      }
      console.log("AA");
      
      console.log(response.data);
    } catch (error) {
      toast.error(error.message || "Error fetching CVs");
    }
  };

  const handleChangePage = async (number) => {
    const selectedPage = number.selected;
    setCurrentPage(selectedPage);
    await fetchData(user.userId, selectedPage);
  };

  return (
    <div>
      <div className="col-12 grid-margin">
        <div className="card">
          <div className="card-body">
            <h4 className="card-title">Danh sách Công Việc Đã Nộp</h4>

            <div className="table-responsive pt-2">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Tên công việc</th>
                    <th>Lĩnh vực</th>
                    <th>Cấp bậc</th>
                    <th>Địa điểm</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {dataCv && dataCv.length > 0 ? (
                    dataCv.map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1 + currentPage * PAGINATION.pagerow}</td>
                        <td>{item.jobName}</td>
                        <td>{item.jobType}</td>
                        <td>{item.jobLevel}</td>
                        <td>{item.location}</td>
                        <td>{item.checked ? "Đã xem" : "Chưa xem"}</td>
                        <td>
                          <Link
                            style={{ color: "#4B49AC", cursor: "pointer" }}
                            to={`/detail-job/${item.postId}/`}
                          >
                            Xem công việc
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center">
                        Không có dữ liệu
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <ReactPaginate
            previousLabel={"Quay lại"}
            nextLabel={"Tiếp"}
            breakLabel={"..."}
            pageCount={totalPages}
            marginPagesDisplayed={3}
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
            onPageChange={handleChangePage}
            forcePage={currentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default ManageCvCandidate;
