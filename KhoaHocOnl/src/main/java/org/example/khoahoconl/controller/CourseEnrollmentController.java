package org.example.khoahoconl.controller;

import lombok.RequiredArgsConstructor;
import org.example.khoahoconl.dto.response.ApiResponse;

import org.example.khoahoconl.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/enrollments")
@RequiredArgsConstructor
public class CourseEnrollmentController {

    private final org.example.khoahoconl.service.CourseManagementFacade courseManagementFacade;
    private final UserService userService;

    @PostMapping("/{courseId}")
    public ResponseEntity<ApiResponse<String>> enrollCourse(@PathVariable Long courseId) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Long userId = userService.getUserIdByUsername(username);
        Long enrollmentId = courseManagementFacade.enrollUserInCourse(userId, courseId);

        ApiResponse<String> response = new ApiResponse<>();
        response.setCode(200);
        response.setMessage("Course enrollment request sent successfully");
        response.setResult("Enrollment ID: " + enrollmentId);
        return ResponseEntity.ok(response);
    }
}
