package org.example.khoahoconl.service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.example.khoahoconl.dto.request.CourseCreationRequest;
import org.example.khoahoconl.dto.request.CourseUpdateRequest;
import org.example.khoahoconl.dto.response.CourseResponse;
import org.example.khoahoconl.dto.response.UserResponse;
import org.example.khoahoconl.entity.Course;
import org.example.khoahoconl.entity.CourseEnrollment;
import org.example.khoahoconl.exception.AppException;
import org.example.khoahoconl.exception.ErrorCode;
import org.example.khoahoconl.mapper.CourseMapper;
import org.example.khoahoconl.mapper.UserMapper;
import org.example.khoahoconl.repository.CourseRepository;
import org.example.khoahoconl.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Facade for admin operations Consolidates admin-related business logic
 */
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class AdminManagementFacade {

    CourseRepository courseRepository;
    UserRepository userRepository;
    CourseMapper courseMapper;
    UserMapper userMapper;
    EnrollmentService enrollmentService;

    // ========== User Management ==========
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(userMapper::toUserResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteUser(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new AppException(ErrorCode.USER_NOT_FOUND);
        }
        log.info("Admin deleting user {}", userId);
        userRepository.deleteById(userId);
    }

    // ========== Course Management ==========
    @Transactional
    public CourseResponse createCourse(CourseCreationRequest request) {
        validateCourseTitle(request.getCourseTitle());

        Course course = courseMapper.toEntity(request);
        Course savedCourse = courseRepository.save(course);

        log.info("Admin created course {}", savedCourse.getCourseId());
        return courseMapper.toDTO(savedCourse);
    }

    @Transactional
    public CourseResponse updateCourse(Long courseId, CourseUpdateRequest request) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new AppException(ErrorCode.COURSE_NOT_FOUND));

        courseMapper.updateCourse(course, request);
        Course updatedCourse = courseRepository.save(course);

        log.info("Admin updated course {}", courseId);
        return courseMapper.toDTO(updatedCourse);
    }

    @Transactional
    public void deleteCourse(Long courseId) {
        if (!courseRepository.existsById(courseId)) {
            throw new AppException(ErrorCode.COURSE_NOT_FOUND);
        }
        log.info("Admin deleting course {}", courseId);
        courseRepository.deleteById(courseId);
    }

    // ========== Enrollment Management ==========
    public List<CourseEnrollment> getAllEnrollments() {
        return enrollmentService.getAllEnrollmentsForAdmin();
    }

    @Transactional
    public void approveEnrollment(Long enrollmentId) {
        log.info("Admin approving enrollment {}", enrollmentId);
        enrollmentService.approveEnrollment(enrollmentId);
    }

    @Transactional
    public void rejectEnrollment(Long enrollmentId) {
        log.info("Admin rejecting enrollment {}", enrollmentId);
        enrollmentService.rejectEnrollment(enrollmentId);
    }

    @Transactional
    public void batchApproveEnrollments(List<Long> enrollmentIds) {
        log.info("Admin batch approving {} enrollments", enrollmentIds.size());
        enrollmentIds.forEach(enrollmentService::approveEnrollment);
    }

    @Transactional
    public void batchRejectEnrollments(List<Long> enrollmentIds) {
        log.info("Admin batch rejecting {} enrollments", enrollmentIds.size());
        enrollmentIds.forEach(enrollmentService::rejectEnrollment);
    }

    // ========== Validation ==========
    private void validateCourseTitle(String title) {
        if (title == null || title.trim().isEmpty()) {
            throw new AppException(ErrorCode.INVALID_COURSE_TITLE);
        }
    }
}
