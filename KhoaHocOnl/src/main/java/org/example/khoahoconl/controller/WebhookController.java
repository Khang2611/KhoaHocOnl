package org.example.khoahoconl.controller;
import lombok.RequiredArgsConstructor;
import org.example.khoahoconl.dto.request.WebhookRequest;
import org.example.khoahoconl.dto.response.ApiResponse;
import org.example.khoahoconl.entity.CourseEnrollment;
import org.example.khoahoconl.service.CourseService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api")
@RequiredArgsConstructor
public class WebhookController {
    private final CourseService courseService;
    @PostMapping("/webhook/payment")
    public ResponseEntity<ApiResponse<CourseEnrollment>> handlePaymentWebhook(@RequestBody WebhookRequest request) {
        CourseEnrollment updatedEnrollment = courseService.updateStatusByWebhook(
                request.getCourseEnrollmentId(),
                request.getTransactionId(),
                request.getStatus()
        );
        ApiResponse<CourseEnrollment> response = new ApiResponse<>();
        response.setCode(200);
        response.setMessage("Webhook received and processed successfully");
        response.setResult(updatedEnrollment);
        return ResponseEntity.ok(response);
    }
}
