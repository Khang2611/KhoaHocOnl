import React from "react";
import { Paper, Typography, Box, Avatar, Chip } from "@mui/material";
import { Person, Star, Phone } from "@mui/icons-material";
import { Course } from "../../../types";

interface CourseInstructorProps {
  course: Course;
  mockCourseData: any;
}

const CourseInstructor: React.FC<CourseInstructorProps> = ({
  course,
  mockCourseData,
}) => {
  return (
    <Paper sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom fontWeight="bold" color="primary">
        👨‍🏫 Giảng viên
      </Typography>
      <Box sx={{ display: "flex", gap: 3, alignItems: "center", mb: 3 }}>
        <Avatar sx={{ width: 80, height: 80 }}>
          <Person sx={{ fontSize: 40 }} />
        </Avatar>
        <Box>
          <Typography variant="h6" fontWeight="bold">
            {course.createBy?.fullName ||
              mockCourseData?.instructor.name ||
              "Giảng viên"}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
            {mockCourseData?.instructor.title || "Chuyên gia lập trình"}
          </Typography>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Star sx={{ color: "#ffd700", fontSize: 20 }} />
              <Typography variant="body2">
                {mockCourseData?.instructor.rating.toFixed(1) || "4.5"}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              {mockCourseData?.instructor.courses || 5} khóa học
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {mockCourseData?.instructor.students.toLocaleString() || "2,000"}{" "}
              học viên
            </Typography>
          </Box>
        </Box>
      </Box>

      {course.createBy && course.createBy.phoneNumber && (
        <Chip
          icon={<Phone />}
          label={course.createBy.phoneNumber}
          variant="outlined"
        />
      )}
    </Paper>
  );
};

export default CourseInstructor;
