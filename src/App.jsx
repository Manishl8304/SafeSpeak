import React, { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ReportsPage from "./Pages/Reports";
import ReportingPage from "./Pages/ReportingPage";
import Charts from "./Pages/Charts";
import ProtectedRoute from "./components/ProtectedRoute";
import { jwtDecode } from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { login } from "./redux/slices/userSlice";
import Home from "./Pages/Home";
import reportAfterLogin from "./Pages/reportAfterLogin";
import HelpCenter from "./Pages/HelpCenter";

const App = () => {
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const dispatch = useDispatch();
  const token = document.cookie.split("=")[1];
  if (token) {
    const decodedToken = jwtDecode(token);
    const userDetails = {
      userID: decodedToken.id,
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
        <Route path="/admin" element={<ReportsPage />} />
        <Route
          path="/charts"
          element={<Charts />} // Pass Charts to ProtectedRoute
        />
        <Route
          path="/submittedReports"
          element={<ProtectedRoute component={reportAfterLogin} />} // Pass Charts to ProtectedRoute
        />
        <Route
          path="/helpCenter"
          element={<ProtectedRoute component={HelpCenter} />} // Pass Charts to ProtectedRoute
        />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
};

export default App;
