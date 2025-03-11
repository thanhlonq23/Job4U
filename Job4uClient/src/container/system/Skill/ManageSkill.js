import React, { useEffect, useState } from "react";
import {
  getAllSkillService,
  deleteSkillService,
} from "../../../service/SkillService";
import { PAGINATION } from "../../../util/constant";
import ReactPaginate from "react-paginate";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const ManageSkill = () => {
  const [dataSkill, setDataSkill] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // **FETCH DỮ LIỆU**
  const fetchSkills = async (page = 0) => {
    setIsLoading(true);
    try {
      const response = await getAllSkillService({
        page,
        size: PAGINATION.pagerow,
      });
      if (response && response.data) {
        const { content, totalPages } = response.data;
        setDataSkill(content);
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
    fetchSkills(0);
  }, []);

  // **XÓA KỸ NĂNG**
  const handleDeleteSkill = async (event, id) => {
    event.preventDefault();
    if (window.confirm("Bạn có chắc chắn muốn xóa kỹ năng này?")) {
      try {
        const res = await deleteSkillService(id);
        if (res && res.errCode === 0) {
          toast.success("Xóa kỹ năng thành công");
          // Xóa phần tử khỏi danh sách hiện tại
          const updatedData = dataSkill.filter((item) => item.id !== id);
          setDataSkill(updatedData);

          // Kiểm tra xem có cần giảm số trang không
          if (updatedData.length === 0 && currentPage > 0) {
            setCurrentPage((prev) => prev - 1);
            fetchSkills(currentPage - 1);
          }
        } else {
          toast.error(res?.errMessage || "Xóa kỹ năng thất bại!");
        }
      } catch (error) {
        console.error("Lỗi khi xóa kỹ năng:", error);
        toast.error("Đã xảy ra lỗi khi xóa kỹ năng!");
      }
    }
  };

  // **XỬ LÝ PHÂN TRANG**
  const handlePageChange = async (selectedPage) => {
    setCurrentPage(selectedPage.selected);
    await fetchSkills(selectedPage.selected);
  };

  // **RENDER GIAO DIỆN**
  return (
    <div>
      <div className="col-12 grid-margin">
        <div className="card">
          <div className="card-body">
            <h4 className="card-title">Danh sách kỹ năng</h4>
            <div className="table-responsive pt-2">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Tên kỹ năng</th>
                    <th>Lĩnh vực</th>
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
                  ) : dataSkill.length > 0 ? (
                    dataSkill.map((item, index) => (
                      <tr key={item.id}>
                        {/* Số thứ tự chính xác dựa trên trang hiện tại */}
                        <td>{currentPage * PAGINATION.pagerow + index + 1}</td>
                        <td>{item.name}</td>
                        <td>{item.category.name}</td>
                        <td>
                          <Link
                            style={{ color: "#4B49AC" }}
                            to={`/admin/edit-skill-type/${item.id}/`}
                          >
                            Cập nhật
                          </Link>
                          &nbsp; &nbsp;
                          <a
                            style={{ color: "#4B49AC" }}
                            href="#"
                            onClick={(event) =>
                              handleDeleteSkill(event, item.id)
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

export default ManageSkill;
