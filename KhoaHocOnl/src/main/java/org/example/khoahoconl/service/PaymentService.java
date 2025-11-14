package org.example.khoahoconl.service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.example.khoahoconl.dto.response.PaymentResponse;
import org.example.khoahoconl.entity.CourseEnrollment;
import org.example.khoahoconl.enums.Status;
import org.example.khoahoconl.exception.AppException;
import org.example.khoahoconl.exception.ErrorCode;
import org.example.khoahoconl.repository.CourseEnrollmentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class PaymentService {

    CourseEnrollmentRepository enrollmentRepository;

    public PaymentResponse processPayment(Long userId, Long courseId) {
        CourseEnrollment enrollment = enrollmentRepository
                .findByUser_UserIdAndCourse_CourseId(userId, courseId)
                .orElseThrow(() -> new AppException(ErrorCode.ENROLLMENT_NOT_FOUND));

        if (enrollment.getStatus() == Status.APPROVED) {
            throw new AppException(ErrorCode.ALREADY_PAID);
        }

        String transactionId = generateTransactionId(enrollment.getCourseEnrollmentId());
        String paymentQRCodeUrl = generateQRCodeUrl(transactionId);

        log.info("Payment initiated for enrollment {}", enrollment.getCourseEnrollmentId());

        return PaymentResponse.builder()
                .paymentQRCodeUrl(paymentQRCodeUrl)
                .message("Vui lòng quét mã QR để thanh toán. Giao dịch đang chờ xác nhận.")
                .build();
    }

    @Transactional
    public String simulatePaymentSuccess(Long enrollmentId) {
        CourseEnrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new AppException(ErrorCode.ENROLLMENT_NOT_FOUND));

        if (enrollment.getStatus() == Status.APPROVED) {
            return "Payment already completed for enrollment ID: " + enrollmentId;
        }

        enrollment.setStatus(Status.APPROVED);
        enrollmentRepository.save(enrollment);

        log.info("Payment simulation successful for enrollment {}", enrollmentId);
        return "Payment simulation successful! Enrollment ID: " + enrollmentId + " is now APPROVED";
    }

    @Transactional
    public void handleWebhookPayment(Long enrollmentId, String transactionId, Status newStatus) {
        CourseEnrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new AppException(ErrorCode.ENROLLMENT_NOT_FOUND));

        enrollment.setStatus(newStatus);
        enrollmentRepository.save(enrollment);

        log.info("Webhook payment processed for enrollment {} with status {}", enrollmentId, newStatus);
    }

    private String generateTransactionId(Long enrollmentId) {
        return "TXN-" + enrollmentId + "-" + System.currentTimeMillis();
    }

    private String generateQRCodeUrl(String transactionId) {
        return "https://placehold.co/400x400/E9E9E9/000000?text=Scan+to+Pay\nID: " + transactionId;
    }
}
