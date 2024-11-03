import React from "react";
import { Toaster } from "@/components/ui/toaster";
import ReportingForm from "../components/ReportingForm/ReportingForm";
import { Navbar } from "../components/Navbar/Navbar";
import { useSelector } from "react-redux";
const ReportingPage = () => {
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-200 flex flex-col">
      <Toaster />
      <Navbar />
      <ReportingForm />
    </div>
  );
};
export default ReportingPage;
