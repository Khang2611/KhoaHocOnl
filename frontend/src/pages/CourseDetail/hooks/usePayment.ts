import { useState } from "react";
import { courseAPI } from "../../../services/api";
import { Course } from "../../../types";

export const usePayment = (
  course: Course | null,
  user: any,
  setEnrollmentStatus: (status: string) => void,
  navigate: (path: string) => void
) => {
  const [processingPayment, setProcessingPayment] = useState(false);
  const [enrollmentSuccess, setEnrollmentSuccess] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentStep, setPaymentStep] = useState(0);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [enrollmentId, setEnrollmentId] = useState<number | null>(null);

  const handlePayment = async () => {
    if (!user || !course) {
      return;
    }

    setPaymentModalOpen(true);
    setPaymentStep(0);
    setProcessingPayment(true);

    try {
      // Step 1: Enroll in course
      const enrollResponse = await courseAPI.enrollCourse(course.courseId);
      setPaymentStep(1);

      // Extract enrollment ID from response
      const enrollmentIdMatch =
        enrollResponse.result.match(/Enrollment ID: (\d+)/);
      if (!enrollmentIdMatch) {
        throw new Error("Could not extract enrollment ID");
      }
      const currentEnrollmentId = parseInt(enrollmentIdMatch[1]);
      setEnrollmentId(currentEnrollmentId);

      // Step 2: Get payment QR code
      const paymentResponse = await courseAPI.processPayment(course.courseId);

      setQrCodeUrl(paymentResponse.result.paymentQRCodeUrl);
      setPaymentStep(2);
      setProcessingPayment(false);
    } catch (err: any) {
      let errorMessage = "Lỗi không xác định";

      if (err.response?.status === 403) {
        errorMessage =
          "Bạn cần đăng nhập để thực hiện chức năng này. Vui lòng đăng nhập lại.";
        // Redirect to login if 403
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }

      alert("❌ Không thể xử lý thanh toán: " + errorMessage);
      setPaymentModalOpen(false);
      setProcessingPayment(false);
    }
  };

  const handleSimulatePayment = async () => {
    if (!course || !enrollmentId) {
      alert("❌ Lỗi: Không tìm thấy thông tin đăng ký");
      return;
    }

    setProcessingPayment(true);
    try {
      await courseAPI.simulatePayment(enrollmentId);

      setPaymentStep(3);
      setEnrollmentSuccess(true);
      setEnrollmentStatus("APPROVED");

      setTimeout(() => {
        setPaymentModalOpen(false);
      }, 2000);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || "Lỗi không xác định";
      alert("❌ Lỗi giả lập thanh toán: " + errorMessage);
    } finally {
      setProcessingPayment(false);
    }
  };

  return {
    processingPayment,
    enrollmentSuccess,
    paymentModalOpen,
    setPaymentModalOpen,
    paymentStep,
    qrCodeUrl,
    enrollmentId,
    handlePayment,
    handleSimulatePayment,
  };
};