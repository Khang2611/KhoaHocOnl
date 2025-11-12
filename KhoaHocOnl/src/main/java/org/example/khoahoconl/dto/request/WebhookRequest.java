package org.example.khoahoconl.dto.request;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;
import org.example.khoahoconl.enums.Status;
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class WebhookRequest {
    private Long courseEnrollmentId;
    private String transactionId;
    private Status status;
}
