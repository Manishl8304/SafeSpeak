import { Component } from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
const ProtectedRoute = ({ component: Element }) => {
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  if (!isLoggedIn) {
    return navigate("/");
  }

  return <Element />;
};

export default ProtectedRoute;
