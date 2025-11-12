import React, { useState, useEffect } from "react";
import {
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Box,
  LinearProgress,
  Chip,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  PlayCircleOutline,
  School,
  AccessTime,
  CheckCircle,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { Course } from "../types";
import { useAuth } from "../contexts/AuthContext";
import { userAPI } from "../services/api";
import { progressService } from "../services/progressService";

interface EnrolledCourse extends Course {
  enrollmentDate: string;
  progress: number;
  completedLessons: number;
  totalLessons: number;
  lastAccessedLesson?: number;
}

const MyCourses: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [courses, setCourses] = useState<EnrolledCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchMyCourses = async () => {
      // Wait for auth to finish loading before checking user
      if (authLoading) {
        return;
      }

      if (!user) {
        navigate("/login");
        return;
      }

      try {
        // Gọi API để lấy danh sách khóa học đã đăng ký và thông tin enrollment
        const [enrolledCoursesResponse, allEnrollmentsResponse] =
          await Promise.all([
            userAPI.getEnrolledCourses(),
            userAPI.getAllEnrollments(),
          ]);

        // Transform data to match EnrolledCourse interface
        const enrolledCourses: EnrolledCourse[] = enrolledCoursesResponse.map(
          (course: Course) => {
            // Tìm thông tin enrollment tương ứng
            const enrollmentInfo = allEnrollmentsResponse.find(
              (enrollment: any) =>
                enrollment.course.courseId === course.courseId
            );

            // Lấy progress từ localStorage
            const courseProgress = progressService.getCourseProgress(
              course.courseId,
              user.userId
            );

            // Nếu chưa có progress, khởi tạo với 5 lessons mặc định
            const totalLessons = 5; // TODO: Get from course data when available
            const progress =
              courseProgress ||
              progressService.initializeCourseProgress(
                course.courseId,
                user.userId,
                totalLessons
              );

            return {
              ...course,
              enrollmentDate:
                enrollmentInfo?.requestDate || new Date().toISOString(),
              progress: progress.progress || 0,
              completedLessons: progress.completedLessons?.length || 0,
              totalLessons: progress.totalLessons || totalLessons,
              lastAccessedLesson: progress.lastAccessedLesson,
            };
          }
        );

        setCourses(enrolledCourses);
      } catch (err: any) {
        console.error("Error fetching enrolled courses:", err);
        setError(
          err.response?.data?.message || "Không thể tải danh sách khóa học"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMyCourses();
  }, [user, navigate, authLoading]);

  const handleContinueLearning = (courseId: number) => {
    navigate(`/course/${courseId}/watch`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading || authLoading) {
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

  const totalProgress =
    courses.length > 0
      ? Math.round(
          courses.reduce((sum, course) => sum + course.progress, 0) /
            courses.length
        )
      : 0;

  const completedCourses = courses.filter(
    (course) => course.progress === 100
  ).length;

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Khóa học của tôi
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Tiếp tục học tập và hoàn thành các khóa học bạn đã đăng ký
        </Typography>
      </Box>

      {/* Stats Cards */}
      {courses.length > 0 && (
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={4}>
            <Card sx={{ textAlign: "center", p: 2 }}>
              <Typography variant="h3" color="primary.main" fontWeight="bold">
                {courses.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Khóa học đã đăng ký
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ textAlign: "center", p: 2 }}>
              <Typography variant="h3" color="success.main" fontWeight="bold">
                {completedCourses}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Khóa học hoàn thành
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ textAlign: "center", p: 2 }}>
              <Typography variant="h3" color="warning.main" fontWeight="bold">
                {totalProgress}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tiến độ trung bình
              </Typography>
            </Card>
          </Grid>
        </Grid>
      )}

      {courses.length === 0 ? (
        <Card sx={{ textAlign: "center", py: 8 }}>
          <CardContent>
            <School sx={{ fontSize: 80, color: "grey.400", mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Bạn chưa đăng ký khóa học nào
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Khám phá các khóa học tuyệt vời và bắt đầu hành trình học tập của
              bạn
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate("/courses")}
              startIcon={<School />}
            >
              Khám phá khóa học
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {courses.map((course) => (
            <Grid item xs={12} md={6} lg={4} key={course.courseId}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 4,
                  },
                }}
              >
                <CardMedia
                  component="div"
                  sx={{
                    height: 200,
                    background: `linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                  }}
                >
                  <PlayCircleOutline sx={{ fontSize: 60 }} />
                </CardMedia>

                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    {course.courseTitle}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2, height: 40, overflow: "hidden" }}
                  >
                    {course.description}
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Tiến độ
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {course.progress}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={course.progress}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ mt: 1 }}
                    >
                      {course.completedLessons}/{course.totalLessons} bài học
                      hoàn thành
                    </Typography>
                  </Box>

                  <Box
                    sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}
                  >
                    <Chip
                      icon={<AccessTime />}
                      label="Đang học"
                      color="primary"
                      size="small"
                    />
                    {course.progress === 100 && (
                      <Chip
                        icon={<CheckCircle />}
                        label="Hoàn thành"
                        color="success"
                        size="small"
                      />
                    )}
                  </Box>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                    sx={{ mb: 2 }}
                  >
                    Đăng ký: {formatDate(course.enrollmentDate)}
                  </Typography>

                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<PlayCircleOutline />}
                    onClick={() => handleContinueLearning(course.courseId)}
                    sx={{ mt: "auto" }}
                  >
                    {course.progress > 0 ? "Tiếp tục học" : "Bắt đầu học"}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {courses.length > 0 && (
        <Card sx={{ mt: 4, p: 4, textAlign: "center", bgcolor: "primary.50" }}>
          <Typography variant="h5" gutterBottom fontWeight="bold">
            Tiếp tục phát triển kỹ năng của bạn! 🚀
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Khám phá thêm nhiều khóa học chất lượng cao để nâng cao kiến thức và
            kỹ năng
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate("/courses")}
            startIcon={<School />}
          >
            Khám phá khóa học mới
          </Button>
        </Card>
      )}
    </Box>
  );
};

export default MyCourses;
