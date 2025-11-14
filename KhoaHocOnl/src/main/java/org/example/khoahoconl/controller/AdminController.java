package org.example.khoahoconl.controller;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.khoahoconl.dto.request.CourseCreationRequest;
import org.example.khoahoconl.dto.request.CourseUpdateRequest;
import org.example.khoahoconl.dto.response.ApiResponse;
import org.example.khoahoconl.dto.response.CourseResponse;
import org.example.khoahoconl.dto.response.UserResponse;
import org.example.khoahoconl.entity.CourseEnrollment;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AdminController {

    org.example.khoahoconl.service.AdminManagementFacade adminFacade;
    org.example.khoahoconl.service.CourseImportService courseImportService;

    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> getUsers() {
        return ResponseEntity.ok(adminFacade.getAllUsers());
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<ApiResponse<String>> deleteUser(@PathVariable Long id) {
        adminFacade.deleteUser(id);

        ApiResponse<String> apiResponse = new ApiResponse<>();
        apiResponse.setCode(200);
        apiResponse.setMessage("User with ID " + id + " has been deleted successfully.");
        return ResponseEntity.ok(apiResponse);
    }

    @PostMapping("/courses")
    public ResponseEntity<CourseResponse> createCourse(@RequestBody CourseCreationRequest request) {
        CourseResponse course = adminFacade.createCourse(request);
        return new ResponseEntity<>(course, HttpStatus.CREATED);
    }

    @PutMapping("/courses/{id}")
    public ResponseEntity<CourseResponse> updateCourse(@PathVariable Long id, @RequestBody CourseUpdateRequest request) {
        return ResponseEntity.ok(adminFacade.updateCourse(id, request));
    }

    @DeleteMapping("/courses/{id}")
    public ResponseEntity<ApiResponse<String>> deleteCourse(@PathVariable Long id) {
        adminFacade.deleteCourse(id);

        ApiResponse<String> apiResponse = new ApiResponse<>();
        apiResponse.setCode(200);
        apiResponse.setMessage("Course with ID " + id + " has been deleted successfully.");
        return ResponseEntity.ok(apiResponse);
    }

    @PutMapping("/enrollments/{id}/approve")
    public ResponseEntity<ApiResponse<String>> approveEnrollment(@PathVariable Long id) {
        adminFacade.approveEnrollment(id);

        ApiResponse<String> apiResponse = new ApiResponse<>();
        apiResponse.setCode(200);
        apiResponse.setMessage("Enrollment approved successfully");
        return ResponseEntity.ok(apiResponse);
    }

    @PutMapping("/enrollments/{id}/reject")
    public ResponseEntity<ApiResponse<String>> rejectEnrollment(@PathVariable Long id) {
        adminFacade.rejectEnrollment(id);

        ApiResponse<String> apiResponse = new ApiResponse<>();
        apiResponse.setCode(200);
        apiResponse.setMessage("Enrollment rejected successfully");
        return ResponseEntity.ok(apiResponse);
    }

    @PostMapping("/enrollments/batch-approve")
    public ResponseEntity<ApiResponse<String>> batchApproveEnrollments(@RequestBody List<Long> enrollmentIds) {
        adminFacade.batchApproveEnrollments(enrollmentIds);

        ApiResponse<String> apiResponse = new ApiResponse<>();
        apiResponse.setCode(200);
        apiResponse.setMessage("Batch approval completed for " + enrollmentIds.size() + " enrollments");
        return ResponseEntity.ok(apiResponse);
    }

    @PostMapping("/enrollments/batch-reject")
    public ResponseEntity<ApiResponse<String>> batchRejectEnrollments(@RequestBody List<Long> enrollmentIds) {
        adminFacade.batchRejectEnrollments(enrollmentIds);

        ApiResponse<String> apiResponse = new ApiResponse<>();
        apiResponse.setCode(200);
        apiResponse.setMessage("Batch rejection completed for " + enrollmentIds.size() + " enrollments");
        return ResponseEntity.ok(apiResponse);
    }

    @GetMapping("/enrollments")
    public ResponseEntity<List<CourseEnrollment>> getAllEnrollments() {
        return ResponseEntity.ok(adminFacade.getAllEnrollments());
    }

    // Import courses from JSON
    @PostMapping("/courses/import")
    public ResponseEntity<ApiResponse<String>> importCourses(
            @RequestBody List<org.example.khoahoconl.dto.request.CourseImportRequest> requests) {
        try {
            courseImportService.importCourses(requests);
            courseImportService.importPrerequisites(requests);

            ApiResponse<String> apiResponse = new ApiResponse<>();
            apiResponse.setCode(200);
            apiResponse.setMessage("Successfully imported " + requests.size() + " courses");
            apiResponse.setResult("Import completed");

            return ResponseEntity.ok(apiResponse);
        } catch (Exception e) {
            ApiResponse<String> apiResponse = new ApiResponse<>();
            apiResponse.setCode(500);
            apiResponse.setMessage("Failed to import courses: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(apiResponse);
        }
    }
}
