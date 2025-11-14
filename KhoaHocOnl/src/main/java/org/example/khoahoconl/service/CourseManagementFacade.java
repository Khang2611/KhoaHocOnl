package org.example.khoahoconl.service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.example.khoahoconl.dto.response.CourseResponse;
import org.example.khoahoconl.dto.response.EnhancedCourseResponse;
import org.example.khoahoconl.dto.response.PaymentResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

/**
 * Facade service to orchestrate course-related operations Reduces controller
 * dependencies and provides unified interface
 */
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class CourseManagementFacade {

    CourseService courseService;
    EnrollmentService enrollmentService;
    PaymentService paymentService;

    // ========== Course Operations ==========
    public List<CourseResponse> getAllCourses() {
        return courseService.getAllCourses();
    }

    public CourseResponse getCourse(Long courseId) {
        return courseService.getCourse(courseId);
    }

    public EnhancedCourseResponse getEnhancedCourseDetails(Long courseId) {
        return courseService.getEnhancedCourseDetails(courseId);
    }

    // ========== Enrollment Operations ==========
    @Transactional
    public Long enrollUserInCourse(Long userId, Long courseId) {
        log.info("User {} enrolling in course {}", userId, courseId);
        return enrollmentService.enrollCourse(userId, courseId);
    }

    public String getEnrollmentStatus(Long userId, Long courseId) {
        return enrollmentService.getEnrollmentStatus(userId, courseId);
    }

    public boolean isUserEnrolled(Long userId, Long courseId) {
        return enrollmentService.isUserEnrolled(userId, courseId);
    }

    public List<CourseResponse> getUserEnrolledCourses(Long userId) {
        return enrollmentService.getEnrolledCourses(userId);
    }

    public List<Map<String, Object>> getUserAllEnrollments(Long userId) {
        return enrollmentService.getAllEnrollments(userId);
    }

    // ========== Payment Operations ==========
    @Transactional
    public PaymentResponse initiatePayment(Long userId, Long courseId) {
        log.info("Initiating payment for user {} and course {}", userId, courseId);
        return paymentService.processPayment(userId, courseId);
    }

    @Transactional
    public String simulatePaymentSuccess(Long enrollmentId) {
        log.info("Simulating payment success for enrollment {}", enrollmentId);
        return paymentService.simulatePaymentSuccess(enrollmentId);
    }

    // ========== Combined Operations ==========
    /**
     * Complete enrollment flow: enroll + generate payment
     */
    @Transactional
    public EnrollmentWithPaymentResult enrollAndInitiatePayment(Long userId, Long courseId) {
        log.info("Starting enrollment and payment flow for user {} and course {}", userId, courseId);

        Long enrollmentId = enrollmentService.enrollCourse(userId, courseId);
        PaymentResponse paymentResponse = paymentService.processPayment(userId, courseId);

        return EnrollmentWithPaymentResult.builder()
                .enrollmentId(enrollmentId)
                .paymentResponse(paymentResponse)
                .message("Enrollment successful. Please complete payment.")
                .build();
    }

    /**
     * Result object for combined enrollment and payment operation
     */
    @lombok.Builder
    @lombok.Getter
    public static class EnrollmentWithPaymentResult {

        private Long enrollmentId;
        private PaymentResponse paymentResponse;
        private String message;
    }
}
