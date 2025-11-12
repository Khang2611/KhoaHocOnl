import React, { useState, useEffect } from "react";
import {
  Grid,
  Typography,
  Box,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment,
  Chip,
  Stack,
  Pagination,
} from "@mui/material";
import { Search, FilterList } from "@mui/icons-material";
import { Course } from "../types";
import { courseAPI } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { userAPI } from "../services/api";
import CourseCard from "../components/CourseCard";

const Courses: React.FC = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [userEnrollments, setUserEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [page, setPage] = useState(1);
  const coursesPerPage = 9;

  const filters = [
    { key: "all", label: "Tất cả" },
    { key: "web", label: "Web Development" },
    { key: "java", label: "Java" },
    { key: "devops", label: "DevOps" },
    { key: "data", label: "Data Science" },
    { key: "database", label: "Database" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Get courses from database (existing courses)
        const dbCourses = await courseAPI.getAllCourses();
        setCourses(dbCourses);
        setFilteredCourses(dbCourses);

        // Get user enrollments if logged in
        if (user) {
          try {
            const enrollments = await userAPI.getAllEnrollments();
            setUserEnrollments(enrollments);
          } catch (error) {
            console.error("Error fetching enrollments:", error);
            setUserEnrollments([]);
          }
        }
      } catch (err: any) {
        setError(
          err.response?.data?.message || "Không thể tải danh sách khóa học"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  useEffect(() => {
    let filtered = courses;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (course) =>
          course.courseTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category using keywords
    if (selectedFilter !== "all") {
      const categoryKeywords: { [key: string]: string[] } = {
        web: [
          "html",
          "css",
          "javascript",
          "js",
          "react",
          "vue",
          "angular",
          "web",
          "frontend",
          "backend",
          "node",
          "express",
          "api",
          "responsive",
        ],
        java: [
          "java",
          "spring",
          "boot",
          "jpa",
          "hibernate",
          "maven",
          "gradle",
          "microservice",
          "enterprise",
          "mvc",
          "security",
          "jwt",
        ],
        devops: [
          "docker",
          "kubernetes",
          "devops",
          "ci/cd",
          "aws",
          "azure",
          "gcp",
          "cloud",
          "container",
          "deployment",
          "infrastructure",
          "monitoring",
          "jenkins",
        ],
        data: [
          "python",
          "data",
          "machine",
          "learning",
          "ai",
          "artificial",
          "analytics",
          "statistics",
          "pandas",
          "numpy",
          "tensorflow",
          "pytorch",
          "ml",
        ],
        database: [
          "mysql",
          "postgresql",
          "mongodb",
          "database",
          "sql",
          "nosql",
          "redis",
          "elasticsearch",
          "data",
          "query",
          "schema",
        ],
      };

      const keywords = categoryKeywords[selectedFilter] || [];
      filtered = filtered.filter((course) =>
        keywords.some(
          (keyword) =>
            course.courseTitle.toLowerCase().includes(keyword) ||
            course.description.toLowerCase().includes(keyword)
        )
      );
    }

    setFilteredCourses(filtered);
    setPage(1); // Reset to first page when filters change
  }, [courses, searchTerm, selectedFilter]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
  const startIndex = (page - 1) * coursesPerPage;
  const endIndex = startIndex + coursesPerPage;
  const paginatedCourses = filteredCourses.slice(startIndex, endIndex);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: "center" }}>
        <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
          Khám Phá Khóa Học
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ mb: 3 }}>
          Nâng cao kỹ năng của bạn với các khóa học chất lượng cao
        </Typography>
      </Box>

      {/* Courses Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Chọn khóa học phù hợp với nhu cầu học tập của bạn
        </Typography>

        {/* Search and Filters */}
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Tìm kiếm khóa học..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />

          <Stack direction="row" spacing={1} alignItems="center">
            <FilterList color="action" />
            {filters.map((filter) => (
              <Chip
                key={filter.key}
                label={filter.label}
                onClick={() => setSelectedFilter(filter.key)}
                color={selectedFilter === filter.key ? "primary" : "default"}
                variant={selectedFilter === filter.key ? "filled" : "outlined"}
              />
            ))}
          </Stack>
        </Box>

        {/* Results count */}
        <Typography variant="body2" color="text.secondary">
          Tìm thấy {filteredCourses.length} khóa học
          {filteredCourses.length > coursesPerPage &&
            ` - Trang ${page} / ${totalPages}`}
        </Typography>
      </Box>

      {/* Course Grid */}
      {filteredCourses.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            Không tìm thấy khóa học nào
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
          </Typography>
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {paginatedCourses.map((course) => {
              const isEnrolled = userEnrollments.some(
                (enrollment) =>
                  enrollment.course.courseId === course.courseId &&
                  enrollment.status === "APPROVED"
              );

              return (
                <Grid item xs={12} sm={6} md={4} key={course.courseId}>
                  <CourseCard course={course} showEnrollButton={!isEnrolled} />
                </Grid>
              );
            })}
          </Grid>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size="large"
                showFirstButton
                showLastButton
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default Courses;
