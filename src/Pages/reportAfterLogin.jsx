import React, { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar/Navbar"; // Import Navbar component
import { useSelector } from "react-redux"; // Import useSelector to access Redux state
import axios from "axios"; // Axios for HTTP requests
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; // Importing table components for displaying reports
import { format } from "date-fns";

const ReportAfterLogin = () => {
  // State hooks to store reports data, loading state, and error message
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userInfo = useSelector((state) => state.user.userInfo); // Get logged-in user info from Redux state

  // useEffect hook to fetch reports when the component mounts or when userInfo changes
  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true); // Set loading to true before fetching data
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/location/getAllReportsById/${
            userInfo.userID
          }`
        );
        if (response.data.reports) setReports(response.data.reports); // Store the fetched reports in state
      } catch (err) {
        setError("Failed to fetch reports."); // Set error state if fetch fails
      } finally {
        setLoading(false); // Set loading to false after fetching completes
      }
    };

    if (userInfo?.userID) {
      fetchReports(); // Only fetch reports if userID is available
    }
  }, [userInfo]); // Dependency on userInfo to refetch if userInfo changes

  // If loading, display loading message
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

  // If error occurs, display error message
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

  // If reports are successfully fetched, display them in a table
  return (
    <div>
      <Navbar /> {/* Render Navbar component */}
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Submitted Reports</h1>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reporting Time</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Coordinates</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.length > 0 &&
                reports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>
                      {report.createdAt
                        ? format(
                            new Date(report.createdAt),
                            "MMMM dd, yyyy 'at' hh:mm a"
                          )
                        : "N/A"}
                    </TableCell>
                    <TableCell>{report.category}</TableCell>
                    <TableCell>{report.description}</TableCell>
                    <TableCell>
                      {report.location
                        ? `${report.location.latitude}, ${report.location.longitude}`
                        : "Location unavailable"}
                    </TableCell>
                    <TableCell>{report.address}</TableCell>
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

export default ReportAfterLogin; // Export the ReportAfterLogin component for use elsewhere
