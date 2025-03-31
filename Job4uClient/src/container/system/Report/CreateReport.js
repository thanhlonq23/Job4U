import React, { useState, useEffect } from "react";
import {
  getSkillDemandService,
  getApplicationTrendService,
} from "../../../service/ReportService";
import { getAllCategoriesService } from "../../../service/DataService";
import { saveAs } from "file-saver";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  Cell,
} from "recharts";
import ExcelJS from "exceljs";

const CreateReport = () => {
  const [reportType, setReportType] = useState("skill-demand");
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [skillDemandData, setSkillDemandData] = useState(null);
  const [applicationTrendData, setApplicationTrendData] = useState(null);
  const [error, setError] = useState(null);
  const [showExportPopup, setShowExportPopup] = useState(false);
  const [exportOptions, setExportOptions] = useState({
    topSkills: true,
    skillTrends: true,
    salaryData: true,
    applicationsByHour: true,
    categoryApplications: true,
  });

  const handleReportTypeChange = (e) => {
    setReportType(e.target.value);
    setSkillDemandData(null);
    setApplicationTrendData(null);
    setError(null);
    if (e.target.value === "skill-demand") {
      fetchCategories();
    }
    // Reset export options based on report type
    setExportOptions({
      topSkills: e.target.value === "skill-demand",
      skillTrends: e.target.value === "skill-demand",
      salaryData: e.target.value === "skill-demand",
      applicationsByHour: e.target.value === "application-trend",
      categoryApplications: e.target.value === "application-trend",
    });
  };

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const response = await getAllCategoriesService();
      if (response?.status === "SUCCESS") {
        setCategories(response.data);
        if (response.data.length > 0) {
          setSelectedCategoryId(response.data[0].id);
        }
      } else {
        setError("Không thể lấy danh sách danh mục");
      }
    } catch (error) {
      setError("Lỗi khi lấy danh sách danh mục");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (reportType === "skill-demand") {
      fetchCategories();
    }
  }, []);

  const handleCategoryChange = (e) => {
    setSelectedCategoryId(e.target.value);
    setSkillDemandData(null);
  };

  const handleAnalyze = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (reportType === "skill-demand") {
        if (!selectedCategoryId) {
          setError("Vui lòng chọn một danh mục để phân tích");
          setIsLoading(false);
          return;
        }
        const response = await getSkillDemandService(selectedCategoryId);
        if (response?.status === "SUCCESS") {
          setSkillDemandData(response.data);
        } else {
          setError("Không thể lấy dữ liệu phân tích kỹ năng");
        }
      } else if (reportType === "application-trend") {
        const response = await getApplicationTrendService();
        if (response?.status === "SUCCESS") {
          setApplicationTrendData(response.data);
        } else {
          setError("Không thể lấy dữ liệu xu hướng ứng tuyển");
        }
      }
    } catch (error) {
      setError("Lỗi khi phân tích dữ liệu");
    } finally {
      setIsLoading(false);
    }
  };

  const getRandomColors = (count) => {
    const colors = [];
    for (let i = 0; i < count; i++) {
      const hue = (i * 137) % 360;
      colors.push(`hsl(${hue}, 70%, 50%)`);
    }
    return colors;
  };

  const prepareTopSkillsChartData = () =>
    skillDemandData?.topSkillDemand?.map((item, index) => ({
      title: item.skill_name,
      value: item.demand_count,
      color: getRandomColors(skillDemandData.topSkillDemand.length)[index],
    })) || [];

  const prepareSkillTrendData = () => {
    if (!skillDemandData?.skillTrends) return [];
    const monthGroups = {};
    skillDemandData.skillTrends.forEach((item) => {
      if (!monthGroups[item.month]) monthGroups[item.month] = {};
      monthGroups[item.month][item.skill_name] = item.demand_count;
    });
    return Object.keys(monthGroups).map((month) => ({
      month,
      ...monthGroups[month],
    }));
  };

  const prepareSalaryData = () =>
    skillDemandData?.salaryBySkill?.map((item) => ({
      name: item.skill_name,
      salary: item.avg_salary,
    })) || [];

  const prepareApplicationsByHourData = () => {
    const fullDayData = Array.from({ length: 24 }, (_, hour) => ({
      hour: `${hour}:00`,
      count: 0,
    }));
    applicationTrendData?.applicationsByHourOfDay?.forEach((item) => {
      const hourIndex = item.hour_of_day;
      if (hourIndex >= 0 && hourIndex < 24) {
        fullDayData[hourIndex] = {
          hour: `${hourIndex}:00`,
          count: item.application_count,
        };
      }
    });
    return fullDayData;
  };

  const prepareCategoryApplicationsData = () =>
    applicationTrendData?.categoryConversionRates?.map((item, index) => ({
      name: item.category_name,
      applications: item.application_count,
      posts: item.post_count,
      color: getRandomColors(
        applicationTrendData.categoryConversionRates.length
      )[index],
    })) || [];

  const handleExportOptionChange = (option) => {
    setExportOptions((prev) => ({ ...prev, [option]: !prev[option] }));
  };

  const isExportEnabled = () => Object.values(exportOptions).some(Boolean);

  const exportToExcel = async () => {
    if (
      (reportType === "skill-demand" && !skillDemandData) ||
      (reportType === "application-trend" && !applicationTrendData) ||
      !isExportEnabled()
    ) {
      setError(
        "Vui lòng chọn ít nhất một loại dữ liệu để xuất và phân tích dữ liệu trước"
      );
      return;
    }

    try {
      const workbook = new ExcelJS.Workbook();
      workbook.creator = "JobConnect System";
      workbook.created = new Date();

      if (reportType === "skill-demand" && skillDemandData) {
        const categoryName =
          skillDemandData.topSkillDemand[0]?.category_name ||
          "Khong-co-du-lieu";

        if (exportOptions.topSkills && skillDemandData.topSkillDemand) {
          const topSkillsSheet = workbook.addWorksheet("Top kỹ năng");
          topSkillsSheet.columns = [
            { header: "STT", key: "stt", width: 5 },
            { header: "Kỹ năng", key: "skill", width: 30 },
            { header: "Số lượng yêu cầu", key: "count", width: 20 },
          ];
          topSkillsSheet.getRow(1).font = { bold: true };
          topSkillsSheet.getRow(1).fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFD3D3D3" },
          };
          skillDemandData.topSkillDemand.forEach((item, index) => {
            topSkillsSheet.addRow({
              stt: index + 1,
              skill: item.skill_name,
              count: item.demand_count,
            });
          });
        }

        if (exportOptions.skillTrends && skillDemandData.skillTrends) {
          const skillTrendsSheet = workbook.addWorksheet("Xu hướng kỹ năng");
          skillTrendsSheet.columns = [
            { header: "STT", key: "stt", width: 5 },
            { header: "Tháng", key: "month", width: 15 },
            { header: "Kỹ năng", key: "skill", width: 30 },
            { header: "Số lượng yêu cầu", key: "count", width: 20 },
          ];
          skillTrendsSheet.getRow(1).font = { bold: true };
          skillTrendsSheet.getRow(1).fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFD3D3D3" },
          };
          skillDemandData.skillTrends.forEach((item, index) => {
            skillTrendsSheet.addRow({
              stt: index + 1,
              month: item.month,
              skill: item.skill_name,
              count: item.demand_count,
            });
          });
        }

        if (exportOptions.salaryData && skillDemandData.salaryBySkill) {
          const salarySheet = workbook.addWorksheet("Mức lương theo kỹ năng");
          salarySheet.columns = [
            { header: "STT", key: "stt", width: 5 },
            { header: "Kỹ năng", key: "skill", width: 30 },
            { header: "Mức lương trung bình", key: "salary", width: 25 },
          ];
          salarySheet.getRow(1).font = { bold: true };
          salarySheet.getRow(1).fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFD3D3D3" },
          };
          skillDemandData.salaryBySkill.forEach((item, index) => {
            const row = salarySheet.addRow({
              stt: index + 1,
              skill: item.skill_name,
              salary: item.avg_salary,
            });
            row.getCell("salary").numFmt = '#,##0 "đồng"';
          });
        }

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(blob, `bao-cao-ky-nang-${categoryName}.xlsx`);
      }

      if (reportType === "application-trend" && applicationTrendData) {
        if (
          exportOptions.applicationsByHour &&
          applicationTrendData.applicationsByHourOfDay
        ) {
          const applicationsByHourSheet = workbook.addWorksheet(
            "Tần suất ứng tuyển theo giờ"
          );
          applicationsByHourSheet.columns = [
            { header: "STT", key: "stt", width: 5 },
            { header: "Giờ", key: "hour", width: 15 },
            { header: "Số lượng ứng tuyển", key: "count", width: 20 },
          ];
          applicationsByHourSheet.getRow(1).font = { bold: true };
          applicationsByHourSheet.getRow(1).fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFD3D3D3" },
          };
          prepareApplicationsByHourData().forEach((item, index) => {
            applicationsByHourSheet.addRow({
              stt: index + 1,
              hour: item.hour,
              count: item.count,
            });
          });
        }

        if (
          exportOptions.categoryApplications &&
          applicationTrendData.categoryConversionRates
        ) {
          const categoryApplicationsSheet = workbook.addWorksheet(
            "Ứng tuyển theo danh mục"
          );
          categoryApplicationsSheet.columns = [
            { header: "STT", key: "stt", width: 5 },
            { header: "Danh mục", key: "category", width: 30 },
            { header: "Số lượng ứng tuyển", key: "applications", width: 20 },
            { header: "Số lượng bài đăng", key: "posts", width: 20 },
          ];
          categoryApplicationsSheet.getRow(1).font = { bold: true };
          categoryApplicationsSheet.getRow(1).fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFD3D3D3" },
          };
          applicationTrendData.categoryConversionRates.forEach(
            (item, index) => {
              categoryApplicationsSheet.addRow({
                stt: index + 1,
                category: item.category_name,
                applications: item.application_count,
                posts: item.post_count,
              });
            }
          );
        }

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(blob, `bao-cao-xu-huong-ung-tuyen.xlsx`);
      }

      setShowExportPopup(false);
    } catch (error) {
      setError("Lỗi khi xuất file Excel");
    }
  };

  return (
    <div>
      <div className="col-12 grid-margin">
        <div className="card">
          <div className="card-body">
            <h4 className="card-title">Phân tích</h4>

            <div className="form-group row mb-4">
              <label className="col-sm-2 col-form-label">Loại phân tích:</label>
              <div className="col-sm-4">
                <select
                  value={reportType}
                  onChange={handleReportTypeChange}
                  className="form-control"
                >
                  <option value="application-trend">
                    Phân tích xu hướng ứng tuyển
                  </option>
                  <option value="skill-demand">
                    Phân tích nhu cầu kỹ năng
                  </option>
                </select>
              </div>
            </div>

            {reportType === "skill-demand" && (
              <div className="form-group row mb-4">
                <label className="col-sm-2 col-form-label">Lĩnh vực:</label>
                <div className="col-sm-4">
                  <select
                    value={selectedCategoryId}
                    onChange={handleCategoryChange}
                    className="form-control"
                    disabled={isLoading || categories.length === 0}
                  >
                    {categories.length === 0 && (
                      <option value="">Không có dữ liệu danh mục</option>
                    )}
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-sm-2">
                  <button
                    onClick={handleAnalyze}
                    disabled={isLoading || !selectedCategoryId}
                    className="btn btn-primary"
                  >
                    {isLoading ? "Đang phân tích..." : "Phân tích"}
                  </button>
                </div>
              </div>
            )}

            {reportType === "application-trend" && (
              <div className="form-group row mb-4">
                <div className="col-sm-2 offset-sm-2">
                  <button
                    onClick={handleAnalyze}
                    disabled={isLoading}
                    className="btn btn-primary"
                  >
                    {isLoading ? "Đang phân tích..." : "Phân tích"}
                  </button>
                </div>
              </div>
            )}

            {error && (
              <div className="alert alert-danger mb-4" role="alert">
                {error}
              </div>
            )}

            {(skillDemandData || applicationTrendData) && (
              <div>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5>
                    {reportType === "skill-demand"
                      ? "Phân tích nhu cầu kỹ năng"
                      : "Phân tích xu hướng ứng tuyển"}
                  </h5>
                  <button
                    onClick={() => setShowExportPopup(true)}
                    className="btn btn-success btn-sm"
                  >
                    Xuất dữ liệu
                  </button>
                </div>

                {showExportPopup && (
                  <div
                    className="modal-overlay"
                    style={{
                      position: "fixed",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: "rgba(0, 0, 0, 0.5)",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      zIndex: 1000,
                    }}
                  >
                    <div
                      className="modal-container"
                      style={{
                        backgroundColor: "white",
                        padding: "20px",
                        borderRadius: "5px",
                        width: "500px",
                        maxWidth: "90%",
                      }}
                    >
                      <p>Chọn loại dữ liệu bạn muốn xuất:</p>
                      {reportType === "skill-demand" && (
                        <>
                          <div
                            className="form-check"
                            style={{
                              marginLeft: "10px",
                            }}
                          >
                            <input
                              type="checkbox"
                              id="topSkills"
                              checked={exportOptions.topSkills}
                              onChange={() =>
                                handleExportOptionChange("topSkills")
                              }
                              className="form-check-input"
                              style={{
                                marginLeft: "10px",
                              }}
                            />
                            <label
                              htmlFor="topSkills"
                              className="form-check-label"
                            >
                              Yêu cầu kỹ năng
                            </label>
                          </div>
                          <div
                            className="form-check"
                            style={{
                              marginLeft: "10px",
                            }}
                          >
                            <input
                              type="checkbox"
                              id="skillTrends"
                              checked={exportOptions.skillTrends}
                              onChange={() =>
                                handleExportOptionChange("skillTrends")
                              }
                              className="form-check-input"
                              style={{
                                marginLeft: "10px",
                              }}
                            />
                            <label
                              htmlFor="skillTrends"
                              className="form-check-label"
                            >
                              Yêu cầu kỹ năng theo thời gian
                            </label>
                          </div>
                          <div
                            className="form-check"
                            style={{
                              marginLeft: "10px",
                            }}
                          >
                            <input
                              type="checkbox"
                              id="salaryData"
                              checked={exportOptions.salaryData}
                              onChange={() =>
                                handleExportOptionChange("salaryData")
                              }
                              className="form-check-input"
                              style={{
                                marginLeft: "10px",
                              }}
                            />
                            <label
                              htmlFor="salaryData"
                              className="form-check-label"
                            >
                              Mức lương trung bình theo kỹ năng
                            </label>
                          </div>
                        </>
                      )}
                      {reportType === "application-trend" && (
                        <>
                          <div className="form-check">
                            <input
                              type="checkbox"
                              id="applicationsByHour"
                              checked={exportOptions.applicationsByHour}
                              onChange={() =>
                                handleExportOptionChange("applicationsByHour")
                              }
                              className="form-check-input"
                            />
                            <label
                              htmlFor="applicationsByHour"
                              className="form-check-label"
                            >
                              Tần suất ứng tuyển theo giờ
                            </label>
                          </div>
                          <div className="form-check">
                            <input
                              type="checkbox"
                              id="categoryApplications"
                              checked={exportOptions.categoryApplications}
                              onChange={() =>
                                handleExportOptionChange("categoryApplications")
                              }
                              className="form-check-input"
                            />
                            <label
                              htmlFor="categoryApplications"
                              className="form-check-label"
                            >
                              Ứng tuyển theo danh mục
                            </label>
                          </div>
                        </>
                      )}
                      <div
                        className="mt-3"
                        style={{
                          marginLeft: "170px",
                        }}
                      >
                        <button
                          onClick={() => setShowExportPopup(false)}
                          className="btn btn-secondary mr-2"
                        >
                          Hủy
                        </button>
                        <button
                          onClick={exportToExcel}
                          className="btn btn-primary"
                          disabled={!isExportEnabled()}
                        >
                          Xuất Excel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {skillDemandData && (
              <div>
                <div className="row mb-4">
                  <div className="col-md-12">
                    <div className="card">
                      <div className="card-body">
                        <h6 className="card-title mb-3">Dữ liệu chi tiết</h6>
                        <div className="table-responsive">
                          <table className="table table-bordered">
                            <thead className="thead-light">
                              <tr>
                                <th>STT</th>
                                <th>Kỹ năng</th>
                                <th>Số lượng yêu cầu</th>
                                <th>Mức lương trung bình</th>
                              </tr>
                            </thead>
                            <tbody>
                              {skillDemandData.topSkillDemand.map(
                                (item, index) => {
                                  const salaryInfo =
                                    skillDemandData.salaryBySkill.find(
                                      (s) => s.skill_name === item.skill_name
                                    );
                                  return (
                                    <tr key={index}>
                                      <td>{index + 1}</td>
                                      <td>{item.skill_name}</td>
                                      <td>{item.demand_count}</td>
                                      {/* <td>
                                        {salaryInfo
                                          ? salaryInfo.avg_salary.toLocaleString(
                                              "vi-VN"
                                            ) + " đồng"
                                          : "N/A"}
                                      </td> */}
                                      <td>
                                        {salaryInfo
                                          ? `$${salaryInfo.avg_salary.toLocaleString(
                                              "en-US"
                                            )}`
                                          : "N/A"}
                                      </td>
                                    </tr>
                                  );
                                }
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row mb-5">
                  <div className="col-md-12">
                    <div className="card">
                      <div className="card-body">
                        <h6 className="card-title mb-4">Yêu cầu kỹ năng</h6>
                        <div
                          style={{
                            width: "70%",
                            height: "300px",
                            margin: "0 auto",
                          }}
                        >
                          <ResponsiveContainer>
                            <BarChart data={prepareTopSkillsChartData()}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis
                                dataKey="title"
                                angle={-45}
                                textAnchor="end"
                                height={70}
                              />
                              <YAxis />
                              <Tooltip />
                              <Bar dataKey="value" name="Số lượng yêu cầu">
                                {prepareTopSkillsChartData().map(
                                  (entry, index) => (
                                    <Cell key={index} fill={entry.color} />
                                  )
                                )}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="mt-4">
                          <div className="row">
                            {prepareTopSkillsChartData().map((skill, index) => (
                              <div key={index} className="col-md-4 mb-2">
                                <div className="d-flex align-items-center">
                                  <div
                                    style={{
                                      width: "15px",
                                      height: "15px",
                                      backgroundColor: skill.color,
                                      marginRight: "8px",
                                    }}
                                  ></div>
                                  <span>
                                    {skill.title}: {skill.value}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* <div className="row mb-5">
                  <div className="col-md-12">
                    <div className="card">
                      <div className="card-body">
                        <h6 className="card-title mb-4">
                          Yêu cầu kỹ năng theo thời gian
                        </h6>
                        <div style={{ width: "100%", height: "400px" }}>
                          <ResponsiveContainer>
                            <LineChart data={prepareSkillTrendData()}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="month" />
                              <YAxis />
                              <Tooltip />
                              <Legend />
                              {Object.keys(prepareSkillTrendData()[0] || {})
                                .filter((key) => key !== "month")
                                .map((skill, index) => (
                                  <Line
                                    key={index}
                                    type="monotone"
                                    dataKey={skill}
                                    stroke={getRandomColors(10)[index]}
                                    activeDot={{ r: 8 }}
                                  />
                                ))}
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                  </div>
                </div> */}

                <div className="row mb-5">
                  <div className="col-md-12">
                    <div className="card">
                      <div className="card-body">
                        <h6 className="card-title mb-4">
                          Mức lương trung bình theo kỹ năng
                        </h6>
                        <div style={{ width: "100%", height: "400px" }}>
                          <ResponsiveContainer>
                            <BarChart data={prepareSalaryData()}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis
                                dataKey="name"
                                angle={-45}
                                textAnchor="end"
                                height={70}
                              />
                              <YAxis />
                              <Tooltip
                                formatter={(value) =>
                                  value.toLocaleString("vi-VN") + " đồng"
                                }
                              />
                              <Legend />
                              <Bar
                                dataKey="salary"
                                fill="#8884d8"
                                name="Mức lương trung bình"
                              />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {applicationTrendData && (
              <div>
                <div className="row mb-5">
                  <div className="col-md-12">
                    <div className="card">
                      <div className="card-body">
                        <h6 className="card-title mb-4">
                          Tần suất ứng tuyển các khung giờ trong ngày
                        </h6>
                        <div style={{ width: "100%", height: "400px" }}>
                          <ResponsiveContainer>
                            <LineChart data={prepareApplicationsByHourData()}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="hour" interval={0} />
                              <YAxis
                                label={{
                                  value: "Số lượng ứng tuyển",
                                  angle: -90,
                                  position: "insideLeft",
                                }}
                              />
                              <Tooltip />
                              <Legend />
                              <Line
                                type="monotone"
                                dataKey="count"
                                stroke="#82ca9d"
                                name="Số lượng ứng tuyển"
                                activeDot={{ r: 8 }}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row mb-5">
                  <div className="col-md-12">
                    <div className="card">
                      <div className="card-body">
                        <h6 className="card-title mb-4">
                          Số lượng ứng tuyển theo lĩnh vực
                        </h6>
                        <div style={{ width: "100%", height: "400px" }}>
                          <ResponsiveContainer>
                            <BarChart data={prepareCategoryApplicationsData()}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" height={60} />
                              <YAxis
                                label={{
                                  value: "Số lượng",
                                  angle: -90,
                                  position: "insideLeft",
                                }}
                              />
                              <Tooltip />
                              <Legend />
                              <Bar
                                dataKey="applications"
                                fill="#8884d8"
                                name="Số lượng ứng tuyển"
                              />
                              <Bar
                                dataKey="posts"
                                fill="#82ca9d"
                                name="Số lượng bài đăng"
                              />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="mt-4">
                          <div className="row">
                            {prepareCategoryApplicationsData().map(
                              (item, index) => (
                                <div key={index} className="col-md-4 mb-2">
                                  <div className="d-flex align-items-center">
                                    <div
                                      style={{
                                        width: "15px",
                                        height: "15px",
                                        backgroundColor: item.color,
                                        marginRight: "8px",
                                      }}
                                    ></div>
                                    <span>
                                      {item.name}: {item.applications} ứng
                                      tuyển, {item.posts} bài đăng
                                    </span>
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateReport;
