import React from "react";
import { Box, Typography, Paper, LinearProgress } from "@mui/material";

interface CourseProgressProps {
  user: any;
  enrollmentStatus: string;
  courseProgress: number;
}

const CourseProgress: React.FC<CourseProgressProps> = ({
  user,
  enrollmentStatus,
  courseProgress,
}) => {
  if (!user) return null;

  return (
    <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          Tiến độ khóa học
        </Typography>
        <Typography variant="body2" color="primary" fontWeight="bold">
          {enrollmentStatus === "APPROVED"
            ? `${courseProgress}% hoàn thành`
            : "0% hoàn thành"}
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={enrollmentStatus === "APPROVED" ? courseProgress : 0}
        sx={{ height: 8, borderRadius: 4 }}
      />
      {enrollmentStatus !== "APPROVED" && (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mt: 1, display: "block" }}
        >
          Đăng ký khóa học để bắt đầu học tập và theo dõi tiến độ
        </Typography>
      )}
    </Paper>
  );
};

export default CourseProgress;
