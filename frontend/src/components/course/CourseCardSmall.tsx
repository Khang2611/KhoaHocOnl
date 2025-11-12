import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  PlayCircleOutline,
  Lock,
  CheckCircle,
  OpenInNew,
} from "@mui/icons-material";
import { Course } from "../../types";

interface CourseCardSmallProps {
  course: Course;
  index: number;
  isEnrolled: boolean;
  hasAccess: boolean;
  onClick: () => void;
}

const CourseCardSmall: React.FC<CourseCardSmallProps> = ({
  course,
  index,
  isEnrolled,
  hasAccess,
  onClick,
}) => {
  const getStatusIcon = () => {
    if (hasAccess) {
      return <CheckCircle color="success" fontSize="small" />;
    } else if (isEnrolled) {
      return <PlayCircleOutline color="primary" fontSize="small" />;
    } else {
      return <Lock color="disabled" fontSize="small" />;
    }
  };

  const getStatusText = () => {
    if (hasAccess) return "Có quyền truy cập";
    if (isEnrolled) return "Đã đăng ký";
    return "Chưa đăng ký";
  };

  const getStatusColor = () => {
    if (hasAccess) return "success";
    if (isEnrolled) return "primary";
    return "default";
  };

  return (
    <Card
      sx={{
        cursor: "pointer",
        transition: "all 0.2s ease",
        border: "1px solid",
        borderColor: hasAccess
          ? "success.light"
          : isEnrolled
          ? "primary.light"
          : "grey.300",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: 3,
          borderColor: hasAccess
            ? "success.main"
            : isEnrolled
            ? "primary.main"
            : "grey.400",
        },
      }}
      onClick={onClick}
    >
      <CardContent sx={{ p: 2 }}>
        {/* Header with index and status */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography
              variant="h6"
              component="span"
              sx={{
                minWidth: 24,
                height: 24,
                borderRadius: "50%",
                bgcolor: "primary.main",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.875rem",
                fontWeight: "bold",
              }}
            >
              {index + 1}
            </Typography>
            <Tooltip title={getStatusText()}>{getStatusIcon()}</Tooltip>
          </Box>

          <Tooltip title="Xem chi tiết khóa học">
            <IconButton size="small" sx={{ p: 0.5 }}>
              <OpenInNew fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Course title */}
        <Typography
          variant="subtitle2"
          fontWeight="bold"
          sx={{
            mb: 1,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            lineHeight: 1.3,
          }}
        >
          {course.courseTitle}
        </Typography>

        {/* Course description */}
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            mb: 1.5,
            lineHeight: 1.2,
          }}
        >
          {course.description}
        </Typography>

        {/* Footer with price and status */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="body2" fontWeight="bold" color="primary">
            {course.price
              ? `${course.price.toLocaleString("vi-VN")} VNĐ`
              : "Miễn phí"}
          </Typography>

          <Chip
            label={getStatusText()}
            size="small"
            color={getStatusColor() as any}
            variant={hasAccess ? "filled" : "outlined"}
            sx={{
              fontSize: "0.7rem",
              height: 20,
              "& .MuiChip-label": {
                px: 1,
              },
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default CourseCardSmall;
