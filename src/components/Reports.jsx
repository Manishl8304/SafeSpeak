import React, { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import { useNavigate } from "react-router-dom";
const ReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [filter, setFilter] = useState("");
  const [selectedReport, setSelectedReport] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("date");
  const [resolutionNote, setResolutionNote] = useState("");

  const fixedId = "admin";
  const fixedPassword = "admin";

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (userId === fixedId && password === fixedPassword) {
      setAuthenticated(true);
      setUserId("");
      setPassword("");
      setError(""); // Reset error on successful login
    } else {
      setError("Invalid credentials. Please try again.");
    }
  };

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/location/getAllReports`
        );
        setReports(response.data.reports);
        setError(""); // Reset error on successful fetch
      } catch (err) {
        setError(err.response?.data?.Message || "Failed to fetch reports.");
      } finally {
        setLoading(false);
      }
    };

    if (authenticated) {
      fetchReports();
    }
  }, [authenticated]);

  const handleOpenDialog = (report) => {
    setSelectedReport(report);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedReport(null);
    setResolutionNote("");
  };

  const handleInsightsRedirect = () => {
    navigate("/Charts");
  };

  const handleStatusChange = (reportId, status) => {
    setReports((prevReports) =>
      prevReports.map((report) =>
        report._id === reportId ? { ...report, status } : report
      )
    );
  };

  const handleResolve = (reportId) => {
    handleStatusChange(reportId, "Resolved");
    console.log(`Report ${reportId} resolved with note: ${resolutionNote}`);
    setResolutionNote("");
  };

  const filteredReports = reports
    .filter(
      (report) =>
        (report.name || "Anonymous User")
          .toLowerCase()
          .includes(filter.toLowerCase()) ||
        (report.category || "").toLowerCase().includes(filter.toLowerCase()) ||
        report.description.toLowerCase().includes(filter.toLowerCase())
    )
    .filter((report) => !statusFilter || report.status === statusFilter);

  const sortedReports = filteredReports.sort((a, b) => {
    if (sortOrder === "date") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (sortOrder === "category") {
      return (a.category || "").localeCompare(b.category || "");
    } else {
      return 0; // Default case
    }
  });

  if (!authenticated) {
    return (
      <div className="container mx-auto mt-56 p-6">
        <h2 className="text-3xl font-bold text-blue-900 mb-6 text-center">
          Login
        </h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleLogin} className="max-w-sm mx-auto ">
          <TextField
            label="User ID"
            variant="outlined"
            fullWidth
            margin="normal"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Login
          </Button>
        </form>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-blue-500 text-3xl">Loading Reports...</div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 font-bold">{error}</div>;
  }

  if (!reports.length) {
    return <div className="text-center">No Reports Available</div>;
  }

  return (
    <>
      <nav className="bg-white shadow-md p-4">
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
              Insights
            </Button>
            <Avatar sx={{}}>CM</Avatar>
          </div>
        </div>
      </nav>
      <div className="container mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-blue-900 mb-6 text-center">
          All Reports
        </h2>

        <TextField
          label="Search Reports"
          variant="outlined"
          fullWidth
          margin="normal"
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter by name, category, or description"
        />

        <FormControl variant="outlined" className="mt-4 mb-4">
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            label="Status"
            className="w-24"
          >
            <MenuItem value="">
              <em>All</em>
            </MenuItem>
            <MenuItem value="Being Reviewed">Being Reviewed</MenuItem>
            <MenuItem value="In Progress">In Progress</MenuItem>
            <MenuItem value="Resolved">Resolved</MenuItem>
          </Select>
        </FormControl>

        <FormControl variant="outlined" className="mt-4 mb-4">
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            label="Sort By"
          >
            <MenuItem value="date">Date</MenuItem>
            <MenuItem value="category">Category</MenuItem>
          </Select>
        </FormControl>

        <TableContainer component={Paper} className="mt-5">
          <Table className="bg-blue-100">
            <TableHead>
              <TableRow>
                <TableCell style={{ fontWeight: "bold", color: "blue" }}>
                  Name
                </TableCell>
                <TableCell style={{ fontWeight: "bold", color: "blue" }}>
                  Category
                </TableCell>
                <TableCell style={{ fontWeight: "bold", color: "blue" }}>
                  Description
                </TableCell>
                <TableCell style={{ fontWeight: "bold", color: "blue" }}>
                  Submitted On
                </TableCell>
                <TableCell style={{ fontWeight: "bold", color: "blue" }}>
                  Status
                </TableCell>
                <TableCell style={{ fontWeight: "bold", color: "blue" }}>
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedReports.map((report) => (
                <TableRow key={report._id}>
                  <TableCell>{report.name || "Anonymous User"}</TableCell>
                  <TableCell>
                    {report.category ? report.category : "No Category Present"}
                  </TableCell>
                  <TableCell>{report.description}</TableCell>
                  <TableCell>
                    {format(
                      new Date(report.createdAt),
                      "MMMM dd, yyyy 'at' hh:mm a"
                    )}
                  </TableCell>
                  <TableCell>
                    {report.status ? report.status : "Not Specified"}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleOpenDialog(report)}
                      className="mr-2"
                    >
                      View Details
                    </Button>
                    <div className="flex gap-2 mt-2">
                      <Button
                        variant="contained"
                        onClick={() =>
                          handleStatusChange(report._id, "Being Reviewed")
                        }
                      >
                        Review
                      </Button>
                      <Button
                        variant="contained"
                        onClick={() =>
                          handleStatusChange(report._id, "In Progress")
                        }
                      >
                        Progress
                      </Button>
                      <Button
                        variant="contained"
                        onClick={() => handleResolve(report._id)}
                      >
                        Resolve
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Report Details</DialogTitle>
        <DialogContent>
          {selectedReport && (
            <>
              <h3 className="font-bold m-5 font-serif text-pretty text-xl">
                {selectedReport.description}
              </h3>
              {selectedReport.filesArray &&
                selectedReport.filesArray.length > 0 && (
                  <img
                    src={selectedReport.filesArray[0]}
                    alt="Report"
                    style={{ width: "100%", height: "auto" }}
                  />
                )}
              {selectedReport.location && (
                <MapContainer
                  center={[
                    selectedReport.location.latitude,
                    selectedReport.location.longitude,
                  ]}
                  zoom={13}
                  style={{ height: "300px", width: "100%" }}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker
                    position={[
                      selectedReport.location.latitude,
                      selectedReport.location.longitude,
                    ]}
                  >
                    <Popup>{selectedReport.description}</Popup>
                  </Marker>
                </MapContainer>
              )}
              <TextField
                label="Resolution Note"
                variant="outlined"
                fullWidth
                value={resolutionNote}
                onChange={(e) => setResolutionNote(e.target.value)}
                className="mt-4"
              />
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ReportsPage;
