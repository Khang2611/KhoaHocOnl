import React from "react";
import { Paper, Typography, Grid, Box } from "@mui/material";
import { CheckCircle } from "@mui/icons-material";
import { EnhancedCourse } from "../../../types";

interface WhatYouWillLearnProps {
  mockCourseData: any;
  enhancedCourse: EnhancedCourse | null;
}

const WhatYouWillLearn: React.FC<WhatYouWillLearnProps> = ({
  mockCourseData,
  enhancedCourse,
}) => {
  // Use real data from enhancedCourse if available, otherwise fallback to mock
  const learningItems =
    enhancedCourse?.learningObjectives &&
    enhancedCourse.learningObjectives.length > 0
      ? enhancedCourse.learningObjectives
      : mockCourseData?.whatYouWillLearn || [
          "Nắm vững kiến thức cơ bản",
          "Thực hành với các dự án thực tế",
          "Hiểu sâu về best practices",
          "Chuẩn bị cho công việc thực tế",
        ];

  return (
    <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom fontWeight="bold" color="primary">
        🎯 Những gì bạn sẽ học được
      </Typography>
      <Grid container spacing={2}>
        {learningItems.map((item: string, index: number) => (
          <Grid item xs={12} sm={6} key={index}>
            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
              <CheckCircle color="success" sx={{ mt: 0.5, fontSize: 20 }} />
              <Typography variant="body1">{item}</Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default WhatYouWillLearn;
