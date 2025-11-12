package org.example.khoahoconl.controller;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.khoahoconl.dto.request.CourseUpdateRequest;
import org.example.khoahoconl.dto.response.ApiResponse;
import org.example.khoahoconl.dto.response.CourseResponse;
import org.example.khoahoconl.dto.response.PaymentResponse;
import org.example.khoahoconl.service.CourseService;
import org.example.khoahoconl.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/course")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CourseController {

    final UserService userService;
    final CourseService courseService;

    @GetMapping("all")
    public ResponseEntity<List<CourseResponse>> getAllCourse() {
        List<CourseResponse> courseResponses = courseService.getAllCourses();
        return ResponseEntity.ok(courseResponses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CourseResponse> getCourse(@PathVariable Long id) {
        CourseResponse courseResponse = courseService.getCourse(id);
        return ResponseEntity.ok(courseResponse);
    }

    @GetMapping("/{id}/details")
    public ResponseEntity<org.example.khoahoconl.dto.response.EnhancedCourseResponse> getCourseDetails(@PathVariable Long id) {
        org.example.khoahoconl.dto.response.EnhancedCourseResponse response = courseService.getEnhancedCourseDetails(id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<ApiResponse<CourseResponse>> updateCourse(@PathVariable Long id, @RequestBody CourseUpdateRequest request) {
        ApiResponse<CourseResponse> apiResponse = new ApiResponse<>();
        apiResponse.setResult(courseService.updateCourse(id, request));
        apiResponse.setCode(200);
        apiResponse.setMessage("Course updated successfully.");
        return ResponseEntity.ok(apiResponse);
    }

    @PostMapping("/enroll/{courseId}")
    public ResponseEntity<ApiResponse<String>> enrollCourse(@PathVariable Long courseId) {
        Long userId = getCurrentUserId();
        Long enrollmentId = courseService.enrollCourse(userId, courseId);
        ApiResponse<String> apiResponse = new ApiResponse<>();
        apiResponse.setCode(200);
        apiResponse.setMessage("Enrolled successfully. Please proceed to payment.");
        apiResponse.setResult("Enrollment ID: " + enrollmentId);
        return ResponseEntity.ok(apiResponse);
    }

    @PostMapping("/payment/{courseId}")
    public ResponseEntity<ApiResponse<PaymentResponse>> processPayment(@PathVariable Long courseId) {
        Long userId = getCurrentUserId();
        PaymentResponse paymentResponse = courseService.processPayment(courseId, userId);
        ApiResponse<PaymentResponse> apiResponse = new ApiResponse<>();
        apiResponse.setCode(200);
        apiResponse.setMessage("Payment QR code generated successfully.");
        apiResponse.setResult(paymentResponse);
        return ResponseEntity.ok(apiResponse);
    }

    @PostMapping("/simulate-payment/{enrollmentId}")
    public ResponseEntity<ApiResponse<String>> simulatePayment(@PathVariable Long enrollmentId) {
        String result = courseService.simulatePaymentSuccess(enrollmentId);
        ApiResponse<String> apiResponse = new ApiResponse<>();
        apiResponse.setCode(200);
        apiResponse.setMessage("Payment simulation completed.");
        apiResponse.setResult(result);
        return ResponseEntity.ok(apiResponse);
    }

    @GetMapping("/enrollment-status/{courseId}")
    public ResponseEntity<ApiResponse<String>> getEnrollmentStatus(@PathVariable Long courseId) {
        Long userId = getCurrentUserId();
        String status = courseService.getEnrollmentStatus(userId, courseId);

        ApiResponse<String> apiResponse = new ApiResponse<>();
        apiResponse.setCode(200);
        apiResponse.setMessage("Enrollment status retrieved successfully.");
        apiResponse.setResult(status);
        return ResponseEntity.ok(apiResponse);
    }

    private Long getCurrentUserId() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserDetails) {
            String userName = ((UserDetails) principal).getUsername();
            return userService.getUserIdByUsername(userName);
        }
        throw new IllegalStateException("Could not retrieve user details from security context");
    }
}
