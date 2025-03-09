import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./container/home/home";
import JobPage from "./container/JobPage/JobPage";
import Header from "./container/header/header";
import Footer from "./container/footer/Footer";
import HomeAdmin, { adminRoutes } from "./container/system/HomeAdmin";
import Login from "./container/login/Login";
import Register from "./container/login/Register";

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

        <Route
          path="/login"
          element={
            <>
              <Header />
              <Login />
              <Footer />
            </>
          }
        />

        <Route
          path="/register"
          element={
            <>
              <Header />
              <Register />
              <Footer />
            </>
          }
        />

        {/* Route cho trang Admin */}
        <Route path="/admin" element={<Navigate to="/admin/" replace />} />
        <Route path="/admin/*" element={<HomeAdmin />}>
          {adminRoutes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
          ))}
        </Route>
      </Routes>
    </div>
  );
}

export default App;
