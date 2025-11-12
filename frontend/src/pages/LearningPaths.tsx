import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Grid,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Alert,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Snackbar,
} from "@mui/material";
import {
  Psychology,
  TrendingUp,
  School,
  Work,
  CheckCircle,
  Star,
  Schedule,
  Payment,
  QrCode,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { userAPI, courseAPI } from "../services/api";
import LearningPathBundle from "../components/learning/LearningPathBundle";
import {
  learningPathService,
  LearningPath,
} from "../services/learningPathService";
import {
  bundlePaymentService,
  BundlePaymentResponse,
} from "../services/bundlePaymentService";

const LearningPaths: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [paths, setPaths] = useState<LearningPath[]>([]);
  const [userEnrollments, setUserEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAssessment, setShowAssessment] = useState(false);
  const [assessmentStep, setAssessmentStep] = useState(0);
  const [assessmentAnswers, setAssessmentAnswers] = useState<{
    [key: number]: string;
  }>({});
  const [recommendation, setRecommendation] = useState<any>(null);
  const [showRecommendation, setShowRecommendation] = useState(false);

  // Bundle payment states
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [paymentResponse, setPaymentResponse] =
    useState<BundlePaymentResponse | null>(null);
  const [paymentStep, setPaymentStep] = useState(0); // 0: QR, 1: Processing, 2: Success
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch courses from database
        const courses = await courseAPI.getAllCourses();

        // Get learning paths with courses populated from database
        const learningPaths =
          learningPathService.getLearningPathsWithCourses(courses);
        console.log("Loaded courses from database:", courses.length);
        console.log("Learning paths configured:", learningPaths.length);
        setPaths(learningPaths);

        // Fetch user enrollments if logged in
        if (user) {
          try {
            const enrollments = await userAPI.getAllEnrollments();
            setUserEnrollments(enrollments);
          } catch (error) {
            console.error("Error fetching enrollments:", error);
            setUserEnrollments([]);
          }
        }
      } catch (error) {
        console.error("Error fetching learning paths:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const assessment = learningPathService.getSkillAssessment();

  const handleStartAssessment = () => {
    setShowAssessment(true);
    setAssessmentStep(0);
    setAssessmentAnswers({});
  };

  const handleAssessmentAnswer = (questionId: number, answer: string) => {
    setAssessmentAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleNextStep = () => {
    if (assessmentStep < assessment.questions.length - 1) {
      setAssessmentStep((prev) => prev + 1);
    } else {
      // Generate recommendation
      const rec = learningPathService.generateRecommendation(assessmentAnswers);
      setRecommendation(rec);
      setShowAssessment(false);
      setShowRecommendation(true);
    }
  };

  const handlePrevStep = () => {
    if (assessmentStep > 0) {
      setAssessmentStep((prev) => prev - 1);
    }
  };

  const handleEnrollPath = (pathId: number) => {
    if (!user) {
      navigate("/login");
      return;
    }

    const path = paths.find((p) => p.id === pathId);
    if (path && path.courses.length > 0) {
      // Navigate to first course in the path
      navigate(`/courses/${path.courses[0].courseId}`);
    }
  };

  // Handle bundle purchase
  const handlePurchaseBundle = async (pathId: number) => {
    if (!user) {
      navigate("/login");
      return;
    }

    const path = paths.find((p) => p.id === pathId);
    if (!path || path.courses.length === 0) {
      setSnackbar({
        open: true,
        message: "Không tìm thấy lộ trình hoặc lộ trình chưa có khóa học",
        severity: "error",
      });
      return;
    }

    setIsProcessingPayment(true);

    try {
      const courseIds = path.courses.map((c) => c.courseId);
      const pricing = bundlePaymentService.getBundlePricing(path.courses);

      const paymentRequest = {
        pathId,
        courseIds,
        bundlePrice: pricing.bundlePrice,
        originalPrice: pricing.originalPrice,
      };

      const response = await bundlePaymentService.processBundlePayment(
        paymentRequest
      );
      setPaymentResponse(response);
      setPaymentStep(0);
      setShowPaymentDialog(true);
    } catch (error) {
      console.error("Bundle payment error:", error);
      setSnackbar({
        open: true,
        message: "Có lỗi xảy ra khi xử lý thanh toán. Vui lòng thử lại.",
        severity: "error",
      });
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Simulate payment success
  const handleSimulatePaymentSuccess = async () => {
    if (!paymentResponse) return;

    setPaymentStep(1); // Processing

    try {
      const result = await bundlePaymentService.simulateBundlePaymentSuccess(
        paymentResponse.bundleEnrollmentId,
        paymentResponse.courseIds
      );

      if (result.success) {
        setPaymentStep(2); // Success

        // Refresh user enrollments
        if (user) {
          try {
            const enrollments = await userAPI.getAllEnrollments();
            setUserEnrollments(enrollments);
          } catch (error) {
            console.error("Error refreshing enrollments:", error);
          }
        }

        setSnackbar({
          open: true,
          message: result.message,
          severity: "success",
        });
      } else {
        setSnackbar({
          open: true,
          message: result.message,
          severity: "error",
        });
      }
    } catch (error) {
      console.error("Payment simulation error:", error);
      setSnackbar({
        open: true,
        message: "Có lỗi xảy ra khi xử lý thanh toán. Vui lòng thử lại.",
        severity: "error",
      });
    }
  };

  const handleClosePaymentDialog = () => {
    setShowPaymentDialog(false);
    setPaymentResponse(null);
    setPaymentStep(0);
  };

  const currentQuestion = assessment.questions[assessmentStep];
  const canProceed = assessmentAnswers[currentQuestion?.id];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ textAlign: "center", mb: 6 }}>
        <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
          🎯 Lộ trình học tập
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Chọn lộ trình phù hợp với mục tiêu nghề nghiệp của bạn
        </Typography>

        <Box sx={{ display: "flex", gap: 2, justifyContent: "center", mt: 3 }}>
          <Button
            variant="contained"
            startIcon={<Psychology />}
            onClick={handleStartAssessment}
            size="large"
          >
            Đánh giá kỹ năng
          </Button>
          <Button
            variant="outlined"
            startIcon={<School />}
            size="large"
            onClick={() => navigate("/courses")}
          >
            Xem tất cả khóa học
          </Button>
        </Box>
      </Box>

      {/* Learning Path Bundles Grid */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <Typography>Đang tải lộ trình học tập...</Typography>
        </Box>
      ) : (
        <Grid container spacing={4}>
          {paths.map((path) => (
            <Grid item xs={12} md={6} key={path.id}>
              <LearningPathBundle
                path={path}
                courses={path.courses}
                userEnrollments={userEnrollments}
                onPurchaseBundle={handlePurchaseBundle}
                isProcessingPayment={isProcessingPayment}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Why Choose Learning Paths */}
      <Box sx={{ mt: 8, textAlign: "center" }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Tại sao nên chọn lộ trình học tập?
        </Typography>

        <Grid container spacing={4} sx={{ mt: 2 }}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, height: "100%", textAlign: "center" }}>
              <TrendingUp sx={{ fontSize: 48, color: "primary.main", mb: 2 }} />
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Học tập có hệ thống
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Các khóa học được sắp xếp theo trình tự logic, từ cơ bản đến
                nâng cao
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, height: "100%", textAlign: "center" }}>
              <Work sx={{ fontSize: 48, color: "success.main", mb: 2 }} />
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Định hướng nghề nghiệp
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Mỗi lộ trình được thiết kế cho các vị trí công việc cụ thể
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, height: "100%", textAlign: "center" }}>
              <CheckCircle
                sx={{ fontSize: 48, color: "warning.main", mb: 2 }}
              />
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Theo dõi tiến độ
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Dễ dàng theo dõi tiến độ học tập và hoàn thành mục tiêu
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Skill Assessment Dialog */}
      <Dialog
        open={showAssessment}
        onClose={() => setShowAssessment(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Psychology color="primary" />
            Đánh giá kỹ năng và định hướng
          </Box>
        </DialogTitle>

        <DialogContent>
          {/* Progress Stepper */}
          <Stepper activeStep={assessmentStep} sx={{ mb: 4 }}>
            {assessment.questions.map((_, index) => (
              <Step key={index}>
                <StepLabel>Câu {index + 1}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* Current Question */}
          {currentQuestion && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {currentQuestion.question}
              </Typography>

              <FormControl component="fieldset" fullWidth>
                <RadioGroup
                  value={assessmentAnswers[currentQuestion.id] || ""}
                  onChange={(e) =>
                    handleAssessmentAnswer(currentQuestion.id, e.target.value)
                  }
                >
                  {currentQuestion.options.map((option, index) => (
                    <FormControlLabel
                      key={index}
                      value={option}
                      control={<Radio />}
                      label={option}
                      sx={{ mb: 1 }}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handlePrevStep} disabled={assessmentStep === 0}>
            Quay lại
          </Button>
          <Button
            variant="contained"
            onClick={handleNextStep}
            disabled={!canProceed}
          >
            {assessmentStep === assessment.questions.length - 1
              ? "Hoàn thành"
              : "Tiếp theo"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Recommendation Dialog */}
      <Dialog
        open={showRecommendation}
        onClose={() => setShowRecommendation(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Star color="primary" />
            Gợi ý lộ trình phù hợp
          </Box>
        </DialogTitle>

        <DialogContent>
          {recommendation && (
            <Box>
              <Alert severity="success" sx={{ mb: 3 }}>
                Dựa trên đánh giá của bạn, chúng tôi khuyến nghị lộ trình sau:
              </Alert>

              {/* Recommended Path */}
              <Paper sx={{ p: 3, mb: 3, bgcolor: "primary.50" }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  🎯 {recommendation.recommendedPath.title}
                </Typography>
                <Typography variant="body1" paragraph>
                  {recommendation.recommendedPath.description}
                </Typography>

                <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                  <Chip
                    icon={<Schedule />}
                    label={`Thời gian: ${recommendation.estimatedTimeToComplete}`}
                    color="primary"
                    variant="outlined"
                  />
                  <Chip
                    icon={<School />}
                    label={`Bắt đầu từ khóa học ${recommendation.startingCourse}`}
                    color="secondary"
                    variant="outlined"
                  />
                </Box>
              </Paper>

              {/* Tips */}
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                💡 Lời khuyên cho hành trình học tập
              </Typography>
              <List>
                {recommendation.tips.map((tip: string, index: number) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <CheckCircle color="success" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={tip} />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setShowRecommendation(false)}>Đóng</Button>
          <Button
            variant="contained"
            onClick={() => {
              setShowRecommendation(false);
              if (recommendation) {
                handleEnrollPath(recommendation.recommendedPath.id);
              }
            }}
          >
            Bắt đầu lộ trình này
          </Button>
        </DialogActions>
      </Dialog>

      {/* Bundle Payment Dialog */}
      <Dialog
        open={showPaymentDialog}
        onClose={handleClosePaymentDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Payment color="primary" />
            Thanh toán combo lộ trình
          </Box>
        </DialogTitle>

        <DialogContent>
          {paymentStep === 0 && paymentResponse && (
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h6" gutterBottom>
                Quét mã QR để thanh toán
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                {paymentResponse.message}
              </Typography>

              <Box
                component="img"
                src={paymentResponse.paymentQRCodeUrl}
                alt="Payment QR Code"
                sx={{
                  width: "100%",
                  maxWidth: 300,
                  height: "auto",
                  border: "1px solid",
                  borderColor: "grey.300",
                  borderRadius: 2,
                  mb: 2,
                }}
              />

              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  💡 Đây là thanh toán mô phỏng. Nhấn "Mô phỏng thanh toán thành
                  công" để hoàn tất quá trình đăng ký tất cả khóa học trong
                  combo.
                </Typography>
              </Alert>
            </Box>
          )}

          {paymentStep === 1 && (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography variant="h6" gutterBottom>
                Đang xử lý thanh toán...
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Vui lòng chờ trong giây lát. Chúng tôi đang đăng ký bạn vào tất
                cả khóa học trong combo.
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                <div>Loading...</div>
              </Box>
            </Box>
          )}

          {paymentStep === 2 && (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <CheckCircle color="success" sx={{ fontSize: 64, mb: 2 }} />
              <Typography variant="h6" gutterBottom color="success.main">
                Thanh toán thành công! 🎉
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Bạn đã được đăng ký vào tất cả khóa học trong combo. Có thể truy
                cập ngay bây giờ!
              </Typography>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          {paymentStep === 0 && (
            <>
              <Button onClick={handleClosePaymentDialog}>Hủy</Button>
              <Button
                variant="contained"
                onClick={handleSimulatePaymentSuccess}
                startIcon={<QrCode />}
              >
                Mô phỏng thanh toán thành công
              </Button>
            </>
          )}

          {paymentStep === 1 && <Button disabled>Đang xử lý...</Button>}

          {paymentStep === 2 && (
            <Button
              variant="contained"
              onClick={handleClosePaymentDialog}
              color="success"
            >
              Hoàn tất
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default LearningPaths;
