import React from "react";
import { Routes, Route } from "react-router-dom";
import candidateRoutes from "../../routes/candidateRoutes";

const HomeCandidate = () => {
  return (
    <div className="container-scroller">
      <div className="container-fluid page-body-wrapper">
        <div className="main-panel">
          <div className="content-wrapper" style={{ marginLeft: "9%" }}>
            <Routes>
              {candidateRoutes.map((route, index) => (
                <Route key={index} path={route.path} element={route.element} />
              ))}
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeCandidate;
