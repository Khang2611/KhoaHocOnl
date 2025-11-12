package org.example.khoahoconl.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
public enum ErrorCode {
    USER_EXISTED(1000, "User existed", HttpStatus.BAD_REQUEST),
    USER_NOT_FOUND(1001, "User not found", HttpStatus.NOT_FOUND),
    COURSE_NOT_FOUND(1002, "Course not found", HttpStatus.NOT_FOUND),
    ENROLLMENT_EXISTED(1003, "Enrollment existed", HttpStatus.BAD_REQUEST),
    INVALID_COURSE_TITLE(1004, "Invalid course title", HttpStatus.BAD_REQUEST),
    ENROLLMENT_NOT_FOUND(1005, "Enrollment not found", HttpStatus.NOT_FOUND),
    INVALID_CREDENTIALS(1006, "Invalid credentials", HttpStatus.UNAUTHORIZED),
    UNCATEGORIZED_EXCEPTION(1007, "Uncategorized exception", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_PASSWORD(1008 , "password must be at least 8 characters", HttpStatus.BAD_REQUEST),
    USERNAME_INVALID(1009 , "userName must be at least 3 characters", HttpStatus.BAD_REQUEST),
    ALREADY_PAID(1010 , "Already paid", HttpStatus.BAD_REQUEST);

    private final int code;
    private final String message;
    private final HttpStatusCode statusCode;

    ErrorCode(int code, String message, HttpStatusCode statusCode) {
        this.code = code;
        this.message = message;
        this.statusCode = statusCode;
    }
}