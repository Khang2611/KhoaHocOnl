import React from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Chip,
  Button,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Grid,
} from "@mui/material";
import {
  Schedule,
  TrendingUp,
  CheckCircle,
  ExpandMore,
  School,
  Work,
  Star,
} from "@mui/icons-material";
import { LearningPath } from "../../services/learningPathService";
import { courseService } from "../../services/courseService";
import CourseCardSmall from "../course/CourseCardSmall";

interface LearningPathCardProps {
  path: LearningPath;
  progress?: number;
  onEnroll?: (pathId: number) => void;
  onViewDetails?: (pathId: number) => void;
  onViewCourse?: (courseId: number) => void;
  isEnrolled?: boolean;
  userEnrollments?: any[];
}

const LearningPathCard: React.FC<LearningPathCardProps> = ({
  path,
  progress = 0,
  onEnroll,
  onViewDetails,
  onViewCourse,
  isEnrolled = false,
  userEnrollments = [],
}) => {
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

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "🌱";
      case "Intermediate":
        return "🚀";
      case "Advanced":
        return "⚡";
      default:
        return "📚";
    }
  };

  // Calculate bundle pricing
  const bundle = courseService
    .getCourseBundles()
    .find((b) =>
      b.bundleTitle
        .toLowerCase()
        .includes(path.title.toLowerCase().split(" ")[0])
    );

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 6,
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 2,
          }}
        >
          <Typography
            variant="h5"
            component="h2"
            fontWeight="bold"
            sx={{ flexGrow: 1 }}
          >
            {getDifficultyIcon(path.difficulty)} {path.title}
          </Typography>
          <Chip
            label={path.difficulty}
            color={getDifficultyColor(path.difficulty) as any}
            size="small"
            sx={{ ml: 1 }}
          />
        </Box>

        {/* Bundle Pricing Info */}
        {bundle && (
          <Box
            sx={{
              mb: 2,
              p: 2,
              bgcolor: "primary.50",
              borderRadius: 1,
              border: "1px solid",
              borderColor: "primary.200",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
              }}
            >
              <Typography variant="subtitle2" fontWeight="bold" color="primary">
                💰 Combo lộ trình - Tiết kiệm {bundle.discount}%
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Typography
                variant="body2"
                sx={{ textDecoration: "line-through" }}
                color="text.secondary"
              >
                {bundle.originalPrice.toLocaleString("vi-VN")} VNĐ
              </Typography>
              <Typography variant="h6" fontWeight="bold" color="primary">
                {bundle.bundlePrice.toLocaleString("vi-VN")} VNĐ
              </Typography>
              <Chip
                label={`Tiết kiệm ${(
                  bundle.originalPrice - bundle.bundlePrice
                ).toLocaleString("vi-VN")} VNĐ`}
                size="small"
                color="success"
                variant="outlined"
              />
            </Box>
          </Box>
        )}

        {/* Description */}
        <Typography
          variant="body2"
          color="text.secondary"
          paragraph
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {path.description}
        </Typography>

        {/* Duration and Progress */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Schedule fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {path.estimatedDuration}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <School fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {path.courses.length} khóa học
            </Typography>
          </Box>
        </Box>

        {/* Progress Bar (if enrolled) */}
        {isEnrolled && (
          <Box sx={{ mb: 2 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Tiến độ học tập
              </Typography>
              <Typography variant="body2" fontWeight="bold">
                {progress}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: "grey.200",
                "& .MuiLinearProgress-bar": {
                  borderRadius: 4,
                },
              }}
            />
          </Box>
        )}

        {/* Courses in Path */}
        <Accordion sx={{ boxShadow: "none", "&:before": { display: "none" } }}>
          <AccordionSummary expandIcon={<ExpandMore />} sx={{ px: 0 }}>
            <Typography variant="subtitle2" fontWeight="bold">
              📚 Khóa học trong lộ trình ({path.courses.length})
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ px: 0, pt: 0 }}>
            <Grid container spacing={1}>
              {path.courses.map((course, index) => {
                const isEnrolled = userEnrollments.some(
                  (enrollment) =>
                    enrollment.course.courseId === course.courseId &&
                    enrollment.status === "APPROVED"
                );

                const hasAccess = courseService.hasAccessToCourse(
                  course.courseId,
                  userEnrollments
                );

                return (
                  <Grid item xs={12} sm={6} key={course.courseId}>
                    <CourseCardSmall
                      course={course}
                      index={index}
                      isEnrolled={isEnrolled}
                      hasAccess={hasAccess}
                      onClick={() => onViewCourse?.(course.courseId)}
                    />
                  </Grid>
                );
              })}
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Prerequisites */}
        <Accordion sx={{ boxShadow: "none", "&:before": { display: "none" } }}>
          <AccordionSummary expandIcon={<ExpandMore />} sx={{ px: 0 }}>
            <Typography variant="subtitle2" fontWeight="bold">
              📋 Yêu cầu trước khi học
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ px: 0, pt: 0 }}>
            <List dense>
              {path.prerequisites.map((prereq, index) => (
                <ListItem key={index} sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <CheckCircle fontSize="small" color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary={prereq}
                    primaryTypographyProps={{ variant: "body2" }}
                  />
                </ListItem>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>

        {/* Learning Outcomes */}
        <Accordion sx={{ boxShadow: "none", "&:before": { display: "none" } }}>
          <AccordionSummary expandIcon={<ExpandMore />} sx={{ px: 0 }}>
            <Typography variant="subtitle2" fontWeight="bold">
              🎯 Kết quả sau khóa học
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ px: 0, pt: 0 }}>
            <List dense>
              {path.outcomes.slice(0, 4).map((outcome, index) => (
                <ListItem key={index} sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <Star fontSize="small" color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={outcome}
                    primaryTypographyProps={{ variant: "body2" }}
                  />
                </ListItem>
              ))}
              {path.outcomes.length > 4 && (
                <ListItem sx={{ px: 0 }}>
                  <ListItemText
                    primary={`... và ${path.outcomes.length - 4} kỹ năng khác`}
                    primaryTypographyProps={{
                      variant: "body2",
                      color: "text.secondary",
                      fontStyle: "italic",
                    }}
                  />
                </ListItem>
              )}
            </List>
          </AccordionDetails>
        </Accordion>

        {/* Career Paths */}
        <Box sx={{ mt: 2 }}>
          <Typography
            variant="subtitle2"
            fontWeight="bold"
            sx={{ mb: 1, display: "flex", alignItems: "center", gap: 0.5 }}
          >
            <Work fontSize="small" />
            Cơ hội nghề nghiệp
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {path.careerPaths.slice(0, 3).map((career, index) => (
              <Chip
                key={index}
                label={career}
                size="small"
                variant="outlined"
                sx={{ fontSize: "0.75rem" }}
              />
            ))}
            {path.careerPaths.length > 3 && (
              <Chip
                label={`+${path.careerPaths.length - 3} khác`}
                size="small"
                variant="outlined"
                sx={{ fontSize: "0.75rem" }}
              />
            )}
          </Box>
        </Box>
      </CardContent>

      <Divider />

      <CardActions sx={{ p: 2, justifyContent: "space-between" }}>
        <Button
          variant="outlined"
          onClick={() => onViewDetails?.(path.id)}
          size="small"
        >
          Xem chi tiết
        </Button>

        {isEnrolled ? (
          <Button
            variant="contained"
            color="success"
            startIcon={<TrendingUp />}
            size="small"
          >
            Tiếp tục học
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={() => onEnroll?.(path.id)}
            size="small"
          >
            {bundle
              ? `Mua combo ${bundle.bundlePrice.toLocaleString("vi-VN")} VNĐ`
              : "Bắt đầu lộ trình"}
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default LearningPathCard;
