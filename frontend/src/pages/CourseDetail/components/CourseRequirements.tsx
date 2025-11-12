import React from "react";
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Box,
} from "@mui/material";
import { Assignment, School } from "@mui/icons-material";
import { EnhancedCourse } from "../../../types";

interface CourseRequirementsProps {
  mockCourseData: any;
  enhancedCourse: EnhancedCourse | null;
}

const CourseRequirements: React.FC<CourseRequirementsProps> = ({
  mockCourseData,
  enhancedCourse,
}) => {
  // Use real prerequisites if available
  const hasPrerequisites =
    enhancedCourse?.prerequisites && enhancedCourse.prerequisites.length > 0;

  const requirements = mockCourseData?.requirements || [
    "Kiến thức cơ bản về máy tính",
    "Kết nối internet ổn định",
    "Tinh thần học hỏi",
  ];

  return (
    <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom fontWeight="bold" color="primary">
        📋 Yêu cầu
      </Typography>

      {/* Prerequisites from database */}
      {hasPrerequisites && (
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <School color="primary" />
            Khóa học tiên quyết
          </Typography>
          <List>
            {enhancedCourse.prerequisites.map((prereq, index) => (
              <ListItem key={index} sx={{ py: 0.5 }}>
                <ListItemIcon>
                  <School
                    color={prereq.type === "REQUIRED" ? "error" : "warning"}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      {prereq.courseTitle}
                      <Chip
                        label={
                          prereq.type === "REQUIRED"
                            ? "Bắt buộc"
                            : "Khuyến nghị"
                        }
                        size="small"
                        color={prereq.type === "REQUIRED" ? "error" : "warning"}
                      />
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>
      )}

      {/* General requirements */}
      <Typography
        variant="h6"
        gutterBottom
        sx={{ display: "flex", alignItems: "center", gap: 1 }}
      >
        <Assignment color="primary" />
        Yêu cầu chung
      </Typography>
      <List>
        {requirements.map((item: string, index: number) => (
          <ListItem key={index} sx={{ py: 0.5 }}>
            <ListItemIcon>
              <Assignment color="primary" />
            </ListItemIcon>
            <ListItemText primary={item} />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default CourseRequirements;
