import React, { useEffect } from "react";
import {
  Container,
  Box,
  Button,
  CircularProgress,
  Alert,
  Grid,
  Breadcrumbs,
  Link,
  Typography,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { courseAPI } from "../../services/api";
import PaymentModal from "../../components/PaymentModal";
import { EnhancedCourse } from "../../types";

// Components
import CourseHero from "./components/CourseHero";
import CourseProgress from "./components/CourseProgress";
import WhatYouWillLearn from "./components/WhatYouWillLearn";
import CourseContent from "./components/CourseContent";
import CourseRequirements from "./components/CourseRequirements";
import CourseInstructor from "./components/CourseInstructor";
import CourseSidebar from "./components/CourseSidebar";

// Hooks
import { useCourseData } from "./hooks/useCourseData";
import { usePayment } from "./hooks/usePayment";

// Utils
import { generateMockData } from "./utils/mockDataGenerator";

const CourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Custom hooks
  const {
    course,
    loading,
    error,
    enrollmentStatus,
    setEnrollmentStatus,
    courseProgress,
    setCourse,
    setError,
    setLoading,
  } = useCourseData(id, user);

  // Enhanced course data with curriculum, objectives, prerequisites
  const [enhancedCourse, setEnhancedCourse] =
    React.useState<EnhancedCourse | null>(null);

  const {
    processingPayment,
    enrollmentSuccess,
    paymentModalOpen,
    setPaymentModalOpen,
    paymentStep,
    qrCodeUrl,
    handlePayment,
    handleSimulatePayment,
  } = usePayment(course, user, setEnrollmentStatus, navigate);

  // Generate mock data based on course content
  const mockCourseData = course ? generateMockData(course) : null;

  // Legacy useEffect for backward compatibility
  useEffect(() => {
    const fetchCourse = async () => {
      if (!id) return;

      // Reset states when course ID changes
      setLoading(true);
      setError("");
      setCourse(null);
      setEnrollmentStatus("NOT_ENROLLED");

      try {
        const courseId = parseInt(id);

        // Fetch enhanced course details with curriculum, objectives, prerequisites
        const detailsData = await courseAPI.getCourseDetails(courseId);
        setEnhancedCourse(detailsData);
        setCourse(detailsData); // Also set basic course data

        // Check enrollment status if user is logged in
        if (user) {
          try {
            const statusResponse = await courseAPI.getEnrollmentStatus(
              courseId
            );
            setEnrollmentStatus(statusResponse.result);

            // If already approved, set success state
            if (statusResponse.result === "APPROVED") {
              // setEnrollmentSuccess(true); // This would need to be exposed from usePayment
            }
          } catch (statusErr: any) {
            // Set default status if API fails
            setEnrollmentStatus("NOT_ENROLLED");
          }
        } else {
          setEnrollmentStatus("NOT_ENROLLED");
        }
      } catch (err: any) {
        setError(
          err.response?.data?.message || "Không thể tải thông tin khóa học"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id, user, setCourse, setEnrollmentStatus, setError, setLoading]);

  // Event handlers
  const handleNavigateToWatch = () => {
    if (course) {
      navigate(`/course/${course.courseId}/watch`);
    }
  };

  const handleNavigateToLogin = () => {
    navigate("/login");
  };

  // Loading state
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  // Course not found
  if (!course) {
    return (
      <Alert severity="warning" sx={{ mt: 2 }}>
        Không tìm thấy khóa học
      </Alert>
    );
  }

  return (
    <Box sx={{ bgcolor: "#f8fafc", minHeight: "100vh" }}>
      {/* Breadcrumbs */}
      <Container maxWidth="lg" sx={{ pt: 2 }}>
        <Breadcrumbs sx={{ mb: 2 }}>
          <Link color="inherit" href="/" onClick={() => navigate("/")}>
            Trang chủ
          </Link>
          <Link
            color="inherit"
            href="/courses"
            onClick={() => navigate("/courses")}
          >
            Khóa học
          </Link>
          <Typography color="text.primary">{course.courseTitle}</Typography>
        </Breadcrumbs>
      </Container>

      {/* Hero Section */}
      <CourseHero course={course} mockCourseData={mockCourseData} />

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={4}>
          {/* Main Content */}
          <Grid item xs={12} md={8}>
            {/* Progress Bar */}
            <CourseProgress
              user={user}
              enrollmentStatus={enrollmentStatus}
              courseProgress={courseProgress}
            />

            {/* What you'll learn */}
            <WhatYouWillLearn
              mockCourseData={mockCourseData}
              enhancedCourse={enhancedCourse}
            />

            {/* Course Content */}
            <CourseContent
              mockCourseData={mockCourseData}
              enhancedCourse={enhancedCourse}
              enrollmentStatus={enrollmentStatus}
              enrollmentSuccess={enrollmentSuccess}
            />

            {/* Requirements */}
            <CourseRequirements
              mockCourseData={mockCourseData}
              enhancedCourse={enhancedCourse}
            />

            {/* Instructor */}
            <CourseInstructor course={course} mockCourseData={mockCourseData} />
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            <CourseSidebar
              course={course}
              mockCourseData={mockCourseData}
              enhancedCourse={enhancedCourse}
              enrollmentStatus={enrollmentStatus}
              enrollmentSuccess={enrollmentSuccess}
              processingPayment={processingPayment}
              user={user}
              onPayment={handlePayment}
              onNavigateToWatch={handleNavigateToWatch}
              onNavigateToLogin={handleNavigateToLogin}
            />
          </Grid>
        </Grid>
      </Container>

      {/* Payment Modal */}
      <PaymentModal
        open={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        course={{
          courseTitle: course.courseTitle,
          price: course.price || 0,
        }}
        paymentStep={paymentStep}
        qrCodeUrl={qrCodeUrl}
        onSimulatePayment={handleSimulatePayment}
        processing={processingPayment}
      />
    </Box>
  );
};

export default CourseDetail;
