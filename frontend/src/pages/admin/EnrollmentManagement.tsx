import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
} from "@mui/material";
import {
  CheckCircle,
  Cancel,
  Pending,
  Search,
  FilterList,
} from "@mui/icons-material";
import { adminAPI, EnrollmentDetail } from "../../services/adminApi";

const EnrollmentManagement: React.FC = () => {
  const [enrollments, setEnrollments] = useState<EnrollmentDetail[]>([]);
  const [filteredEnrollments, setFilteredEnrollments] = useState<
    EnrollmentDetail[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    enrollmentId: number | null;
    action: "approve" | "reject" | null;
    userName: string;
    courseTitle: string;
  }>({
    open: false,
    enrollmentId: null,
    action: null,
    userName: "",
    courseTitle: "",
  });
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    fetchEnrollments();
  }, []);

  useEffect(() => {
    filterEnrollments();
  }, [enrollments, searchTerm, statusFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      const enrollmentsData = await adminAPI.getEnrollments();
      setEnrollments(enrollmentsData);
      setLoading(false);
    } catch (err: any) {
      console.error("Error fetching enrollments:", err);
      setError(err.response?.data?.message || "Failed to load enrollments");
      setLoading(false);
    }
  };

  const filterEnrollments = () => {
    let filtered = enrollments;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (enrollment) =>
          enrollment.userName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          enrollment.userFullName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          enrollment.courseTitle
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== "ALL") {
      filtered = filtered.filter(
        (enrollment) => enrollment.status === statusFilter
      );
    }

    setFilteredEnrollments(filtered);
  };

  const getStatusChip = (status: string) => {
    switch (status) {
      case "APPROVED":
        return (
          <Chip
            icon={<CheckCircle />}
            label="Approved"
            color="success"
            size="small"
          />
        );
      case "REJECTED":
        return (
          <Chip icon={<Cancel />} label="Rejected" color="error" size="small" />
        );
      case "PENDING":
        return (
          <Chip
            icon={<Pending />}
            label="Pending"
            color="warning"
            size="small"
          />
        );
      default:
        return <Chip label={status} color="default" size="small" />;
    }
  };

  const handleStatusChange = (
    enrollmentId: number,
    action: "approve" | "reject",
    userName: string,
    courseTitle: string
  ) => {
    setConfirmDialog({
      open: true,
      enrollmentId,
      action,
      userName,
      courseTitle,
    });
  };

  const confirmStatusChange = async () => {
    if (!confirmDialog.enrollmentId || !confirmDialog.action) return;

    try {
      if (confirmDialog.action === "approve") {
        await adminAPI.approveEnrollment(confirmDialog.enrollmentId);
        setSnackbar({
          open: true,
          message: "Enrollment approved successfully!",
          severity: "success",
        });
      } else {
        await adminAPI.rejectEnrollment(confirmDialog.enrollmentId);
        setSnackbar({
          open: true,
          message: "Enrollment rejected successfully!",
          severity: "success",
        });
      }

      setConfirmDialog({
        open: false,
        enrollmentId: null,
        action: null,
        userName: "",
        courseTitle: "",
      });

      fetchEnrollments(); // Refresh the list
    } catch (err: any) {
      console.error("Error updating enrollment status:", err);
      setSnackbar({
        open: true,
        message:
          err.response?.data?.message || "Failed to update enrollment status",
        severity: "error",
      });
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusCounts = () => {
    const counts = {
      ALL: enrollments.length,
      PENDING: enrollments.filter((e) => e.status === "PENDING").length,
      APPROVED: enrollments.filter((e) => e.status === "APPROVED").length,
      REJECTED: enrollments.filter((e) => e.status === "REJECTED").length,
    };
    return counts;
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  const statusCounts = getStatusCounts();

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
        Enrollment Management
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="h4" color="primary" fontWeight="bold">
              {statusCounts.ALL}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Enrollments
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="h4" color="warning.main" fontWeight="bold">
              {statusCounts.PENDING}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Pending
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="h4" color="success.main" fontWeight="bold">
              {statusCounts.APPROVED}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Approved
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="h4" color="error.main" fontWeight="bold">
              {statusCounts.REJECTED}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Rejected
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Card sx={{ p: 2, mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <TextField
            placeholder="Search by user or course..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            sx={{ minWidth: 250 }}
            InputProps={{
              startAdornment: (
                <Search sx={{ mr: 1, color: "text.secondary" }} />
              ),
            }}
          />

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Status Filter</InputLabel>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              label="Status Filter"
              startAdornment={
                <FilterList sx={{ mr: 1, color: "text.secondary" }} />
              }
            >
              <MenuItem value="ALL">All Status</MenuItem>
              <MenuItem value="PENDING">Pending</MenuItem>
              <MenuItem value="APPROVED">Approved</MenuItem>
              <MenuItem value="REJECTED">Rejected</MenuItem>
            </Select>
          </FormControl>

          <Typography variant="body2" color="text.secondary">
            Showing {filteredEnrollments.length} of {enrollments.length}{" "}
            enrollments
          </Typography>
        </Box>
      </Card>

      {/* Enrollments Table */}
      <Card>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                <TableCell>
                  <strong>ID</strong>
                </TableCell>
                <TableCell>
                  <strong>User</strong>
                </TableCell>
                <TableCell>
                  <strong>Course</strong>
                </TableCell>
                <TableCell>
                  <strong>Price</strong>
                </TableCell>
                <TableCell>
                  <strong>Status</strong>
                </TableCell>
                <TableCell>
                  <strong>Enrollment Date</strong>
                </TableCell>
                <TableCell>
                  <strong>Actions</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEnrollments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      {enrollments.length === 0
                        ? "No enrollments found"
                        : "No enrollments match your search criteria"}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredEnrollments.map((enrollment) => (
                  <TableRow key={enrollment.enrollmentId} hover>
                    <TableCell>{enrollment.enrollmentId}</TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {enrollment.userFullName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          @{enrollment.userName}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ maxWidth: 200 }}>
                        {enrollment.courseTitle}
                      </Typography>
                    </TableCell>
                    <TableCell>{formatPrice(enrollment.coursePrice)}</TableCell>
                    <TableCell>{getStatusChip(enrollment.status)}</TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(enrollment.enrollmentDate)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {enrollment.status === "PENDING" && (
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <Button
                            size="small"
                            variant="contained"
                            color="success"
                            onClick={() =>
                              handleStatusChange(
                                enrollment.enrollmentId,
                                "approve",
                                enrollment.userFullName,
                                enrollment.courseTitle
                              )
                            }
                          >
                            Approve
                          </Button>
                          <Button
                            size="small"
                            variant="contained"
                            color="error"
                            onClick={() =>
                              handleStatusChange(
                                enrollment.enrollmentId,
                                "reject",
                                enrollment.userFullName,
                                enrollment.courseTitle
                              )
                            }
                          >
                            Reject
                          </Button>
                        </Box>
                      )}
                      {enrollment.status !== "PENDING" && (
                        <Typography variant="caption" color="text.secondary">
                          No actions available
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ ...confirmDialog, open: false })}
      >
        <DialogTitle>
          Confirm{" "}
          {confirmDialog.action === "approve" ? "Approval" : "Rejection"}
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to {confirmDialog.action} the enrollment for:
          </Typography>
          <Box sx={{ mt: 2, p: 2, bgcolor: "#f5f5f5", borderRadius: 1 }}>
            <Typography variant="subtitle2">
              <strong>User:</strong> {confirmDialog.userName}
            </Typography>
            <Typography variant="subtitle2">
              <strong>Course:</strong> {confirmDialog.courseTitle}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setConfirmDialog({ ...confirmDialog, open: false })}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmStatusChange}
            variant="contained"
            color={confirmDialog.action === "approve" ? "success" : "error"}
          >
            {confirmDialog.action === "approve" ? "Approve" : "Reject"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EnrollmentManagement;
