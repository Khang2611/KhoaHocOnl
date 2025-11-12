import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Button,
  Alert,
  LinearProgress,
  Chip,
  Divider,
} from "@mui/material";
import { Quiz } from "../../types";
import { CheckCircle, Cancel, Quiz as QuizIcon } from "@mui/icons-material";

interface QuizComponentProps {
  quiz: Quiz;
  onComplete: (score: number, passed: boolean) => void;
  onClose: () => void;
}

const QuizComponent: React.FC<QuizComponentProps> = ({
  quiz,
  onComplete,
  onClose,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>(
    new Array(quiz.questions.length).fill(-1)
  );
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  const handleAnswerChange = (questionIndex: number, answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleSubmitQuiz();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitQuiz = () => {
    let correctAnswers = 0;
    quiz.questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });

    const finalScore = Math.round(
      (correctAnswers / quiz.questions.length) * 100
    );
    const passed = finalScore >= quiz.passingScore;

    setScore(finalScore);
    setShowResults(true);
    onComplete(finalScore, passed);
  };

  const isAnswered = answers[currentQuestionIndex] !== -1;

  if (showResults) {
    return (
      <Card sx={{ maxWidth: 800, mx: "auto" }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <QuizIcon sx={{ fontSize: 60, color: "primary.main", mb: 2 }} />
            <Typography variant="h4" gutterBottom>
              Kết quả Quiz
            </Typography>
            <Typography variant="h6" color="text.secondary">
              {quiz.title}
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h2"
              align="center"
              color={score >= quiz.passingScore ? "success.main" : "error.main"}
            >
              {score}%
            </Typography>
            <Typography variant="body1" align="center" color="text.secondary">
              Điểm số của bạn
            </Typography>
          </Box>

          <Alert
            severity={score >= quiz.passingScore ? "success" : "error"}
            sx={{ mb: 3 }}
          >
            {score >= quiz.passingScore
              ? `Chúc mừng! Bạn đã vượt qua quiz với điểm số ${score}%. Điểm cần thiết: ${quiz.passingScore}%`
              : `Bạn chưa đạt điểm cần thiết. Điểm của bạn: ${score}%, điểm cần thiết: ${quiz.passingScore}%. Hãy xem lại bài học và thử lại!`}
          </Alert>

          <Divider sx={{ mb: 3 }} />

          <Typography variant="h6" gutterBottom>
            Chi tiết kết quả:
          </Typography>

          {quiz.questions.map((question, index) => {
            const userAnswer = answers[index];
            const isCorrect = userAnswer === question.correctAnswer;

            return (
              <Card
                key={question.id}
                sx={{
                  mb: 2,
                  border: isCorrect ? "2px solid green" : "2px solid red",
                }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    {isCorrect ? (
                      <CheckCircle sx={{ color: "success.main", mr: 1 }} />
                    ) : (
                      <Cancel sx={{ color: "error.main", mr: 1 }} />
                    )}
                    <Typography variant="subtitle1" fontWeight="bold">
                      Câu {index + 1}: {question.question}
                    </Typography>
                  </Box>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    Câu trả lời của bạn:{" "}
                    {question.options[userAnswer] || "Không trả lời"}
                  </Typography>

                  {!isCorrect && (
                    <Typography
                      variant="body2"
                      color="success.main"
                      sx={{ mb: 1 }}
                    >
                      Đáp án đúng: {question.options[question.correctAnswer]}
                    </Typography>
                  )}

                  {question.explanation && (
                    <Alert severity="info" sx={{ mt: 2 }}>
                      <Typography variant="body2">
                        <strong>Giải thích:</strong> {question.explanation}
                      </Typography>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            );
          })}

          <Box
            sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 4 }}
          >
            <Button variant="outlined" onClick={onClose}>
              Đóng
            </Button>
            {score < quiz.passingScore && (
              <Button
                variant="contained"
                onClick={() => {
                  setCurrentQuestionIndex(0);
                  setAnswers(new Array(quiz.questions.length).fill(-1));
                  setShowResults(false);
                  setScore(0);
                }}
              >
                Làm lại
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ maxWidth: 800, mx: "auto" }}>
      <CardContent sx={{ p: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" gutterBottom>
            {quiz.title}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <Chip
              label={`Câu ${currentQuestionIndex + 1}/${quiz.questions.length}`}
              color="primary"
            />
            <Chip
              label={`Điểm cần thiết: ${quiz.passingScore}%`}
              variant="outlined"
            />
          </Box>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{ height: 8, borderRadius: 4 }}
          />
        </Box>

        <Card variant="outlined" sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {currentQuestion.question}
            </Typography>

            <FormControl component="fieldset" sx={{ width: "100%" }}>
              <RadioGroup
                value={answers[currentQuestionIndex]}
                onChange={(e) =>
                  handleAnswerChange(
                    currentQuestionIndex,
                    parseInt(e.target.value)
                  )
                }
              >
                {currentQuestion.options.map((option, index) => (
                  <FormControlLabel
                    key={index}
                    value={index}
                    control={<Radio />}
                    label={option}
                    sx={{
                      mb: 1,
                      p: 1,
                      borderRadius: 1,
                      "&:hover": { bgcolor: "grey.50" },
                    }}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </CardContent>
        </Card>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Button
            variant="outlined"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
          >
            Câu trước
          </Button>

          <Typography variant="body2" color="text.secondary">
            {answers.filter((a) => a !== -1).length}/{quiz.questions.length} câu
            đã trả lời
          </Typography>

          <Button
            variant="contained"
            onClick={handleNext}
            disabled={!isAnswered}
          >
            {currentQuestionIndex === quiz.questions.length - 1
              ? "Nộp bài"
              : "Câu tiếp"}
          </Button>
        </Box>

        <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
          <Button variant="text" onClick={onClose}>
            Hủy bỏ
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default QuizComponent;
