import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Button,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  LinearProgress,
  Alert,
} from "@mui/material";
import {
  PlayCircleOutline,
  CheckCircle,
  Lock,
  Schedule,
  Star,
  Payment,
  School,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { Course } from "../../types";
import { LearningPath } from "../../services/learningPathService";

interface LearningPathBundleProps {
  path: LearningPath;
  courses: Course[];
  userEnrollments: any[];
  onPurchaseBundle: (pathId: number) => void;
  isProcessingPayment: boolean;
}

const LearningPathBundle: React.FC<LearningPathBundleProps> = ({
  path,
  courses,
  userEnrollments,
  onPurchaseBundle,
  isProcessingPayment,
}) => {
  const navigate = useNavigate();
  const [showDetails, setShowDetails] = useState(false);

  // Calculate bundle pricing
  const originalPrice = courses.reduce((sum, course) => sum + course.price, 0);
  const bundlePrice = Math.round(originalPrice * 0.75); // 25% discount
  const savings = originalPrice - bundlePrice;
  const discountPercentage = Math.round((savings / originalPrice) * 100);

  // Check enrollment status
  const enrolledCourses = courses.filter((course) =>
    userEnrollments.some(
      (enrollment) =>
        enrollment.course.courseId === course.courseId &&
        enrollment.status === "APPROVED"
    )
  );

  const progress =
    courses.length > 0 ? (enrolledCourses.length / courses.length) * 100 : 0;
  const isFullyEnrolled = enrolledCourses.length === courses.length;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "success";
      case "Intermediate":
        return "warning";
      case "Advanced":
        return "error";
      default:
        return "default";
    }
  };

  const handleCourseClick = (courseId: number) => {
    navigate(`/courses/${courseId}`);
  };

  const handlePurchaseClick = () => {
    onPurchaseBundle(path.id);
  };

  return (
    <>
      <Card
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: 4,
          },
          transition: "all 0.3s ease-in-out",
        }}
      >
        {/* Discount Badge */}
        {discountPercentage > 0 && (
          <Chip
            label={`-${discountPercentage}%`}
            color="error"
            size="small"
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
              zIndex: 1,
              fontWeight: "bold",
            }}
          />
        )}

        <CardContent sx={{ flexGrow: 1, pb: 1 }}>
          {/* Header */}
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="h5"
              component="h2"
              fontWeight="bold"
              gutterBottom
            >
              🎯 {path.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {path.description}
            </Typography>

            <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
              <Chip
                icon={<School />}
                label={`${courses.length} khóa học`}
                size="small"
                color="primary"
                variant="outlined"
              />
              <Chip
                icon={<Schedule />}
                label={path.estimatedDuration}
                size="small"
                color="secondary"
                variant="outlined"
              />
              <Chip
                label={path.difficulty}
                size="small"
                color={getDifficultyColor(path.difficulty) as any}
                variant="outlined"
              />
            </Box>
          </Box>

          {/* Progress */}
          {enrolledCourses.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography variant="body2" color="text.secondary">
                  Tiến độ
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {enrolledCourses.length}/{courses.length} khóa học
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{ height: 8, borderRadius: 4 }}
              />
            </Box>
          )}

          {/* Course List Preview */}
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Khóa học bao gồm:
          </Typography>
          <List dense sx={{ py: 0 }}>
            {courses.slice(0, 3).map((course) => {
              const isEnrolled = enrolledCourses.some(
                (c) => c.courseId === course.courseId
              );
              return (
                <ListItem
                  key={course.courseId}
                  sx={{
                    px: 0,
                    cursor: "pointer",
                    "&:hover": { bgcolor: "action.hover" },
                    borderRadius: 1,
                  }}
                  onClick={() => handleCourseClick(course.courseId)}
                >
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    {isEnrolled ? (
                      <CheckCircle color="success" fontSize="small" />
                    ) : (
                      <PlayCircleOutline color="action" fontSize="small" />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={course.courseTitle}
                    primaryTypographyProps={{
                      variant: "body2",
                      sx: {
                        textDecoration: isEnrolled ? "line-through" : "none",
                      },
                    }}
                  />
                </ListItem>
              );
            })}
            {courses.length > 3 && (
              <ListItem sx={{ px: 0 }}>
                <ListItemText
                  primary={`+${courses.length - 3} khóa học khác...`}
                  primaryTypographyProps={{
                    variant: "body2",
                    color: "text.secondary",
                    fontStyle: "italic",
                  }}
                />
              </ListItem>
            )}
          </List>

          {/* Pricing */}
          <Box sx={{ mt: 2, p: 2, bgcolor: "grey.50", borderRadius: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ textDecoration: "line-through" }}
                >
                  {originalPrice.toLocaleString("vi-VN")}đ
                </Typography>
                <Typography variant="h6" color="primary" fontWeight="bold">
                  {bundlePrice.toLocaleString("vi-VN")}đ
                </Typography>
              </Box>
              <Box sx={{ flexGrow: 1 }}>
                <Typography
                  variant="body2"
                  color="success.main"
                  fontWeight="bold"
                >
                  Tiết kiệm {savings.toLocaleString("vi-VN")}đ
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  So với mua lẻ từng khóa
                </Typography>
              </Box>
            </Box>
          </Box>
        </CardContent>

        <CardActions sx={{ p: 2, pt: 0 }}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => setShowDetails(true)}
            sx={{ mr: 1 }}
          >
            Xem chi tiết
          </Button>

          {isFullyEnrolled ? (
            <Button
              variant="contained"
              color="success"
              startIcon={<CheckCircle />}
              disabled
              sx={{ flexGrow: 1 }}
            >
              Đã sở hữu
            </Button>
          ) : (
            <Button
              variant="contained"
              startIcon={<Payment />}
              onClick={handlePurchaseClick}
              disabled={isProcessingPayment}
              sx={{ flexGrow: 1 }}
            >
              {isProcessingPayment ? "Đang xử lý..." : "Mua combo"}
            </Button>
          )}
        </CardActions>
      </Card>

      {/* Details Dialog */}
      <Dialog
        open={showDetails}
        onClose={() => setShowDetails(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Star color="primary" />
            {path.title}
          </Box>
        </DialogTitle>

        <DialogContent>
          <Typography variant="body1" paragraph>
            {path.description}
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            📚 Danh sách khóa học ({courses.length})
          </Typography>

          <List>
            {courses.map((course, index) => {
              const isEnrolled = enrolledCourses.some(
                (c) => c.courseId === course.courseId
              );
              return (
                <React.Fragment key={course.courseId}>
                  <ListItem
                    sx={{
                      cursor: "pointer",
                      "&:hover": { bgcolor: "action.hover" },
                      borderRadius: 1,
                    }}
                    onClick={() => handleCourseClick(course.courseId)}
                  >
                    <ListItemIcon>
                      {isEnrolled ? (
                        <CheckCircle color="success" />
                      ) : (
                        <Lock color="action" />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={`${index + 1}. ${course.courseTitle}`}
                      secondary={course.description}
                      primaryTypographyProps={{
                        fontWeight: isEnrolled ? "normal" : "bold",
                        color: isEnrolled ? "text.secondary" : "text.primary",
                      }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {course.price.toLocaleString("vi-VN")}đ
                    </Typography>
                  </ListItem>
                  {index < courses.length - 1 && <Divider />}
                </React.Fragment>
              );
            })}
          </List>

          <Alert severity="info" sx={{ mt: 2 }}>
            💡 Khi mua combo, bạn sẽ được tự động đăng ký tất cả{" "}
            {courses.length} khóa học và tiết kiệm{" "}
            {savings.toLocaleString("vi-VN")}đ so với mua lẻ!
          </Alert>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setShowDetails(false)}>Đóng</Button>
          {!isFullyEnrolled && (
            <Button
              variant="contained"
              startIcon={<Payment />}
              onClick={() => {
                setShowDetails(false);
                handlePurchaseClick();
              }}
              disabled={isProcessingPayment}
            >
              Mua combo - {bundlePrice.toLocaleString("vi-VN")}đ
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default LearningPathBundle;
