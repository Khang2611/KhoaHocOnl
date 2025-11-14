package org.example.khoahoconl.controller;

import lombok.RequiredArgsConstructor;
import org.example.khoahoconl.dto.request.WebhookRequest;
import org.example.khoahoconl.dto.response.ApiResponse;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api")
@RequiredArgsConstructor
public class WebhookController {

    private final org.example.khoahoconl.service.PaymentService paymentService;

    @PostMapping("/webhook/payment")
    public ResponseEntity<ApiResponse<String>> handlePaymentWebhook(@RequestBody WebhookRequest request) {
        paymentService.handleWebhookPayment(
                request.getCourseEnrollmentId(),
                request.getTransactionId(),
                request.getStatus()
        );

        ApiResponse<String> response = new ApiResponse<>();
        response.setCode(200);
        response.setMessage("Webhook received and processed successfully");
        response.setResult("Payment status updated");
        return ResponseEntity.ok(response);
    }
}
