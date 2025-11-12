package org.example.khoahoconl.service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.khoahoconl.dto.request.CourseCreationRequest;
import org.example.khoahoconl.dto.request.CourseUpdateRequest;
import org.example.khoahoconl.dto.response.CourseResponse;
import org.example.khoahoconl.dto.response.UserResponse;
import org.example.khoahoconl.entity.Course;
import org.example.khoahoconl.entity.CourseEnrollment;
import org.example.khoahoconl.enums.Status;
import org.example.khoahoconl.exception.AppException;
import org.example.khoahoconl.exception.ErrorCode;
import org.example.khoahoconl.mapper.CourseMapper;
import org.example.khoahoconl.mapper.UserMapper;
import org.example.khoahoconl.repository.CourseEnrollmentRepository;
import org.example.khoahoconl.repository.CourseRepository;
import org.example.khoahoconl.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AdminService {

    CourseRepository courseRepository;
    CourseEnrollmentRepository courseEnrollmentRepository;
    CourseMapper courseMapper;
    UserMapper userMapper;
    UserRepository userRepository;

    public List<UserResponse> getUsers() {
        return userRepository.findAll().stream()
                .map(userMapper::toUserResponse).toList();
    }

    public void deleteUser(Long userId) {
        userRepository.deleteById(userId);
    }

    public CourseResponse createCourse(CourseCreationRequest request) {
        if (request.getCourseTitle() == null || request.getCourseTitle().trim().isEmpty()) {
            throw new AppException(ErrorCode.INVALID_COURSE_TITLE);
        }
        Course course = courseMapper.toEntity(request);
        Course saveCourse = courseRepository.save(course);
        return courseMapper.toDTO(saveCourse);
    }

    public void deleteCourse(Long courseId) {
        if (!courseRepository.existsById(courseId)) {
            throw new AppException(ErrorCode.COURSE_NOT_FOUND);
        }
        courseRepository.deleteById(courseId);
    }

    public CourseResponse updateCourse(Long courseId, CourseUpdateRequest request) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new AppException(ErrorCode.COURSE_NOT_FOUND));
        courseMapper.updateCourse(course, request);
        Course updatedCourse = courseRepository.save(course);
        return courseMapper.toDTO(updatedCourse);
    }

    public void approveEnrollment(Long courseEnrollmentID) {
        CourseEnrollment courseEnrollment = courseEnrollmentRepository.findById(courseEnrollmentID)
                .orElseThrow(() -> new AppException(ErrorCode.ENROLLMENT_NOT_FOUND));
        courseEnrollment.setStatus(Status.APPROVED);
        courseEnrollmentRepository.save(courseEnrollment);
    }

    public void rejectEnrollment(Long courseEnrollmentID) {
        CourseEnrollment courseEnrollment = courseEnrollmentRepository.findById(courseEnrollmentID)
                .orElseThrow(() -> new AppException(ErrorCode.ENROLLMENT_NOT_FOUND));
        courseEnrollment.setStatus(Status.REJECTED);
        courseEnrollmentRepository.save(courseEnrollment);
    }

    public List<CourseEnrollment> getAllEnrollments() {
        return courseEnrollmentRepository.findAll();
    }
}
