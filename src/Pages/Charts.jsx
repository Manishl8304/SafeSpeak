// src/Pages/Charts.jsx
import React, { useEffect, useState } from "react";
import { Pie, Bar } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

const Charts = () => {
  const [reports, setReports] = useState([]);
  const [categoryData, setCategoryData] = useState(null);
  const [monthlyCategoryData, setMonthlyCategoryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/location/getAllReports`
        );
        setReports(response.data.reports);
        processCategoryData(response.data.reports);
        processMonthlyCategoryData(response.data.reports);
      } catch (err) {
        setError("Failed to fetch reports data.");
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

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

  const processMonthlyCategoryData = (data) => {
    const monthlyData = {};

    data.forEach((report) => {
      const category = report.category || "Uncategorized";
      const date = new Date(report.createdAt);
      const month = `${date.getFullYear()}-${date.getMonth() + 1}`;

      if (!monthlyData[month]) {
        monthlyData[month] = {};
      }
      monthlyData[month][category] = (monthlyData[month][category] || 0) + 1;
    });

    const sortedMonths = Object.keys(monthlyData).sort();
    const categories = Array.from(
      new Set(data.map((report) => report.category || "Uncategorized"))
    );

    const datasets = categories.map((category) => ({
      label: category,
      backgroundColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      data: sortedMonths.map((month) => monthlyData[month][category] || 0),
    }));

    setMonthlyCategoryData({
      labels: sortedMonths,
      datasets: datasets,
    });
  };

  if (loading) return <p>Loading charts...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <div style={{ width: "400px", margin: "0 auto" }}>
        <h3>Category Weightage</h3>
        {categoryData && categoryData.labels.length > 0 ? (
          <Pie data={categoryData} />
        ) : (
          <p>No data available for Category Weightage</p>
        )}
      </div>

      <div style={{ width: "600px", margin: "0 auto" }}>
        <h3>Category Count Per Month</h3>
        {monthlyCategoryData && monthlyCategoryData.labels.length > 0 ? (
          <Bar
            data={monthlyCategoryData}
            options={{
              responsive: true,
              plugins: { legend: { position: "top" } },
            }}
          />
        ) : (
          <p>No data available for Category Count Per Month</p>
        )}
      </div>
    </div>
  );
};

export default Charts;
