import React from "react";
import { useEffect, useState } from "react";
import { getAllListCvByPostIdService } from "../../../service/cvService";

import { PAGINATION } from "../../../util/constant";
import ReactPaginate from "react-paginate";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";

const ManageCv = () => {
  const [dataCv, setDataCv] = useState([]);
  const [count, setCount] = useState(0);
  const [numberPage, setNumberPage] = useState(0);
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      fetchData(0);
    }
  }, [id]);

  const fetchData = async (page) => {
    try {
      const response = await getAllListCvByPostIdService({
        page: page,
        size: PAGINATION.pagerow,
        postId: id,
      });

      if (response?.status === "SUCCESS" && response.data) {
        setDataCv(response.data.content);
        setCount(response.data.totalPages);
      } else {
        console.error("Error fetching data:", response?.message);
        setDataCv([]);
      }
    } catch (error) {
      console.error("Error connecting to server:", error);
      setDataCv([]);
    }
  };

  const handleChangePage = async (number) => {
    setNumberPage(number.selected);
    await fetchData(number.selected);
  };

  return (
    <div>
      <div className="col-12 grid-margin">
        <div className="card">
          <div className="card-body">
            <h4 className="card-title">Danh sách CV</h4>

            <div className="table-responsive pt-2">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Tên người nộp</th>
                    <th>Email</th>
                    <th>Địa chỉ</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {dataCv &&
                    dataCv.length > 0 &&
                    dataCv.map((item, index) => {
                      return (
                        <tr key={index}>
                          <td>{index + 1 + numberPage * PAGINATION.pagerow}</td>
                          <td>{item.firstName + " " + item.lastName}</td>
                          <td>{item.email}</td>
                          <td>{item.address}</td>
                          <td>
                            {item.checked === false ? "Chưa xem" : "Đã xem"}
                          </td>
                          <td>
                            <Link
                              style={{ color: "#4B49AC", cursor: "pointer" }}
                              to={`/admin/user-cv/${item.id}/`}
                            >
                              Xem CV
                            </Link>
                            &nbsp; &nbsp;
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
          <ReactPaginate
            previousLabel={"Quay lại"}
            nextLabel={"Tiếp"}
            breakLabel={"..."}
            pageCount={count}
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
          />
        </div>
      </div>
    </div>
  );
};

export default ManageCv;
