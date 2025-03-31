import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./container/home/home";
import Company from "./container/Company/ListCompany";
import About from "./container/About/About";
import JobPage from "./container/JobPage/JobPage";
import Header from "./container/header/header";
import Footer from "./container/footer/Footer";
import JobDetail from "./container/JobDetail/JobDetail";
import HomeCandidate from "./container/Candidate/HomeCandidate";

import HomeAdmin from "./container/system/HomeAdmin";

function App() {
  return (
    <div className="App">
      <Routes>
        {/* Route cho trang chủ */}
        <Route
          path="/"
          element={
            <>
              <Header />
              <Home />
              <Footer />
            </>
          }
        />

        {/* Route cho trang công ty */}
        <Route
          path="/company"
          element={
            <>
              <Header />
              <Company />
              <Footer />
            </>
          }
        />

        {/* Route cho trang giới thiệu */}
        <Route
          path="/about"
          element={
            <>
              <Header />
              <About />
              <Footer />
            </>
          }
        />

        {/* Route cho trang Job */}
        <Route
          path="/job"
          element={
            <>
              <Header />
              <JobPage />
              <Footer />
            </>
          }
        />

        {/* Route cho trang Job */}
        <Route
          path="/detail-job/:id"
          element={
            <>
              <Header />
              <JobDetail />
              <Footer />
            </>
          }
        />

        {/* Route cho trang Admin */}
        <Route
          path="/admin/*"
          element={
            ["ADMIN", "EMPLOYER_OWNER", "EMPLOYER_STAFF"].includes(
              JSON.parse(localStorage.getItem("userInfo"))?.role
            ) ? (
              <HomeAdmin />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/candidate/*"
          element={
            JSON.parse(localStorage.getItem("userInfo"))?.role ===
            "JOB_SEEKER" ? (
              <>
                <Header />
                <HomeCandidate />
                <Footer />
              </>
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </div>
  );
}

export default App;
