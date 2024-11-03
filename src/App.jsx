import React, { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ReportsPage from "./components/Reports";
import ReportingPage from "./Pages/ReportingPage";
import Charts from "./Pages/Charts";
import ProtectedRoute from "./components/ProtectedRoute";
import { jwtDecode } from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { login } from "./redux/slices/userSlice";
import Home from "./Pages/Home";

const App = () => {
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const dispatch = useDispatch();
  const token = document.cookie.split("=")[1];
  if (token) {
    const decodedToken = jwtDecode(token);
    const userDetails = {
      userName: decodedToken.userName,
      userEmail: decodedToken.userEmail,
      token,
    };
    dispatch(login(userDetails));
  }
  return (
    <BrowserRouter>
      <Routes>
        {isLoggedIn ? (
          <Route path="/" element={<Home />} />
        ) : (
          <Route path="/" element={<ReportingPage />} />
        )}
        <Route path="/reports" element={<ReportsPage />} />
        <Route
          path="/charts"
          element={<ProtectedRoute component={Charts} />} // Pass Charts to ProtectedRoute
        />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
};

export default App;
