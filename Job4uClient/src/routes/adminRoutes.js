import ManageUser from "../container/system/User/ManageUser";
import UpdateUser from "../container/system/User/UpdateUser";
import AddCategory from "../container/system/Category/AddCategory";
import ManageCategory from "../container/system/Category/ManageCategory";
import AddJobLevel from "../container/system/JobLevel/AddJobLevel";
import ManageJobLevel from "../container/system/JobLevel/ManageJobLevel";
import AddWorkType from "../container/system/WorkType/AddWorkType";
import ManageWorkType from "../container/system/WorkType/ManageWorkType";
import AddSalaryType from "../container/system/SalaryType/AddSalaryType";
import ManageSalaryType from "../container/system/SalaryType/ManageSalaryType";
import AddExpType from "../container/system/ExpType/AddExpType";
import ManageExpType from "../container/system/ExpType/ManageExpType";
import AddCompany from "../container/system/Company/AddCompany";
import Recruitment from "../container/system/Company/Recruitment";
import ManageEmployer from "../container/system/Company/ManageEmployer";
import AddPost from "../container/system/Post/AddPost";
import ManagePost from "../container/system/Post/ManagePost";
import ManagePostAdmin from "../container/system/Post/ManagePostAdmin";
import PostDetail from "../container/system/Post/PostDetail";
import UpdatePostStatus from "../container/system/Post/UpdatePostStatus";
import ManageCv from "../container/system/Cv/ManageCv";
import UserCv from "../container/system/Cv/UserCv";
import ChangePassword from "../container/system/User/ChangePassword";
import UserInfo from "../container/system/User/UserInfo";
import ManageSkill from "../container/system/Skill/ManageSkill";
import AddSkill from "../container/system/Skill/AddSkill";
import ManageCompany from "../container/system/Company/ManagerCompany";
import CompanyDetail from "../container/system/Company/CompanyDetail";
import IdentifyCompany from "../container/system/Company/IdentifyCompany";
import EmployerDashBoard from "../container/system/DashBoard/EmployerDashBoard";
import AdminDashBoard from "../container/system/DashBoard/AdminDashBoard";
import AnalyticsDashboard from "../container/system/DashBoard/AnalyticsDashboard";
import { Navigate } from "react-router-dom";

const getRoleFromLocalStorage = () => {
  const user = JSON.parse(localStorage.getItem("userInfo"));
  return user?.role;
};

const adminRoutes = () => {
  const role = getRoleFromLocalStorage();

  if (role === "ADMIN") {
    return [
      { path: "", element: <AdminDashBoard /> },
      { path: "post-analysis", element: <AnalyticsDashboard /> },

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
      { path: "update-post-status/:id", element: <UpdatePostStatus /> },
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
  } else if (role === "EMPLOYER_OWNER" || role === "EMPLOYER_STAFF") {
    return [
      { path: "", element: <EmployerDashBoard /> },
      { path: "recruitment", element: <Recruitment /> },
      { path: "list-post", element: <ManagePost /> },
      { path: "add-post", element: <AddPost /> },
      { path: "edit-post/:id", element: <AddPost /> },

      { path: "edit-company/:id", element: <AddCompany /> },
      { path: "add-company", element: <AddCompany /> },

      { path: "list-cv/:id", element: <ManageCv /> },
      { path: "user-cv/:id", element: <UserCv /> },

      { path: "changepassword", element: <ChangePassword /> },
      { path: "user-info", element: <UserInfo /> },
    ];
  } else {
    return [{ path: "*", element: <Navigate to="/login" replace /> }];
  }
};

export default adminRoutes;
