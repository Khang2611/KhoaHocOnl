import React from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  Chip,
  Avatar,
  CardMedia,
  Card,
  Fab,
} from "@mui/material";
import {
  Star,
  Person,
  Group,
  AccessTime,
  School,
  Language,
  WorkspacePremium,
  PlayCircleOutline,
} from "@mui/icons-material";
import { Course } from "../../../types";

interface CourseHeroProps {
  course: Course;
  mockCourseData: any;
}

const CourseHero: React.FC<CourseHeroProps> = ({ course, mockCourseData }) => {
  // Tạo thumbnail giống như CourseCard
  const getCourseThumbnail = (course: Course) => {
    const title = course.courseTitle.toLowerCase();
    let bgColor = "4f46e5";
    let textColor = "ffffff";
    let icon = "💻";

    if (title.includes("java") || title.includes("spring")) {
      bgColor = "f89820";
      icon = "☕";
    } else if (title.includes("python")) {
      bgColor = "3776ab";
      icon = "🐍";
    } else if (title.includes("c++")) {
      bgColor = "00599c";
      icon = "⚡";
    } else if (title.includes("web")) {
      bgColor = "28a745";
      icon = "🌐";
    }

    const cleanTitle = course.courseTitle
      .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, "a")
      .replace(/[èéẹẻẽêềếệểễ]/g, "e")
      .replace(/[ìíịỉĩ]/g, "i")
      .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, "o")
      .replace(/[ùúụủũưừứựửữ]/g, "u")
      .replace(/[ỳýỵỷỹ]/g, "y")
      .replace(/đ/g, "d");

    const shortTitle =
      cleanTitle.length > 25 ? cleanTitle.substring(0, 25) + "..." : cleanTitle;
    return `https://dummyimage.com/800x450/${bgColor}/${textColor}&text=${icon}+${encodeURIComponent(
      shortTitle
    )}`;
  };

  return (
    <Box
      sx={{
        bgcolor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white",
        py: 6,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={8}>
            <Typography
              variant="h3"
              component="h1"
              gutterBottom
              fontWeight="bold"
            >
              {course.courseTitle}
            </Typography>

            <Typography variant="h6" sx={{ mb: 3, opacity: 0.9 }}>
              {course.description}
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 3,
                mb: 3,
                flexWrap: "wrap",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Star sx={{ color: "#ffd700" }} />
                <Typography variant="h6" fontWeight="bold">
                  {mockCourseData?.rating.toFixed(1) || "4.5"}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  ({mockCourseData?.reviews || 100} đánh giá)
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Group />
                <Typography variant="body1">
                  {mockCourseData?.students.toLocaleString() || "1,000"} học
                  viên
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <AccessTime />
                <Typography variant="body1">
                  {mockCourseData?.duration || "8 giờ"}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
              <Avatar sx={{ width: 48, height: 48 }}>
                <Person />
              </Avatar>
              <Box>
                <Typography variant="body1" fontWeight="bold">
                  {course.createBy?.fullName ||
                    mockCourseData?.instructor.name ||
                    "Giảng viên"}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  {mockCourseData?.instructor.title || "Chuyên gia lập trình"}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              <Chip
                icon={<School />}
                label={mockCourseData?.level || "Cơ bản"}
                sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "white" }}
              />
              <Chip
                icon={<Language />}
                label={mockCourseData?.language || "Tiếng Việt"}
                sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "white" }}
              />
              <Chip
                icon={<WorkspacePremium />}
                label="Có chứng chỉ"
                sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "white" }}
              />
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card
              sx={{
                position: "relative",
                borderRadius: 3,
                overflow: "hidden",
              }}
            >
              <CardMedia
                component="img"
                height="250"
                image={getCourseThumbnail(course)}
                alt={course.courseTitle}
              />
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              >
                <Fab
                  color="primary"
                  size="large"
                  sx={{
                    bgcolor: "rgba(255,255,255,0.9)",
                    "&:hover": { bgcolor: "white" },
                  }}
                >
                  <PlayCircleOutline sx={{ fontSize: 40, color: "#1976d2" }} />
                </Fab>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default CourseHero;
