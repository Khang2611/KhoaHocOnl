import React from "react";
import { Box, Typography, LinearProgress, Chip } from "@mui/material";
import { CheckCircle, Schedule } from "@mui/icons-material";

interface ProgressIndicatorProps {
  progress: number; // percentage
  completedLessons: number;
  totalLessons: number;
  showDetails?: boolean;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  progress,
  completedLessons,
  totalLessons,
  showDetails = true,
}) => {
  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "success";
    if (progress >= 50) return "warning";
    return "primary";
  };

  const getProgressText = (progress: number) => {
    if (progress === 100) return "Hoàn thành";
    if (progress >= 80) return "Sắp hoàn thành";
    if (progress >= 50) return "Đang tiến bộ tốt";
    if (progress > 0) return "Đã bắt đầu";
    return "Chưa bắt đầu";
  };

  return (
    <Box sx={{ mb: 3 }}>
      {showDetails && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1,
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            Tiến độ học tập
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Chip
              icon={<CheckCircle />}
              label={`${completedLessons}/${totalLessons} bài`}
              color={getProgressColor(progress)}
              size="small"
            />
            <Chip
              icon={<Schedule />}
              label={getProgressText(progress)}
              variant="outlined"
              size="small"
            />
          </Box>
        </Box>
      )}

      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <LinearProgress
          variant="determinate"
          value={Math.min(progress, 100)}
          color={getProgressColor(progress)}
          sx={{
            flex: 1,
            height: 8,
            borderRadius: 4,
            bgcolor: "grey.200",
          }}
        />
        <Typography
          variant="body2"
          fontWeight="bold"
          color={`${getProgressColor(progress)}.main`}
          sx={{ minWidth: 45 }}
        >
          {Math.round(progress)}%
        </Typography>
      </Box>

      {showDetails && progress > 0 && (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mt: 1, display: "block" }}
        >
          {progress === 100
            ? "🎉 Chúc mừng! Bạn đã hoàn thành khóa học này"
            : `Tiếp tục học để hoàn thành ${
                totalLessons - completedLessons
              } bài học còn lại`}
        </Typography>
      )}
    </Box>
  );
};

export default ProgressIndicator;
