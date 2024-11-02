import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ReportsPage from "./components/Reports";
import ReportingPage from "./Pages/ReportingPage";
import Charts from "./Pages/Charts";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ReportingPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/charts" element={<Charts />} /> {/* New Route for Charts */}
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
};

export default App;
