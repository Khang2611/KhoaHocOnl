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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Snackbar,
  Grid,
  Avatar,
} from "@mui/material";
import {
  Search,
  Visibility,
  Delete,
  Person,
  AdminPanelSettings,
} from "@mui/icons-material";
import { adminAPI, UserDetail } from "../../services/adminApi";

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<UserDetail[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserDetail | null>(null);
  const [profileDialog, setProfileDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    userId: number | null;
    userName: string;
  }>({
    open: false,
    userId: null,
    userName: "",
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
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const usersData = await adminAPI.getUsers();
      setUsers(usersData);
      setLoading(false);
    } catch (err: any) {
      console.error("Error fetching users:", err);
      setError(err.response?.data?.message || "Failed to load users");
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.phoneNumber?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredUsers(filtered);
  };

  const getRoleChip = (role: string) => {
    if (role === "ADMIN") {
      return (
        <Chip
          icon={<AdminPanelSettings />}
          label="Admin"
          color="error"
          size="small"
          variant="filled"
        />
      );
    }
    return (
      <Chip
        icon={<Person />}
        label="User"
        color="primary"
        size="small"
        variant="outlined"
      />
    );
  };

  const handleViewProfile = (user: UserDetail) => {
    setSelectedUser(user);
    setProfileDialog(true);
  };

  const handleDeleteUser = (userId: number, userName: string) => {
    setDeleteDialog({
      open: true,
      userId,
      userName,
    });
  };

  const confirmDeleteUser = async () => {
    if (!deleteDialog.userId) return;

    try {
      await adminAPI.deleteUser(deleteDialog.userId);
      setSnackbar({
        open: true,
        message: "User deleted successfully!",
        severity: "success",
      });
      setDeleteDialog({
        open: false,
        userId: null,
        userName: "",
      });
      fetchUsers(); // Refresh the list
    } catch (err: any) {
      console.error("Error deleting user:", err);
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Failed to delete user",
        severity: "error",
      });
    }
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

  const getUserStats = () => {
    const stats = {
      total: users.length,
      admins: users.filter((u) => u.role === "ADMIN").length,
      regularUsers: users.filter((u) => u.role === "USER").length,
    };
    return stats;
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

  const userStats = getUserStats();

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
        User Management
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Card sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="h4" color="primary" fontWeight="bold">
              {userStats.total}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Users
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="h4" color="error.main" fontWeight="bold">
              {userStats.admins}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Administrators
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="h4" color="success.main" fontWeight="bold">
              {userStats.regularUsers}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Regular Users
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Search */}
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
            placeholder="Search by username, name, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            sx={{ minWidth: 300 }}
            InputProps={{
              startAdornment: (
                <Search sx={{ mr: 1, color: "text.secondary" }} />
              ),
            }}
          />

          <Typography variant="body2" color="text.secondary">
            Showing {filteredUsers.length} of {users.length} users
          </Typography>
        </Box>
      </Card>

      {/* Users Table */}
      <Card>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                <TableCell>
                  <strong>Avatar</strong>
                </TableCell>
                <TableCell>
                  <strong>Username</strong>
                </TableCell>
                <TableCell>
                  <strong>Full Name</strong>
                </TableCell>
                <TableCell>
                  <strong>Phone</strong>
                </TableCell>
                <TableCell>
                  <strong>Role</strong>
                </TableCell>
                <TableCell>
                  <strong>Registration Date</strong>
                </TableCell>
                <TableCell>
                  <strong>Actions</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      {users.length === 0
                        ? "No users found"
                        : "No users match your search criteria"}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.userId} hover>
                    <TableCell>
                      <Avatar
                        sx={{
                          bgcolor:
                            user.role === "ADMIN"
                              ? "error.main"
                              : "primary.main",
                        }}
                      >
                        {user.fullName?.charAt(0)?.toUpperCase() ||
                          user.userName.charAt(0).toUpperCase()}
                      </Avatar>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {user.userName}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {user.fullName || "N/A"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {user.phoneNumber || "N/A"}
                      </Typography>
                    </TableCell>
                    <TableCell>{getRoleChip(user.role)}</TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(user.registrationDate)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <IconButton
                          size="small"
                          onClick={() => handleViewProfile(user)}
                          title="View Profile"
                        >
                          <Visibility />
                        </IconButton>
                        {user.role !== "ADMIN" && (
                          <IconButton
                            size="small"
                            onClick={() =>
                              handleDeleteUser(user.userId, user.userName)
                            }
                            title="Delete User"
                            color="error"
                          >
                            <Delete />
                          </IconButton>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* User Profile Dialog */}
      <Dialog
        open={profileDialog}
        onClose={() => setProfileDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar
              sx={{
                bgcolor:
                  selectedUser?.role === "ADMIN"
                    ? "error.main"
                    : "primary.main",
              }}
            >
              {selectedUser?.fullName?.charAt(0)?.toUpperCase() ||
                selectedUser?.userName.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="h6">User Profile</Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedUser?.userName}
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  User ID
                </Typography>
                <Typography variant="body1">{selectedUser.userId}</Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Username
                </Typography>
                <Typography variant="body1">{selectedUser.userName}</Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Full Name
                </Typography>
                <Typography variant="body1">
                  {selectedUser.fullName || "Not provided"}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Phone Number
                </Typography>
                <Typography variant="body1">
                  {selectedUser.phoneNumber || "Not provided"}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Role
                </Typography>
                {getRoleChip(selectedUser.role)}
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Registration Date
                </Typography>
                <Typography variant="body1">
                  {formatDate(selectedUser.registrationDate)}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setProfileDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ ...deleteDialog, open: false })}
      >
        <DialogTitle>Confirm User Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the user "{deleteDialog.userName}"?
          </Typography>
          <Alert severity="warning" sx={{ mt: 2 }}>
            This action cannot be undone. All user data and enrollments will be
            permanently deleted.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialog({ ...deleteDialog, open: false })}
          >
            Cancel
          </Button>
          <Button onClick={confirmDeleteUser} variant="contained" color="error">
            Delete User
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

export default UserManagement;
