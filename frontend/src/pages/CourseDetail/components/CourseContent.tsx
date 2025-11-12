import React from "react";
import {
  Paper,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Link,
} from "@mui/material";
import { ExpandMore, PlayCircleOutline } from "@mui/icons-material";
import { EnhancedCourse } from "../../../types";

interface CourseContentProps {
  mockCourseData: any;
  enhancedCourse: EnhancedCourse | null;
  enrollmentStatus: string;
  enrollmentSuccess: boolean;
}

const CourseContent: React.FC<CourseContentProps> = ({
  mockCourseData,
  enhancedCourse,
  enrollmentStatus,
  enrollmentSuccess,
}) => {
  // Transform real curriculum data with lessons
  const realCurriculum =
    enhancedCourse?.curriculum && enhancedCourse.curriculum.length > 0
      ? enhancedCourse.curriculum
          .sort((a, b) => a.displayOrder - b.displayOrder)
          .map((item) => ({
            title: item.chapterTitle,
            duration: `${Math.floor(item.estimatedDurationMinutes / 60)}h ${
              item.estimatedDurationMinutes % 60
            }p`,
            lessons: item.lessons?.length || 0,
            topics:
              item.lessons && item.lessons.length > 0
                ? item.lessons
                    .sort((a, b) => a.displayOrder - b.displayOrder)
                    .map((lesson) => ({
                      title: lesson.lessonTitle,
                      description: lesson.lessonDescription,
                      videoUrl: lesson.videoUrl,
                      duration: lesson.estimatedDurationMinutes,
                      isFreePreview: lesson.isFreePreview,
                    }))
                : [{ title: item.chapterDescription || "Nội dung chương" }],
          }))
      : null;

  const curriculum = realCurriculum ||
    mockCourseData?.curriculum || [
      {
        title: "Giới thiệu khóa học",
        duration: "2 giờ",
        lessons: 5,
        topics: [
          {
            title: "Tổng quan",
            videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          },
          {
            title: "Cài đặt môi trường",
            videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          },
          {
            title: "Bài tập đầu tiên",
            videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          },
        ],
      },
    ];

  return (
    <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom fontWeight="bold" color="primary">
        📚 Nội dung khóa học
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {curriculum.length || 4} chương •{" "}
        {curriculum.reduce((acc: number, curr: any) => acc + curr.lessons, 0) ||
          20}{" "}
        bài học • {mockCourseData?.duration || "8 giờ"} tổng thời lượng
      </Typography>

      {curriculum.map((chapter: any, index: number) => (
        <Accordion key={index} sx={{ mb: 1, "&:before": { display: "none" } }}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
              }}
            >
              <Typography variant="h6" fontWeight="bold">
                {index + 1}. {chapter.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
                {chapter.lessons} bài • {chapter.duration}
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <List dense>
              {chapter.topics.map((topic: any, topicIndex: number) => {
                const isEnrolled =
                  enrollmentStatus === "APPROVED" || enrollmentSuccess;
                const topicTitle =
                  typeof topic === "string" ? topic : topic.title;
                const videoUrl =
                  typeof topic === "object" ? topic.videoUrl : null;
                const isFreePreview = topic.isFreePreview || false;
                const duration = topic.duration;

                return (
                  <ListItem key={topicIndex}>
                    <ListItemIcon>
                      <PlayCircleOutline color="primary" />
                    </ListItemIcon>
                    {(isEnrolled || isFreePreview) && videoUrl ? (
                      <ListItemText
                        primary={
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Link
                              href={videoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              sx={{
                                textDecoration: "none",
                                color: "primary.main",
                                "&:hover": {
                                  textDecoration: "underline",
                                },
                              }}
                            >
                              {topicTitle} 🎥
                            </Link>
                            {isFreePreview && (
                              <Typography
                                variant="caption"
                                sx={{
                                  bgcolor: "success.main",
                                  color: "white",
                                  px: 1,
                                  py: 0.5,
                                  borderRadius: 1,
                                  fontSize: "0.7rem",
                                }}
                              >
                                Xem thử
                              </Typography>
                            )}
                          </Box>
                        }
                        secondary={
                          duration ? `${duration} phút` : topic.description
                        }
                      />
                    ) : (
                      <ListItemText
                        primary={
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            {topicTitle}
                            {isFreePreview && (
                              <Typography
                                variant="caption"
                                sx={{
                                  bgcolor: "success.main",
                                  color: "white",
                                  px: 1,
                                  py: 0.5,
                                  borderRadius: 1,
                                  fontSize: "0.7rem",
                                }}
                              >
                                Xem thử
                              </Typography>
                            )}
                          </Box>
                        }
                        secondary={
                          duration ? `${duration} phút` : topic.description
                        }
                        sx={
                          !isEnrolled && !isFreePreview
                            ? { color: "text.disabled" }
                            : {}
                        }
                      />
                    )}
                    {!isEnrolled && !isFreePreview && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ ml: 1 }}
                      >
                        🔒
                      </Typography>
                    )}
                  </ListItem>
                );
              })}
            </List>
          </AccordionDetails>
        </Accordion>
      ))}
    </Paper>
  );
};

export default CourseContent;
