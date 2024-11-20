import React from "react";
import ReportingForm from "@/components/ReportingForm/ReportingForm";
import { Navbar } from "@/components/Navbar/Navbar";
import { useSelector } from "react-redux";
import axios from "axios";
const Home = () => {

  return (
    <div>
      <Navbar />
      <ReportingForm />
    </div>
  );
};
export default Home;
