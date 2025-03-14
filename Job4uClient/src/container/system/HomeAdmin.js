import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Header from "./Header";
import Menu from "./Menu";
import Footer from "./Footer";
import Home from "./Home";
import ABC from "./ABC";
import ManageUser from "./User/ManageUser";
import UpdateUser from "./User/UpdateUser";
import AddCategory from "./Category/AddCategory";
import ManageCategory from "./Category/ManageCategory";
import AddJobLevel from "./JobLevel/AddJobLevel";
import ManageJobLevel from "./JobLevel/ManageJobLevel";
import AddWorkType from "./WorkType/AddWorkType";
import ManageWorkType from "./WorkType/ManageWorkType";
import AddSalaryType from "./SalaryType/AddSalaryType";
import ManageSalaryType from "./SalaryType/ManageSalaryType";
import AddExpType from "./ExpType/AddExpType";
import ManageExpType from "./ExpType/ManageExpType";
import AddCompany from "./Company/AddCompany";
import Recruitment from "./Company/Recruitment";
import ManageEmployer from "./Company/ManageEmployer";
import AddPost from "./Post/AddPost";
import ManagePost from "./Post/ManagePost";
import ManagePostAdmin from "./Post/ManagePostAdmin";
import PostDetail from "./Post/PostDetail";
import ManageCv from "./Cv/ManageCv";
import UserCv from "./Cv/UserCv";
import ChangePassword from "./User/ChangePassword";
import UserInfo from "./User/UserInfo";
import ManageSkill from "./Skill/ManageSkill";
import AddSkill from "./Skill/AddSkill";
import ManageCompany from "./Company/ManagerCompany";
import CompanyDetail from "./Company/CompanyDetail";
import IdentifyCompany from "./Company/IdentifyCompany";

const HomeAdmin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    if (!userInfo) {
      // Nếu chưa đăng nhập, chuyển về trang chủ
      navigate("/");
    } else if (
      !["ADMIN", "EMPLOYER_OWNER", "EMPLOYER_STAFF"].includes(userInfo.role)
    ) {
      // Nếu không có quyền truy cập, chuyển về trang đăng nhập
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="container-scroller">
      {/* Navbar */}
      <Header />

      <div className="container-fluid page-body-wrapper">
        {/* Sidebar */}
        <Menu />

        <div className="main-panel">
          <div className="content-wrapper">
            {/* Nested Routes */}
            <Outlet />
          </div>
          {/* Footer */}
          <Footer />
        </div>
      </div>
    </div>
  );
};

export const adminRoutes = [
  // { path: "", element: <Home /> },
  { path: "", element: <ABC /> },

  { path: "list-user", element: <ManageUser /> },
  { path: "add-user", element: <UpdateUser /> },
  { path: "edit-user/:id", element: <UpdateUser /> },

  { path: "add-job-type", element: <AddCategory /> },
  { path: "list-job-type", element: <ManageCategory /> },
  { path: "edit-job-type/:id", element: <AddCategory /> },

  { path: "add-job-level", element: <AddJobLevel /> },
  { path: "list-job-level", element: <ManageJobLevel /> },
  { path: "edit-job-level/:id", element: <AddJobLevel /> },

  { path: "add-work-type", element: <AddWorkType /> },
  { path: "list-work-type", element: <ManageWorkType /> },
  { path: "edit-work-type/:id", element: <AddWorkType /> },

  { path: "add-salary-type", element: <AddSalaryType /> },
  { path: "list-salary-type", element: <ManageSalaryType /> },
  { path: "edit-salary-type/:id", element: <AddSalaryType /> },

  { path: "add-exp-type", element: <AddExpType /> },
  { path: "list-exp-type", element: <ManageExpType /> },
  { path: "edit-exp-type/:id", element: <AddExpType /> },

  { path: "add-skill-type", element: <AddSkill /> },
  { path: "list-skill-type", element: <ManageSkill /> },
  { path: "edit-skill-type/:id", element: <AddSkill /> },

  { path: "list-companies", element: <ManageCompany /> },
  { path: "view-company/:id", element: <CompanyDetail /> },
  { path: "identify-company/:id", element: <IdentifyCompany /> },
  { path: "edit-company/:id", element: <AddCompany /> },
  { path: "add-company", element: <AddCompany /> },

  { path: "list-post-admin", element: <ManagePostAdmin /> },
  { path: "post-detail/:id", element: <PostDetail /> },
  { path: "list-post", element: <ManagePost /> },
  { path: "add-post", element: <AddPost /> },
  { path: "edit-post/:id", element: <AddPost /> },

  { path: "recruitment", element: <Recruitment /> },
  { path: "list-employer", element: <ManageEmployer /> },

  { path: "list-cv/:id", element: <ManageCv /> },
  { path: "user-cv/:id", element: <UserCv /> },
  { path: "changepassword", element: <ChangePassword /> },
  { path: "user-info", element: <UserInfo /> },
];

export default HomeAdmin;
