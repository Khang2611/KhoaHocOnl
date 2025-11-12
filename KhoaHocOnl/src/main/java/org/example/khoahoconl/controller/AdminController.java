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
import org.example.khoahoconl.service.AdminService;
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

    AdminService adminService;
    org.example.khoahoconl.service.CourseImportService courseImportService;

    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> getUsers() {
        List<UserResponse> users = adminService.getUsers();
        return ResponseEntity.ok(users);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<ApiResponse<String>> deleteUser(@PathVariable Long id) {
        adminService.deleteUser(id);

        ApiResponse<String> apiResponse = new ApiResponse<>();
        apiResponse.setCode(200);
        apiResponse.setMessage("User with ID " + id + " has been deleted successfully.");

        return ResponseEntity.ok(apiResponse);
    }

    @PostMapping("/courses")
    public ResponseEntity<CourseResponse> createCourse(@RequestBody CourseCreationRequest request) {
        CourseResponse course = adminService.createCourse(request);
        return new ResponseEntity<>(course, HttpStatus.CREATED);
    }

    @PutMapping("/courses/{id}")
    public ResponseEntity<CourseResponse> updateCourse(@PathVariable Long id, @RequestBody CourseUpdateRequest request) {
        CourseResponse course = adminService.updateCourse(id, request);
        return ResponseEntity.ok(course);
    }

    @DeleteMapping("/courses/{id}")
    public ResponseEntity<ApiResponse<String>> deleteCourse(@PathVariable Long id) {
        adminService.deleteCourse(id);

        ApiResponse<String> apiResponse = new ApiResponse<>();
        apiResponse.setCode(200);
        apiResponse.setMessage("Course with ID " + id + " has been deleted successfully.");

        return ResponseEntity.ok(apiResponse);
    }

    @PutMapping("/enrollments/{id}/approve")
    public ResponseEntity<Void> approveEnrollment(@PathVariable Long id) {
        adminService.approveEnrollment(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/enrollments/{id}/reject")
    public ResponseEntity<Void> rejectEnrollment(@PathVariable Long id) {
        adminService.rejectEnrollment(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/enrollments")
    public ResponseEntity<List<CourseEnrollment>> getAllEnrollments() {
        try {
            List<CourseEnrollment> enrollments = adminService.getAllEnrollments();
            return ResponseEntity.ok(enrollments);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
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
