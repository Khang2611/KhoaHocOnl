package org.example.khoahoconl.dto.response;

public class PaymentResponse {
    private String paymentQRCodeUrl;
    private String message;

    // Constructors
    public PaymentResponse() {}

    public PaymentResponse(String paymentQRCodeUrl, String message) {
        this.paymentQRCodeUrl = paymentQRCodeUrl;
        this.message = message;
    }

    // Builder pattern
    public static PaymentResponseBuilder builder() {
        return new PaymentResponseBuilder();
    }

    public static class PaymentResponseBuilder {
        private String paymentQRCodeUrl;
        private String message;

        public PaymentResponseBuilder paymentQRCodeUrl(String paymentQRCodeUrl) {
            this.paymentQRCodeUrl = paymentQRCodeUrl;
            return this;
        }

        public PaymentResponseBuilder message(String message) {
            this.message = message;
            return this;
        }

        public PaymentResponse build() {
            return new PaymentResponse(paymentQRCodeUrl, message);
        }
    }

    // Getters and Setters
    public String getPaymentQRCodeUrl() { return paymentQRCodeUrl; }
    public void setPaymentQRCodeUrl(String paymentQRCodeUrl) { this.paymentQRCodeUrl = paymentQRCodeUrl; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}