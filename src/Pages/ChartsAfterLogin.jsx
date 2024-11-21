import React, { useEffect, useState } from "react";
import { Pie, Bar, Line } from "react-chartjs-2";
import axios from "axios";
import "leaflet.heat";
import "leaflet/dist/leaflet.css";
import { Link } from "react-router-dom";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  LineController,
  BarController,
} from "chart.js";

import "./Charts.css";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  LineController,
  BarController
);

const Dashboard = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [categoryData, setCategoryData] = useState(null);
  const [dailyData, setDailyData] = useState(null);
  const [statusData, setStatusData] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/location/getAllReports`
        );
        const reports = response.data.reports;
        setReports(reports);
        processAnalytics(reports);
      } catch (err) {
        setError("Failed to fetch reports data.");
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const processAnalytics = (data) => {
    processCategoryData(data);
    processDailyData(data);
    processStatusData(data);
  };

  const processCategoryData = (data) => {
    const categoryCount = data.reduce((acc, report) => {
      const category = report.category || "Uncategorized";
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});

    setCategoryData({
      labels: Object.keys(categoryCount),
      datasets: [
        {
          data: Object.values(categoryCount),
          backgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#4BC0C0",
            "#9966FF",
            "#FF9F40",
          ],
        },
      ],
    });
  };

  const processDailyData = (data) => {
    const dailyCount = {};

    data.forEach((report) => {
      const date = new Date(report.createdAt).toISOString().split("T")[0];
      dailyCount[date] = (dailyCount[date] || 0) + 1;
    });

    const sortedDates = Object.keys(dailyCount).sort();
    setDailyData({
      labels: sortedDates,
      datasets: [
        {
          label: "Reports Submitted",
          data: sortedDates.map((date) => dailyCount[date]),
          borderColor: "#36A2EB",
          backgroundColor: "rgba(54, 162, 235, 0.5)",
        },
      ],
    });
  };

  const processStatusData = (data) => {
    const statusCount = data.reduce((acc, report) => {
      const status = report.status || "Unknown";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    setStatusData({
      labels: Object.keys(statusCount),
      datasets: [
        {
          data: Object.values(statusCount),
          backgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#4BC0C0",
            "#9966FF",
            "#FF9F40",
          ],
        },
      ],
    });
  };

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      {/* <Navbar /> */}
      <nav className="bg-white shadow-md p-4 mb-5">
        <div className="container mx-auto justify-between flex items-center">
          <Link
            to="/"
            className="text-3xl font-bold text-blue-800 hover:underline"
          >
            SafeSpeak
          </Link>
          <div className="flex items-center gap-4">
            <Button
              variant="contained"
              color="secondary"
              onClick={handleInsightsRedirect}
            >
              Analytics
            </Button>
            <Avatar sx={{}}>SS</Avatar>
          </div>
        </div>
      </nav>
      <div className="dashboard-container">
        <h3 className="dashboard-title">Analytics Dashboard</h3>
        <div className="charts-container">
          {/* Category-wise Report Distribution */}
          <div className="chart-card">
            <h4>Reports by Category</h4>
            {categoryData && <Pie data={categoryData} />}
          </div>

          {/* Reports Over Time */}
          <div className="chart-card">
            <h4>Reports Over Time (Daily)</h4>
            {dailyData && <Line data={dailyData} />}
          </div>

          {/* Reports by Status */}
          <div className="chart-card">
            <h4>Reports by Status</h4>
            {statusData && <Pie data={statusData} />}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
