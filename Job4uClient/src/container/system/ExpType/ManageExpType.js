import React, { useEffect, useState } from "react";
import {
  getAllExperienceService,
  deleteExperienceService,
} from "../../../service/ExperienceService";
import { PAGINATION } from "../../../util/constant";
import ReactPaginate from "react-paginate";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const ManageExperience = () => {
  const [dataExperience, setDataExperience] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // **FETCH DỮ LIỆU**
  const fetchExperiences = async (page = 0) => {
    setIsLoading(true);
    try {
      const response = await getAllExperienceService({
        page,
        size: PAGINATION.pagerow,
      });
      if (response && response.data) {
        const { content, totalPages } = response.data;
        setDataExperience(content);
        setTotalPages(totalPages);
      } else {
        toast.error("Dữ liệu không hợp lệ!");
      }
    } catch (error) {
      console.error("Lỗi khi fetch dữ liệu:", error);
      toast.error("Không thể tải dữ liệu danh sách!");
    } finally {
      setIsLoading(false);
    }
  };

  // **GỌI FETCH DỮ LIỆU LẦN ĐẦU**
  useEffect(() => {
    fetchExperiences(0);
  }, []);

  // **XÓA CẤP BẬC**
  const handleDeleteExperience = async (event, id) => {
    event.preventDefault();
    if (window.confirm("Bạn có chắc chắn muốn xóa kinh nghiệm  này?")) {
      try {
        const res = await deleteExperienceService(id);
        if (res && res.status === "SUCCESS") {
          toast.success("Xóa kinh nghiệm  thành công");
          // Xóa phần tử khỏi danh sách hiện tại
          const updatedData = dataExperience.filter((item) => item.id !== id);
          setDataExperience(updatedData);

          // Kiểm tra xem có cần giảm số trang không
          if (updatedData.length === 0 && currentPage > 0) {
            setCurrentPage((prev) => prev - 1);
            fetchExperiences(currentPage - 1);
          }
        } else {
          toast.error(res?.message || "Xóa kinh nghiệm  thất bại!");
        }
      } catch (error) {
        console.error("Lỗi khi xóa kinh nghiệm :", error);
        toast.error("Đã xảy ra lỗi khi xóa kinh nghiệm !");
      }
    }
  };

  // **XỬ LÝ PHÂN TRANG**
  const handlePageChange = async (selectedPage) => {
    setCurrentPage(selectedPage.selected);
    await fetchExperiences(selectedPage.selected);
  };

  // **RENDER GIAO DIỆN**
  return (
    <div>
      <div className="col-12 grid-margin">
        <div className="card">
          <div className="card-body">
            <h4 className="card-title">DANH SÁCH KINH NGHIỆM </h4>
            <div className="table-responsive pt-2">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Tên kinh nghiệm </th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td
                        colSpan="3"
                        style={{ textAlign: "center", padding: "20px" }}
                      >
                        Đang tải dữ liệu...
                      </td>
                    </tr>
                  ) : dataExperience.length > 0 ? (
                    dataExperience.map((item, index) => (
                      <tr key={item.id}>
                        {/* Số thứ tự chính xác dựa trên trang hiện tại */}
                        <td>{currentPage * PAGINATION.pagerow + index + 1}</td>
                        <td>{item.name}</td>
                        <td>
                          <Link
                            style={{ color: "#4B49AC" }}
                            to={`/admin/edit-exp-type/${item.id}/`}
                          >
                            Cập nhật
                          </Link>
                          &nbsp; &nbsp;
                          <a
                            style={{ color: "#4B49AC" }}
                            href="#"
                            onClick={(event) =>
                              handleDeleteExperience(event, item.id)
                            }
                          >
                            Xóa
                          </a>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="3"
                        style={{ textAlign: "center", padding: "20px" }}
                      >
                        Không có dữ liệu.
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
            pageRangeDisplayed={5}
            onPageChange={handlePageChange}
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
            forcePage={currentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default ManageExperience;
