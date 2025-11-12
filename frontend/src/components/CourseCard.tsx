import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  Avatar,
  Rating,
  Button,
} from "@mui/material";
import { Person, Schedule } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { Course } from "../types";

interface CourseCardProps {
  course: Course;
  showEnrollButton?: boolean;
}

const CourseCard: React.FC<CourseCardProps> = ({
  course,
  showEnrollButton = true,
}) => {
  const navigate = useNavigate();
  const [imageError, setImageError] = React.useState(false);

  // Tạo thumbnail dựa trên nội dung khóa học
  const getCourseThumbnail = (course: Course) => {
    const title = course.courseTitle.toLowerCase();

    // Xác định loại khóa học và màu sắc phù hợp
    let bgColor = "4f46e5"; // Default blue
    let textColor = "ffffff";
    let icon = "💻";

    if (title.includes("java") || title.includes("spring")) {
      bgColor = "f89820"; // Orange for Java/Spring
      icon = "☕";
    } else if (title.includes("python")) {
      bgColor = "3776ab"; // Python blue
      icon = "🐍";
    } else if (title.includes("c++") || title.includes("cpp")) {
      bgColor = "00599c"; // C++ blue
      icon = "⚡";
    } else if (
      title.includes("react") ||
      title.includes("javascript") ||
      title.includes("js")
    ) {
      bgColor = "61dafb"; // React blue
      textColor = "000000";
      icon = "⚛️";
    } else if (title.includes("web") || title.includes("lập trình web")) {
      bgColor = "28a745"; // Web green
      icon = "🌐";
    } else if (
      title.includes("mysql") ||
      title.includes("database") ||
      title.includes("sql")
    ) {
      bgColor = "00758f"; // MySQL blue
      icon = "🗄️";
    } else if (title.includes("docker") || title.includes("devops")) {
      bgColor = "2496ed"; // Docker blue
      icon = "🐳";
    } else if (
      title.includes("design") ||
      title.includes("ui") ||
      title.includes("ux")
    ) {
      bgColor = "ff6b6b"; // Design red
      icon = "🎨";
    } else if (title.includes("marketing")) {
      bgColor = "4ecdc4"; // Marketing teal
      icon = "📈";
    }

    // Tạo text ngắn gọn cho ảnh (loại bỏ dấu tiếng Việt để URL sạch hơn)
    const cleanTitle = course.courseTitle
      .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, "a")
      .replace(/[èéẹẻẽêềếệểễ]/g, "e")
      .replace(/[ìíịỉĩ]/g, "i")
      .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, "o")
      .replace(/[ùúụủũưừứựửữ]/g, "u")
      .replace(/[ỳýỵỷỹ]/g, "y")
      .replace(/đ/g, "d")
      .replace(/[ÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴ]/g, "A")
      .replace(/[ÈÉẸẺẼÊỀẾỆỂỄ]/g, "E")
      .replace(/[ÌÍỊỈĨ]/g, "I")
      .replace(/[ÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠ]/g, "O")
      .replace(/[ÙÚỤỦŨƯỪỨỰỬỮ]/g, "U")
      .replace(/[ỲÝỴỶỸ]/g, "Y")
      .replace(/Đ/g, "D");

    const shortTitle =
      cleanTitle.length > 20 ? cleanTitle.substring(0, 20) + "..." : cleanTitle;

    // Sử dụng service tạo ảnh với text
    return `https://dummyimage.com/400x225/${bgColor}/${textColor}&text=${icon}+${encodeURIComponent(
      shortTitle
    )}`;
  };

  // Mock data cho demo
  const mockData = {
    rating: 4.5 + (course.courseId % 10) * 0.05,
    students: 100 + ((course.courseId * 47) % 2000),
    duration: `${2 + (course.courseId % 8)} giờ`,
    level: ["Cơ bản", "Trung cấp", "Nâng cao"][course.courseId % 3],
  };

  const handleCardClick = () => {
    navigate(`/courses/${course.courseId}`);
  };

  const handleEnrollClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/courses/${course.courseId}`);
  };

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 6,
        },
      }}
      onClick={handleCardClick}
    >
      <Box sx={{ position: "relative" }}>
        {imageError ? (
          <Box
            sx={{
              height: 200,
              bgcolor: `hsl(${(course.courseId * 137.5) % 360}, 70%, 60%)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
            }}
          >
            <Typography
              variant="h6"
              fontWeight="bold"
              textAlign="center"
              sx={{ px: 2 }}
            >
              {course.courseTitle}
            </Typography>
          </Box>
        ) : (
          <CardMedia
            component="img"
            height="200"
            image={getCourseThumbnail(course)}
            alt={course.courseTitle}
            sx={{ objectFit: "cover" }}
            onError={() => setImageError(true)}
          />
        )}

        {/* Price overlay */}
        <Box
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            bgcolor: "rgba(0,0,0,0.8)",
            color: "white",
            px: 1.5,
            py: 0.5,
            borderRadius: 1,
          }}
        >
          <Typography variant="body2" fontWeight="bold">
            {course.price
              ? `${course.price.toLocaleString("vi-VN")} VNĐ`
              : "Miễn phí"}
          </Typography>
        </Box>

        {/* Level badge */}
        <Box
          sx={{
            position: "absolute",
            top: 12,
            left: 12,
          }}
        >
          <Chip
            label={mockData.level}
            size="small"
            sx={{
              bgcolor: "rgba(255,255,255,0.9)",
              fontWeight: "bold",
            }}
          />
        </Box>
      </Box>

      <CardContent
        sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
      >
        <Typography
          variant="h6"
          component="h3"
          gutterBottom
          sx={{
            fontWeight: "bold",
            lineHeight: 1.3,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {course.courseTitle}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            flexGrow: 1,
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {course.description}
        </Typography>

        {/* Instructor */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Avatar sx={{ width: 24, height: 24, mr: 1 }}>
            <Person fontSize="small" />
          </Avatar>
          <Typography variant="body2" color="text.secondary">
            {course.createBy?.fullName || "Giảng viên"}
          </Typography>
        </Box>

        {/* Rating and stats */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 2, gap: 1 }}>
          <Rating
            value={mockData.rating}
            precision={0.1}
            size="small"
            readOnly
          />
          <Typography variant="body2" color="text.secondary">
            {mockData.rating.toFixed(1)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ({mockData.students} học viên)
          </Typography>
        </Box>

        {/* Duration */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Schedule fontSize="small" color="action" sx={{ mr: 0.5 }} />
          <Typography variant="body2" color="text.secondary">
            {mockData.duration}
          </Typography>
        </Box>

        {/* Enroll button */}
        {showEnrollButton && (
          <Button
            variant="contained"
            fullWidth
            onClick={handleEnrollClick}
            sx={{ mt: "auto" }}
          >
            Xem chi tiết
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default CourseCard;
