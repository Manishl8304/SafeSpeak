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
import { format } from "date-fns";
import Modal from "@/components/ui/Modal";

const ReportAfterLogin = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [currentImages, setCurrentImages] = useState([]); // Images to display

  const userInfo = useSelector((state) => state.user.userInfo); // Logged-in user info

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/location/getAllReportsById/${
            userInfo.userID
          }`
        );
        if (response.data.reports) setReports(response.data.reports);
      } catch (err) {
        setError("Failed to fetch reports.");
      } finally {
        setLoading(false);
      }
    };

    if (userInfo?.userID) {
      fetchReports();
    }
  }, [userInfo]);

  const handleViewImages = (images) => {
    setCurrentImages(images); // Set images for modal
    setIsModalOpen(true); // Open modal
  };

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
                <TableHead>Coordinates</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead> {/* Added Actions column */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.length > 0 &&
                reports.map((report) => (
                  <TableRow key={report._id}>
                    <TableCell>
                      {report.createdAt
                        ? format(
                            new Date(report.createdAt),
                            "MMMM dd, yyyy 'at' hh:mm a"
                          )
                        : "N/A"}
                    </TableCell>
                    <TableCell>{report.category || "N/A"}</TableCell>
                    <TableCell>{report.description || "N/A"}</TableCell>
                    <TableCell>
                      {report.location
                        ? `${report.location.latitude}, ${report.location.longitude}`
                        : "Location unavailable"}
                    </TableCell>
                    <TableCell>{report.address || "N/A"}</TableCell>
                    <TableCell>{report.status || "Not Specified"}</TableCell>
                    <TableCell>
                      <button
                        className="text-blue-500 hover:underline"
                        onClick={() => handleViewImages(report.filesArray || [])}
                      >
                        View Files
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </main>

      {/* Modal to display images */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-xl font-bold mb-4">Report Files</h2>
        <div className="flex flex-wrap gap-4">
          {currentImages.length > 0 ? (
            currentImages.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Report Image ${index + 1}`}
                className="w-32 h-32 object-cover rounded shadow-md"
              />
            ))
          ) : (
            <p>No files available for this report.</p>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default ReportAfterLogin;
