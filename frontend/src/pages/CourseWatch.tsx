import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  CircularProgress,
  Alert,
  Divider,
  Button,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { Course, Lesson } from "../types";
import { courseAPI } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import QuizIcon from "@mui/icons-material/Quiz";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LessonContent from "../components/learning/LessonContent";
import { progressService } from "../services/progressService";

const CourseWatch: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchCourseData = async () => {
      // Wait for auth to finish loading before checking user
      if (authLoading) {
        return;
      }

      if (!user) {
        navigate("/login");
        return;
      }

      if (!id) return;

      try {
        // Lấy thông tin khóa học
        const courseData = await courseAPI.getCourse(parseInt(id));
        setCourse(courseData);

        // Lấy danh sách bài học từ API
        const lessonsData = await courseAPI.getCourseLessons(parseInt(id));

        // Load progress từ localStorage
        if (user) {
          const updatedLessons = lessonsData.map((lesson) => {
            const courseProgress = progressService.getCourseProgress(
              parseInt(id),
              user.userId
            );
            const lessonId = lesson.lessonId || lesson.id;
            const isCompleted =
              (lessonId &&
                courseProgress?.completedLessons.includes(lessonId)) ||
              false;
            return { ...lesson, completed: isCompleted };
          });

          setLessons(updatedLessons);
          setCurrentLesson(updatedLessons[0]); // Mặc định chọn bài đầu tiên
        } else {
          setLessons(lessonsData);
          setCurrentLesson(lessonsData[0]);
        }
      } catch (err: any) {
        setError("Không thể tải thông tin khóa học");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [id, user, navigate, authLoading]);

  const handleLessonSelect = (lesson: Lesson) => {
    setCurrentLesson(lesson);

    // Update last accessed lesson
    if (user && course) {
      const lessonId = lesson.lessonId || lesson.id;
      if (lessonId) {
        progressService.updateLastAccessedLesson(
          course.courseId,
          user.userId,
          lessonId
        );
      }
    }
  };

  const handleLessonComplete = (lessonId: number) => {
    if (user && course) {
      // Update progress in localStorage
      progressService.markLessonCompleted(
        course.courseId,
        user.userId,
        lessonId,
        lessons.length
      );

      // Update local state
      setLessons((prev) =>
        prev.map((lesson) =>
          (lesson.lessonId || lesson.id) === lessonId
            ? { ...lesson, completed: true }
            : lesson
        )
      );
    }
  };

  const handleQuizComplete = (
    lessonId: number,
    score: number,
    passed: boolean
  ) => {
    // Có thể lưu kết quả quiz vào database ở đây
    console.log(
      `Quiz completed for lesson ${lessonId}: Score ${score}%, Passed: ${passed}`
    );
  };

  const handleNextLesson = () => {
    if (!currentLesson) return;

    const currentIndex = lessons.findIndex(
      (lesson) =>
        (lesson.lessonId || lesson.id) ===
        (currentLesson.lessonId || currentLesson.id)
    );

    if (currentIndex < lessons.length - 1) {
      setCurrentLesson(lessons[currentIndex + 1]);
    }
  };

  const handlePreviousLesson = () => {
    if (!currentLesson) return;

    const currentIndex = lessons.findIndex(
      (lesson) =>
        (lesson.lessonId || lesson.id) ===
        (currentLesson.lessonId || currentLesson.id)
    );

    if (currentIndex > 0) {
      setCurrentLesson(lessons[currentIndex - 1]);
    }
  };

  const getCurrentLessonIndex = () => {
    if (!currentLesson) return -1;
    return lessons.findIndex(
      (lesson) =>
        (lesson.lessonId || lesson.id) ===
        (currentLesson.lessonId || currentLesson.id)
    );
  };

  const hasNextLesson = () => {
    const currentIndex = getCurrentLessonIndex();
    return currentIndex >= 0 && currentIndex < lessons.length - 1;
  };

  const hasPreviousLesson = () => {
    const currentIndex = getCurrentLessonIndex();
    return currentIndex > 0;
  };

  const handleBackToCourse = () => {
    navigate(`/courses/${id}`);
  };

  if (loading || authLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!course) {
    return (
      <Alert severity="warning" sx={{ mt: 2 }}>
        Không tìm thấy khóa học
      </Alert>
    );
  }

  const completedLessons = lessons.filter((lesson) => lesson.completed).length;
  const progressPercentage = (completedLessons / lessons.length) * 100;

  return (
    <Container maxWidth="xl" sx={{ mt: 2 }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 2 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBackToCourse}
          variant="outlined"
        >
          Quay lại khóa học
        </Button>
        <Typography variant="h4" component="h1">
          {course.courseTitle}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Lesson Content */}
        <Grid item xs={12} md={8}>
          {currentLesson ? (
            <LessonContent
              lesson={currentLesson}
              onLessonComplete={handleLessonComplete}
              onQuizComplete={handleQuizComplete}
              onNextLesson={handleNextLesson}
              onPreviousLesson={handlePreviousLesson}
              hasNextLesson={hasNextLesson()}
              hasPreviousLesson={hasPreviousLesson()}
            />
          ) : (
            <Card>
              <CardContent sx={{ textAlign: "center", py: 8 }}>
                <VideoLibraryIcon
                  sx={{ fontSize: 80, color: "grey.400", mb: 2 }}
                />
                <Typography variant="h6" color="text.secondary">
                  Chọn một bài học để bắt đầu
                </Typography>
              </CardContent>
            </Card>
          )}
        </Grid>

        {/* Lesson List */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <VideoLibraryIcon sx={{ mr: 1, color: "primary.main" }} />
                <Typography variant="h6">Danh sách bài học</Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Tiến độ: {completedLessons}/{lessons.length} bài học
                </Typography>
                <Box
                  sx={{
                    width: "100%",
                    height: 8,
                    backgroundColor: "grey.200",
                    borderRadius: 4,
                    overflow: "hidden",
                  }}
                >
                  <Box
                    sx={{
                      width: `${progressPercentage}%`,
                      height: "100%",
                      backgroundColor: "primary.main",
                      transition: "width 0.3s ease",
                    }}
                  />
                </Box>
              </Box>

              <Divider sx={{ mb: 2 }} />

              <List sx={{ maxHeight: 400, overflow: "auto" }}>
                {lessons.map((lesson) => {
                  const lessonId = lesson.lessonId || lesson.id;
                  const currentLessonId =
                    currentLesson?.lessonId || currentLesson?.id;

                  return (
                    <ListItem key={lessonId} disablePadding>
                      <ListItemButton
                        selected={currentLessonId === lessonId}
                        onClick={() => handleLessonSelect(lesson)}
                        sx={{
                          borderRadius: 1,
                          mb: 1,
                          border:
                            currentLessonId === lessonId
                              ? "2px solid"
                              : "1px solid transparent",
                          borderColor:
                            currentLessonId === lessonId
                              ? "primary.main"
                              : "transparent",
                        }}
                      >
                        <ListItemIcon>
                          {lesson.completed ? (
                            <CheckCircleIcon color="success" />
                          ) : (
                            <PlayArrowIcon color="primary" />
                          )}
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <Typography
                                variant="body2"
                                sx={{
                                  textDecoration: lesson.completed
                                    ? "line-through"
                                    : "none",
                                  opacity: lesson.completed ? 0.7 : 1,
                                  fontWeight:
                                    currentLessonId === lessonId
                                      ? "bold"
                                      : "normal",
                                }}
                              >
                                {lesson.lessonTitle || lesson.title}
                              </Typography>
                              {lesson.quiz && (
                                <QuizIcon
                                  sx={{ fontSize: 16, color: "primary.main" }}
                                />
                              )}
                            </Box>
                          }
                        />
                      </ListItemButton>
                    </ListItem>
                  );
                })}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CourseWatch;
