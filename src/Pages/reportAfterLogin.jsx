import React from "react";
import { Navbar } from "@/components/Navbar/Navbar";
import ReportingForm from "@/components/ReportingForm/ReportingForm";
const reportAfterLogin = () => {
  return (
    <div>
      <Navbar />
      <ReportingForm />
    </div>
  );
};
export default reportAfterLogin;
