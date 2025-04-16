import React, { useEffect, useState } from "react";
import { searchCompanyService } from "../../service/CompanyService";
import "./ListCompany.scss";
import ReactPaginate from "react-paginate";
import { Link } from "react-router-dom";

const ListCompany = () => {
  const [dataCompany, setDataCompany] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [keyword, setKeyword] = useState("");

  const PAGE_SIZE = 10;

  const fetchCompanies = async (page = 0, searchKeyword = "") => {
    try {
      setIsLoading(true);
      const response = await searchCompanyService({
        page: page,
        size: PAGE_SIZE,
        keyword: searchKeyword,
      });

      if (response.status === "SUCCESS") {
        setDataCompany(response.data.content);
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      console.error("Error fetching companies:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies(0);
  }, []);

  const handlePageChange = (selectedPage) => {
    const newPage = selectedPage.selected;
    setCurrentPage(newPage);
    fetchCompanies(newPage, keyword);
  };

  const handleSearch = () => {
    setCurrentPage(0);
    fetchCompanies(0, keyword);
  };

  // Xử lý khi nhấn Enter
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="container-company">
      <h3 className="title">DANH SÁCH CÁC CÔNG TY</h3>

      <div className="search-container d-flex align-items-center gap-2 mb-3">
        <input
          type="text"
          className="form-control search-input"
          placeholder="Tìm kiếm công ty..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyPress={handleKeyPress}
          style={{ marginBottom: "30px", height: "3.5rem" }}
        />
        <button
          className="btn btn-primary mr-2"
          type="submit"
          style={{ marginBottom: "30px" }}
        >
          <i className="bi bi-search me-1"></i> Tìm kiếm
        </button>
      </div>

      {isLoading && <div className="loading">Đang tải...</div>}

      <div className="row list-company">
        {dataCompany &&
          dataCompany.length > 0 &&
          dataCompany.map((item, index) => (
            <div key={index} className="col-md-4 col-sm-6">
              <div className="box-item-company">
                <div className="company-banner">
                  <Link to={`/detail-company/${item.id}`}>
                    <div className="cover-wrapper">
                      <img src={item.coverImage} alt={`${item.name} cover`} />
                    </div>
                  </Link>
                  <div className="company-logo">
                    <Link to={`/detail-company/${item.id}`}>
                      <img
                        className="img-fluid"
                        src={item.thumbnail}
                        alt={`${item.name} logo`}
                      />
                    </Link>
                  </div>
                </div>
                <div className="company-info">
                  <h3>
                    <Link
                      to={`/detail-company/${item.id}`}
                      className="company-name"
                    >
                      {item.name}
                    </Link>
                  </h3>
                  <div className="company-description">
                    <p>{item.description_Markdown}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        {!isLoading && dataCompany.length === 0 && (
          <div className="no-data">Không tìm thấy công ty nào</div>
        )}
      </div>

      {totalPages > 1 && (
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
      )}
    </div>
  );
};

export default ListCompany;
