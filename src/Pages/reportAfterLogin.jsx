import React, { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar/Navbar";
import { useSelector } from "react-redux";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ReportAfterLogin = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userInfo = useSelector((state) => state.user.userInfo);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/location/getAllReportsById/${
            userInfo.userID
          }`
        );
        setReports(response.data.reports);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch reports.");
      } finally {
        setLoading(false);
      }
    };

    if (userInfo?.userID) {
      fetchReports();
    }
  }, [userInfo]);

  if (loading) {
    return (
      <div>
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold">Loading Reports...</h1>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-red-500">{error}</h1>
        </main>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Submitted Reports</h1>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reporting Time</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>{report.createdAt || "N/A"}</TableCell>
                  <TableCell>{report.category}</TableCell>
                  <TableCell>{report.description}</TableCell>
                  <TableCell>
                    {report.location
                      ? `${report.location.latitude}, ${report.location.longitude}`
                      : "Location unavailable"}
                  </TableCell>
                  <TableCell>{report.status || "Pending"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
};

export default ReportAfterLogin;
