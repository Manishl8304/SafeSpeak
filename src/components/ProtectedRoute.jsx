import { Component } from "lucide-react";
import React, { useEffect } from "react"; // Import useEffect
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ component: Element }) => {
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn]);

  // Render the component only if the user is logged in
  return isLoggedIn ? <Element /> : null;
};

export default ProtectedRoute;
