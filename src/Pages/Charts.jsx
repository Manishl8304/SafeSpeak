import React, { useEffect, useState } from "react";
import { Pie, Bar, Line } from "react-chartjs-2";
import axios from "axios";
import "leaflet.heat";
import "leaflet/dist/leaflet.css";
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
import { Navbar } from "@/components/Navbar/Navbar";
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
  const [stateData, setStateData] = useState(null); // New state for state distribution

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
    processStateData(data); // Add state processing here
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

  const processStateData = (data) => {
    const stateCount = data.reduce((acc, report) => {
      const state = report.state || "Unknown"; // Assuming state field is present in report
      acc[state] = (acc[state] || 0) + 1;
      return acc;
    }, {});

    setStateData({
      labels: Object.keys(stateCount),
      datasets: [
        {
          label: "Reports by State",
          data: Object.values(stateCount),
          backgroundColor: "#36A2EB",
        },
      ],
    });
  };

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <Navbar />
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

          {/* Reports by State (New addition) */}
          <div className="chart-card">
            <h4>Reports by State</h4>
            {stateData && <Bar data={stateData} />}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
