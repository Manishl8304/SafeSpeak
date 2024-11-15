import React from "react";
import ReportingForm from "@/components/ReportingForm/ReportingForm";
import { Navbar } from "@/components/Navbar/Navbar";
import { useSelector } from "react-redux";
import axios from "axios";
const Home = () => {
  const getReports = async () => {
    const user = useSelector((state) => state.user.userInfo);
    const response = await axios.get(
      `${import.meta.env.VITE_SERVER_URL}/api/location/getAllReportsByEmail/${
        user.userEmail
      }`
    );
    console.log(response);
  };
  getReports();
  return (
    <div>
      <Navbar />
    </div>
  );
};
export default Home;
