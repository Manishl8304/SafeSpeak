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

  const locationMapping = {
    "28.7041_77.1025": "Delhi",
    "28.6090_77.2352": "Janakpuri, Delhi",
    "28.6966_77.2226": "Pitampura, Delhi",
    "28.4595_77.0266": "Gurgaon, Haryana", // Add more known locations here
  };
  const [address, setAddress] = useState("");
  useEffect(() => {
    if (selectedReport && selectedReport.location) {
      const { latitude, longitude } = selectedReport.location;
      axios
        .get(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
        )
        .then((response) => {
          if (response.data && response.data.display_name) {
            setAddress(response.data.display_name);
          } else {
            setAddress("Address not found");
          }
        })
        .catch(() => {
          setAddress("Address not found");
        });
    }
  }, [selectedReport]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/location/getAllReports`
        );
        setReports(response.data.reports);
        console.log(response.data.reports)
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

  const handleStatusChange = async (reportId, status) => {
    setReports((prevReports) =>
      prevReports.map((report) =>
        report._id === reportId ? { ...report, status } : report
      )
    );
    try {
      const response = await axios.post(
        `${
          import.meta.env.VITE_SERVER_URL
        }/api/location/setReportStatus/${reportId}`,
        { status }
      );
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  };

  const filteredReports = reports
    .filter(
      (report) =>
        (report.reportedBy || "Anonymous User")
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
                <TableCell
                  style={{
                    fontWeight: "bold",
                    color: "blue",
                    textAlign: "center",
                  }}
                >
                  Name
                </TableCell>
                <TableCell
                  style={{
                    fontWeight: "bold",
                    color: "blue",
                    textAlign: "center",
                  }}
                >
                  Category
                </TableCell>
                <TableCell
                  style={{
                    fontWeight: "bold",
                    color: "blue",
                    textAlign: "center",
                  }}
                >
                  Description
                </TableCell>
                <TableCell
                  style={{
                    fontWeight: "bold",
                    color: "blue",
                    textAlign: "center",
                  }}
                >
                  Submitted On
                </TableCell>
                <TableCell
                  style={{
                    fontWeight: "bold",
                    color: "blue",
                    textAlign: "center",
                  }}
                >
                  Status
                </TableCell>
                <TableCell
                  style={{
                    fontWeight: "bold",
                    color: "blue",
                    textAlign: "center",
                  }}
                >
                  Action
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {sortedReports.map((report) => (
                <TableRow key={report._id}>
                  <TableCell>{report.userName || "Anonymous User"}</TableCell>
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
                        Mark as Being Reviewed
                      </Button>
                      <Button
                        variant="contained"
                        onClick={() =>
                          handleStatusChange(report._id, "In Progress")
                        }
                      >
                        Mark as In Progress
                      </Button>
                      <Button
                        variant="contained"
                        onClick={() =>
                          handleStatusChange(report._id, "Resolved")
                        }
                      >
                        Mark as Resolved
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        {" "}
        <DialogTitle>
          {" "}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {" "}
            <span className="font-bold text-2xl">Report Details</span>{" "}
            <button
              onClick={handleCloseDialog}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                position: "absolute",
                right: "16px",
              }}
            >
              {" "}
              ✖{" "}
            </button>{" "}
          </div>{" "}
        </DialogTitle>{" "}
        <DialogContent dividers>
          {" "}
          {selectedReport && (
            <>
              {" "}
              <div
                style={{ marginBottom: "20px", borderBottom: "1px solid #ccc" }}
              >
                {" "}
                <h3 className="font-bold m-5 font-serif text-pretty text-xl">
                  Category:{" "}
                  <span style={{ fontWeight: "bold" }}>
                    {selectedReport.category}
                  </span>
                </h3>{" "}
              </div>{" "}
              <div
                style={{ marginBottom: "20px", borderBottom: "1px solid #ccc" }}
              >
                {" "}
                <p className="font-normal m-5 text-lg">
                  Description:{" "}
                  <span style={{ fontWeight: "bold" }}>
                    {selectedReport.description}
                  </span>
                </p>{" "}
              </div>{" "}
              {selectedReport.location && (
                <div
                  style={{
                    marginBottom: "20px",
                    borderBottom: "1px solid #ccc",
                  }}
                >
                  {" "}
                  <p className="font-normal m-5 text-lg">
                    Location:{" "}
                    <span style={{ fontWeight: "bold" }}>{address}</span>
                  </p>{" "}
                </div>
              )}{" "}
              {selectedReport.filesArray &&
                selectedReport.filesArray.length > 0 && (
                  <div
                    style={{
                      marginBottom: "20px",
                      textAlign: "center",
                      borderBottom: "1px solid #ccc",
                    }}
                  >
                    {" "}
                    <img
                      src={selectedReport.filesArray[0]}
                      alt="Report"
                      style={{
                        width: "100%",
                        height: "auto",
                        borderRadius: "8px",
                        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                      }}
                    />{" "}
                  </div>
                )}{" "}
              {selectedReport.location && (
                <div
                  style={{
                    height: "300px",
                    width: "100%",
                    borderBottom: "1px solid #ccc",
                  }}
                >
                  {" "}
                  <MapContainer
                    center={[
                      selectedReport.location.latitude,
                      selectedReport.location.longitude,
                    ]}
                    zoom={13}
                    style={{ height: "100%", width: "100%" }}
                  >
                    {" "}
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />{" "}
                    <Marker
                      position={[
                        selectedReport.location.latitude,
                        selectedReport.location.longitude,
                      ]}
                    >
                      {" "}
                      <Popup>{selectedReport.description}</Popup>{" "}
                    </Marker>{" "}
                  </MapContainer>{" "}
                </div>
              )}{" "}
            </>
          )}{" "}
        </DialogContent>{" "}
      </Dialog>
    </>
  );
};

export default ReportsPage;
