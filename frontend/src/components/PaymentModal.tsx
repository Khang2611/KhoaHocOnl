import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Card,
  CardMedia,
  Stepper,
  Step,
  StepLabel,
  Alert,
  CircularProgress,
} from "@mui/material";
import { QrCode, CheckCircle, Payment } from "@mui/icons-material";

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  course: {
    courseTitle: string;
    price: number;
  };
  paymentStep: number;
  qrCodeUrl?: string;
  onSimulatePayment: () => void;
  processing: boolean;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  open,
  onClose,
  course,
  paymentStep,
  qrCodeUrl,
  onSimulatePayment,
  processing,
}) => {
  const steps = [
    "Đăng ký khóa học",
    "Tạo mã QR thanh toán",
    "Hoàn thành thanh toán",
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Payment color="primary" />
          <Typography variant="h6">Thanh toán khóa học</Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            {course.courseTitle}
          </Typography>
          <Typography variant="h5" color="primary" fontWeight="bold">
            {course.price.toLocaleString("vi-VN")} VNĐ
          </Typography>
        </Box>

        <Stepper activeStep={paymentStep} sx={{ mb: 3 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {paymentStep === 0 && (
          <Alert severity="info">Đang đăng ký khóa học...</Alert>
        )}

        {paymentStep === 1 && (
          <Box>
            <Alert severity="info" sx={{ mb: 2 }}>
              Đang tạo mã QR thanh toán...
            </Alert>
            {processing && (
              <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
                <CircularProgress />
              </Box>
            )}
          </Box>
        )}

        {paymentStep === 2 && qrCodeUrl && (
          <Box>
            <Alert severity="success" sx={{ mb: 2 }}>
              ✅ Mã QR đã được tạo thành công!
            </Alert>

            <Card sx={{ mb: 2 }}>
              <CardMedia
                component="img"
                image={qrCodeUrl}
                alt="QR Code thanh toán"
                sx={{ height: 300, objectFit: "contain", bgcolor: "#f5f5f5" }}
              />
            </Card>

            <Typography
              variant="body2"
              color="text.secondary"
              textAlign="center"
              sx={{ mb: 2 }}
            >
              Quét mã QR bằng ứng dụng ngân hàng để thanh toán
            </Typography>

            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={onSimulatePayment}
              disabled={processing}
              startIcon={
                processing ? <CircularProgress size={20} /> : <CheckCircle />
              }
              sx={{ mb: 1 }}
            >
              {processing ? "Đang xử lý..." : "Giả lập thanh toán thành công"}
            </Button>

            <Typography
              variant="caption"
              color="text.secondary"
              textAlign="center"
              display="block"
            >
              (Chỉ dành cho demo - trong thực tế sẽ tự động xác nhận qua
              webhook)
            </Typography>
          </Box>
        )}

        {paymentStep === 3 && (
          <Alert severity="success" icon={<CheckCircle />}>
            🎉 Thanh toán thành công! Bạn đã đăng ký khóa học thành công.
          </Alert>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={processing}>
          {paymentStep === 3 ? "Hoàn thành" : "Hủy"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentModal;
