import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import { Add, Edit, Delete, Visibility } from "@mui/icons-material";
import { adminAPI } from "../../services/adminApi";

interface Course {
  courseId: number;
  courseTitle: string;
  description: string;
  urlVideo: string;
  price: number;
  createBy: {
    fullName: string;
    userName: string;
  } | null;
}

interface CourseFormData {
  courseTitle: string;
  description: string;
  urlVideo: string;
  price: number;
}

const CourseManagement: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState<CourseFormData>({
    courseTitle: "",
    description: "",
    urlVideo: "",
    price: 0,
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
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const coursesData = await adminAPI.getCourses();
      setCourses(coursesData);
      setLoading(false);
    } catch (err: any) {
      console.error("Error fetching courses:", err);
      setError(err.response?.data?.message || "Failed to load courses");
      setLoading(false);
    }
  };

  const handleOpenDialog = (course?: Course) => {
    if (course) {
      setEditingCourse(course);
      setFormData({
        courseTitle: course.courseTitle || "",
        description: course.description || "",
        urlVideo: course.urlVideo || "",
        price: course.price || 0,
      });
    } else {
      setEditingCourse(null);
      setFormData({
        courseTitle: "",
        description: "",
        urlVideo: "",
        price: 0,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingCourse(null);
    setFormData({
      courseTitle: "",
      description: "",
      urlVideo: "",
      price: 0,
    });
  };

  const handleInputChange =
    (field: keyof CourseFormData) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value =
        field === "price"
          ? parseFloat(event.target.value) || 0
          : event.target.value;
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    };

  const validateForm = (): string | null => {
    if (!formData.courseTitle || !formData.courseTitle.trim()) {
      return "Course title is required";
    }
    if (!formData.description || !formData.description.trim()) {
      return "Description is required";
    }
    if (formData.price < 0) {
      return "Price must be a positive number";
    }
    if (formData.urlVideo && !isValidUrl(formData.urlVideo)) {
      return "Please enter a valid video URL";
    }
    return null;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async () => {
    const validationError = validateForm();
    if (validationError) {
      setSnackbar({
        open: true,
        message: validationError,
        severity: "error",
      });
      return;
    }

    try {
      if (editingCourse) {
        // Update existing course
        await adminAPI.updateCourse(editingCourse.courseId, formData);
        setSnackbar({
          open: true,
          message: "Course updated successfully!",
          severity: "success",
        });
      } else {
        // Create new course
        await adminAPI.createCourse(formData);
        setSnackbar({
          open: true,
          message: "Course created successfully!",
          severity: "success",
        });
      }
      handleCloseDialog();
      fetchCourses(); // Refresh the list
    } catch (err: any) {
      console.error("Error saving course:", err);
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Failed to save course",
        severity: "error",
      });
    }
  };

  const handleDelete = async (courseId: number, courseTitle: string) => {
    if (window.confirm(`Are you sure you want to delete "${courseTitle}"?`)) {
      try {
        await adminAPI.deleteCourse(courseId);
        setSnackbar({
          open: true,
          message: "Course deleted successfully!",
          severity: "success",
        });
        fetchCourses(); // Refresh the list
      } catch (err: any) {
        console.error("Error deleting course:", err);
        setSnackbar({
          open: true,
          message: err.response?.data?.message || "Failed to delete course",
          severity: "error",
        });
      }
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
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

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1" fontWeight="bold">
          Course Management
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button variant="outlined" onClick={fetchCourses} disabled={loading}>
            {loading ? "Refreshing..." : "Refresh"}
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
            sx={{ bgcolor: "#ff6b35", "&:hover": { bgcolor: "#e55a2b" } }}
          >
            Create New Course
          </Button>
        </Box>
      </Box>

      <Card>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                <TableCell>
                  <strong>ID</strong>
                </TableCell>
                <TableCell>
                  <strong>Course Title</strong>
                </TableCell>
                <TableCell>
                  <strong>Description</strong>
                </TableCell>
                <TableCell>
                  <strong>Price</strong>
                </TableCell>
                <TableCell>
                  <strong>Created By</strong>
                </TableCell>
                <TableCell>
                  <strong>Video</strong>
                </TableCell>
                <TableCell>
                  <strong>Actions</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {courses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      No courses found. Create your first course to get started.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                courses.map((course) => (
                  <TableRow key={course.courseId} hover>
                    <TableCell>{course.courseId}</TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {course.courseTitle}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ maxWidth: 200 }}>
                        {course.description.length > 100
                          ? `${course.description.substring(0, 100)}...`
                          : course.description}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={formatPrice(course.price)}
                        color="primary"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      {course.createBy?.fullName ||
                        course.createBy?.userName ||
                        "N/A"}
                    </TableCell>
                    <TableCell>
                      {course.urlVideo ? (
                        <Chip label="Available" color="success" size="small" />
                      ) : (
                        <Chip label="No Video" color="default" size="small" />
                      )}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <IconButton
                          size="small"
                          onClick={() =>
                            window.open(`/courses/${course.courseId}`, "_blank")
                          }
                          title="View Course"
                        >
                          <Visibility />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDialog(course)}
                          title="Edit Course"
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() =>
                            handleDelete(course.courseId, course.courseTitle)
                          }
                          title="Delete Course"
                          color="error"
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Course Form Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingCourse ? "Edit Course" : "Create New Course"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <TextField
              label="Course Title"
              value={formData.courseTitle || ""}
              onChange={handleInputChange("courseTitle")}
              fullWidth
              required
              error={!formData.courseTitle || !formData.courseTitle.trim()}
              helperText={
                !formData.courseTitle || !formData.courseTitle.trim()
                  ? "Course title is required"
                  : ""
              }
            />
            <TextField
              label="Description"
              value={formData.description || ""}
              onChange={handleInputChange("description")}
              fullWidth
              multiline
              rows={3}
              required
              error={!formData.description || !formData.description.trim()}
              helperText={
                !formData.description || !formData.description.trim()
                  ? "Description is required"
                  : ""
              }
            />
            <TextField
              label="Video URL"
              value={formData.urlVideo}
              onChange={handleInputChange("urlVideo")}
              fullWidth
              placeholder="https://youtube.com/watch?v=... (optional)"
              helperText="Optional: Enter a valid video URL"
            />
            <TextField
              label="Price (VND)"
              type="number"
              value={formData.price}
              onChange={handleInputChange("price")}
              fullWidth
              required
              inputProps={{ min: 0 }}
              error={formData.price < 0}
              helperText={
                formData.price < 0
                  ? "Price must be a positive number"
                  : "Enter price in Vietnamese Dong"
              }
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={
              !formData.courseTitle ||
              !formData.courseTitle.trim() ||
              !formData.description ||
              !formData.description.trim() ||
              formData.price < 0
            }
          >
            {editingCourse ? "Update" : "Create"}
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

export default CourseManagement;
