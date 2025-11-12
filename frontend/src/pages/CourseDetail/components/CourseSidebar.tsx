import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  PlayCircleOutline,
  Bookmark,
  Share,
  AccessTime,
  Assignment,
  CloudDownload,
  WorkspacePremium,
  Language,
} from "@mui/icons-material";
import { Course, EnhancedCourse } from "../../../types";

interface CourseSidebarProps {
  course: Course;
  mockCourseData: any;
  enhancedCourse?: EnhancedCourse | null;
  enrollmentStatus: string;
  enrollmentSuccess: boolean;
  processingPayment: boolean;
  user: any;
  onPayment: () => void;
  onNavigateToWatch: () => void;
  onNavigateToLogin: () => void;
}

const CourseSidebar: React.FC<CourseSidebarProps> = ({
  course,
  mockCourseData,
  enhancedCourse,
  enrollmentStatus,
  enrollmentSuccess,
  processingPayment,
  user,
  onPayment,
  onNavigateToWatch,
  onNavigateToLogin,
}) => {
  // Use real duration from enhancedCourse if available
  const duration = enhancedCourse?.estimatedDurationHours
    ? `${enhancedCourse.estimatedDurationHours} giờ`
    : mockCourseData?.duration || "8 giờ";

  const difficulty =
    enhancedCourse?.difficulty || mockCourseData?.level || "Cơ bản";
  const renderEnrollmentButton = () => {
    if (enrollmentStatus === "APPROVED" || enrollmentSuccess) {
      return (
        <Box>
          <Alert severity="success" sx={{ mb: 2 }}>
            🎉 Bạn đã đăng ký khóa học thành công!
          </Alert>
          <Button
            variant="contained"
            fullWidth
            size="large"
            startIcon={<PlayCircleOutline />}
            onClick={onNavigateToWatch}
            sx={{ mb: 2, py: 1.5 }}
          >
            Bắt đầu học ngay
          </Button>
        </Box>
      );
    }

    if (enrollmentStatus === "PENDING") {
      return (
        <Box>
          <Alert severity="warning" sx={{ mb: 2 }}>
            ⏳ Đăng ký đang chờ xử lý thanh toán
          </Alert>
          <Button
            variant="outlined"
            fullWidth
            size="large"
            onClick={onPayment}
            disabled={processingPayment}
            sx={{ mb: 2, py: 1.5 }}
          >
            {processingPayment ? "Đang xử lý..." : "Hoàn tất thanh toán"}
          </Button>
        </Box>
      );
    }

    if (enrollmentStatus === "REJECTED") {
      return (
        <Box>
          <Alert severity="error" sx={{ mb: 2 }}>
            ❌ Đăng ký bị từ chối
          </Alert>
          <Button
            variant="outlined"
            fullWidth
            size="large"
            disabled
            sx={{ mb: 2, py: 1.5 }}
          >
            Liên hệ hỗ trợ
          </Button>
        </Box>
      );
    }

    if (user) {
      return (
        <Button
          variant="contained"
          fullWidth
          size="large"
          onClick={onPayment}
          disabled={processingPayment}
          sx={{ mb: 2, py: 1.5 }}
        >
          {processingPayment ? "Đang xử lý..." : "Đăng ký khóa học"}
        </Button>
      );
    }

    return (
      <Button
        variant="contained"
        fullWidth
        size="large"
        onClick={onNavigateToLogin}
        sx={{ mb: 2, py: 1.5 }}
      >
        Đăng nhập để đăng ký
      </Button>
    );
  };

  return (
    <Card sx={{ position: "sticky", top: 20, borderRadius: 2 }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h4" color="primary" gutterBottom fontWeight="bold">
          {course.price ? course.price.toLocaleString("vi-VN") : "0"} VNĐ
        </Typography>

        {renderEnrollmentButton()}

        <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
          <Button variant="outlined" startIcon={<Bookmark />} sx={{ flex: 1 }}>
            Lưu
          </Button>
          <Button variant="outlined" startIcon={<Share />} sx={{ flex: 1 }}>
            Chia sẻ
          </Button>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" gutterBottom fontWeight="bold">
          📦 Khóa học này bao gồm:
        </Typography>

        <List dense>
          <ListItem>
            <ListItemIcon>
              <AccessTime color="primary" />
            </ListItemIcon>
            <ListItemText
              primary={`${duration} video theo yêu cầu`}
              secondary={`Độ khó: ${difficulty}`}
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Assignment color="primary" />
            </ListItemIcon>
            <ListItemText primary="Bài tập thực hành" />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CloudDownload color="primary" />
            </ListItemIcon>
            <ListItemText primary="Tài liệu tải về" />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <WorkspacePremium color="primary" />
            </ListItemIcon>
            <ListItemText primary="Chứng chỉ hoàn thành" />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Language color="primary" />
            </ListItemIcon>
            <ListItemText primary="Truy cập trọn đời" />
          </ListItem>
        </List>

        <Divider sx={{ my: 2 }} />

        <Typography variant="body2" color="text.secondary">
          📅 Cập nhật lần cuối:{" "}
          {mockCourseData?.lastUpdated || "Tháng 10, 2024"}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default CourseSidebar;
