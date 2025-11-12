package org.example.khoahoconl.controller;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.khoahoconl.dto.request.UserUpdateRequest;
import org.example.khoahoconl.dto.response.ApiResponse;
import org.example.khoahoconl.dto.response.UserResponse;
import org.example.khoahoconl.service.UserService;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserController {

    final UserService userService;

    @GetMapping("myinfo")
    UserResponse getMyInfo() {
        var context = SecurityContextHolder.getContext();
        String name = context.getAuthentication().getName();
        return userService.getMyInfo(name);
    }

    @PutMapping("/update")
    public ApiResponse<UserResponse> updateUser(@RequestBody UserUpdateRequest request) {
        ApiResponse<UserResponse> apiResponse = new ApiResponse<>();
        apiResponse.setMessage("User info updated successfully.");
        apiResponse.setCode(200);
        apiResponse.setResult(userService.updateUser(request));
        return apiResponse;
    }

    @GetMapping("/enrolled-courses")
    public ApiResponse<java.util.List<org.example.khoahoconl.dto.response.CourseResponse>> getEnrolledCourses() {
        var context = SecurityContextHolder.getContext();
        String userName = context.getAuthentication().getName();
        Long userId = userService.getUserIdByUsername(userName);

        ApiResponse<java.util.List<org.example.khoahoconl.dto.response.CourseResponse>> apiResponse = new ApiResponse<>();
        apiResponse.setMessage("Enrolled courses retrieved successfully.");
        apiResponse.setCode(200);
        apiResponse.setResult(userService.getEnrolledCourses(userId));
        return apiResponse;
    }

    @GetMapping("/all-enrollments")
    public ApiResponse<java.util.List<java.util.Map<String, Object>>> getAllEnrollments() {
        var context = SecurityContextHolder.getContext();
        String userName = context.getAuthentication().getName();
        Long userId = userService.getUserIdByUsername(userName);

        ApiResponse<java.util.List<java.util.Map<String, Object>>> apiResponse = new ApiResponse<>();
        apiResponse.setMessage("All enrollments retrieved successfully.");
        apiResponse.setCode(200);
        apiResponse.setResult(userService.getAllEnrollments(userId));
        return apiResponse;
    }

}
