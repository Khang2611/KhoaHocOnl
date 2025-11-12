import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Alert,
  Dialog,
  DialogContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import {
  PlayArrow,
  Quiz as QuizIcon,
  CheckCircle,
  ExpandMore,
  Description,
} from "@mui/icons-material";
import { Lesson } from "../../types";
import QuizComponent from "./QuizComponent";
import VideoPlayerEmbed from "./VideoPlayerEmbed";

interface LessonContentProps {
  lesson: Lesson;
  onLessonComplete: (lessonId: number) => void;
  onQuizComplete: (lessonId: number, score: number, passed: boolean) => void;
  onNextLesson?: () => void;
  onPreviousLesson?: () => void;
  hasNextLesson?: boolean;
  hasPreviousLesson?: boolean;
}

const LessonContent: React.FC<LessonContentProps> = ({
  lesson,
  onLessonComplete,
  onQuizComplete,
  onNextLesson,
  onPreviousLesson,
  hasNextLesson = false,
  hasPreviousLesson = false,
}) => {
  const [showQuiz, setShowQuiz] = useState(false);
  const [videoCompleted, setVideoCompleted] = useState(lesson.completed);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  const handleVideoComplete = () => {
    setVideoCompleted(true);
    if (!lesson.quiz) {
      // Nếu không có quiz, đánh dấu bài học hoàn thành ngay
      const lessonId = lesson.lessonId || lesson.id;
      if (lessonId) {
        onLessonComplete(lessonId);
      }
    }
  };

  const handleQuizComplete = (score: number, passed: boolean) => {
    setQuizCompleted(true);
    setQuizScore(score);
    setShowQuiz(false);

    const lessonId = lesson.lessonId || lesson.id;
    if (lessonId) {
      onQuizComplete(lessonId, score, passed);

      if (passed) {
        onLessonComplete(lessonId);
      }
    }
  };

  const canTakeQuiz = videoCompleted && lesson.quiz;
  const lessonFullyCompleted =
    videoCompleted &&
    (!lesson.quiz ||
      (quizCompleted &&
        quizScore &&
        quizScore >= (lesson.quiz?.passingScore || 70)));

  return (
    <Box>
      {/* Video Section */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            <Typography variant="h5" gutterBottom>
              {lesson.lessonTitle || lesson.title}
            </Typography>
            {lessonFullyCompleted && (
              <Chip
                icon={<CheckCircle />}
                label="Hoàn thành"
                color="success"
                variant="filled"
              />
            )}
          </Box>

          {lesson.description && (
            <Accordion sx={{ mb: 2 }}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Description sx={{ mr: 1 }} />
                  <Typography variant="subtitle1">Mô tả bài học</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" color="text.secondary">
                  {lesson.description}
                </Typography>
              </AccordionDetails>
            </Accordion>
          )}

          <VideoPlayerEmbed
            videoUrl={
              lesson.contents?.find((c) => c.contentType === "VIDEO")
                ?.videoUrl ||
              lesson.videoUrl ||
              ""
            }
            title={lesson.lessonTitle || lesson.title || ""}
            onVideoComplete={() => setVideoCompleted(true)}
          />

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {!videoCompleted && (
              <Button
                variant="contained"
                onClick={handleVideoComplete}
                startIcon={<CheckCircle />}
              >
                Đánh dấu đã xem
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Quiz Section */}
      {lesson.quiz && (
        <Card>
          <CardContent>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 2,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <QuizIcon sx={{ mr: 1, color: "primary.main" }} />
                <Typography variant="h6">Quiz: {lesson.quiz.title}</Typography>
              </Box>
              {quizCompleted && quizScore !== null && (
                <Chip
                  label={`Điểm: ${quizScore}%`}
                  color={
                    quizScore >= lesson.quiz.passingScore ? "success" : "error"
                  }
                  variant="filled"
                />
              )}
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Hoàn thành quiz để kết thúc bài học này. Điểm cần thiết:{" "}
              {lesson.quiz.passingScore}%
            </Typography>

            {!videoCompleted && (
              <Alert severity="info" sx={{ mb: 2 }}>
                Bạn cần xem hết video trước khi làm quiz
              </Alert>
            )}

            {quizCompleted &&
              quizScore !== null &&
              quizScore < lesson.quiz.passingScore && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                  Bạn chưa đạt điểm cần thiết. Hãy xem lại video và thử làm quiz
                  một lần nữa!
                </Alert>
              )}

            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="contained"
                onClick={() => setShowQuiz(true)}
                disabled={!canTakeQuiz}
                startIcon={<QuizIcon />}
              >
                {quizCompleted ? "Làm lại Quiz" : "Bắt đầu Quiz"}
              </Button>

              <Chip
                label={`${lesson.quiz.questions.length} câu hỏi`}
                variant="outlined"
              />
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Navigation Section */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Button
              variant="outlined"
              onClick={onPreviousLesson}
              disabled={!hasPreviousLesson}
              startIcon={<PlayArrow sx={{ transform: "rotate(180deg)" }} />}
            >
              Bài trước
            </Button>

            <Typography variant="body2" color="text.secondary">
              {lessonFullyCompleted
                ? "Bài học đã hoàn thành"
                : "Hoàn thành bài học để tiếp tục"}
            </Typography>

            <Button
              variant="contained"
              onClick={onNextLesson}
              disabled={!hasNextLesson || !lessonFullyCompleted}
              endIcon={<PlayArrow />}
            >
              Bài tiếp theo
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Quiz Dialog */}
      <Dialog
        open={showQuiz}
        onClose={() => setShowQuiz(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { minHeight: "80vh" },
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          {lesson.quiz && (
            <QuizComponent
              quiz={lesson.quiz}
              onComplete={handleQuizComplete}
              onClose={() => setShowQuiz(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default LessonContent;
