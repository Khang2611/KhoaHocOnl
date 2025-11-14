package org.example.khoahoconl.service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.example.khoahoconl.entity.Course;
import org.example.khoahoconl.entity.CourseEnrollment;
import org.example.khoahoconl.entity.User;
import org.example.khoahoconl.enums.Status;
import org.example.khoahoconl.exception.AppException;
import org.example.khoahoconl.exception.ErrorCode;
import org.example.khoahoconl.mapper.CourseMapper;
import org.example.khoahoconl.repository.CourseEnrollmentRepository;
import org.example.khoahoconl.repository.CourseRepository;
import org.example.khoahoconl.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class EnrollmentService {

    CourseEnrollmentRepository enrollmentRepository;
    CourseRepository courseRepository;
    UserRepository userRepository;
    CourseMapper courseMapper;

    @Transactional
    public Long enrollCourse(Long userId, Long courseId) {
        if (enrollmentRepository.findByUser_UserIdAndCourse_CourseId(userId, courseId).isPresent()) {
            throw new AppException(ErrorCode.ENROLLMENT_EXISTED);
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new AppException(ErrorCode.COURSE_NOT_FOUND));

        CourseEnrollment enrollment = CourseEnrollment.builder()
                .user(user)
                .course(course)
                .status(Status.PENDING)
                .requestDate(LocalDateTime.now())
                .build();

        CourseEnrollment saved = enrollmentRepository.save(enrollment);
        log.info("User {} enrolled in course {}", userId, courseId);
        return saved.getCourseEnrollmentId();
    }

    public String getEnrollmentStatus(Long userId, Long courseId) {
        Optional<CourseEnrollment> enrollment = enrollmentRepository
                .findByUser_UserIdAndCourse_CourseId(userId, courseId);

        return enrollment.map(e -> e.getStatus().name()).orElse("NOT_ENROLLED");
    }

    public boolean isUserEnrolled(Long userId, Long courseId) {
        return enrollmentRepository.findByUser_UserIdAndCourse_CourseId(userId, courseId)
                .map(e -> e.getStatus() == Status.APPROVED)
                .orElse(false);
    }

    public List<org.example.khoahoconl.dto.response.CourseResponse> getEnrolledCourses(Long userId) {
        return enrollmentRepository.findByUser_UserIdAndStatus(userId, Status.APPROVED)
                .stream()
                .map(enrollment -> courseMapper.toDTO(enrollment.getCourse()))
                .collect(Collectors.toList());
    }

    public List<Map<String, Object>> getAllEnrollments(Long userId) {
        return enrollmentRepository.findByUser_UserId(userId)
                .stream()
                .map(enrollment -> Map.of(
                "enrollmentId", enrollment.getCourseEnrollmentId(),
                "status", enrollment.getStatus().name(),
                "requestDate", enrollment.getRequestDate(),
                "course", courseMapper.toDTO(enrollment.getCourse())
        ))
                .collect(Collectors.toList());
    }

    public List<CourseEnrollment> getAllEnrollmentsForAdmin() {
        return enrollmentRepository.findAll();
    }

    @Transactional
    public void approveEnrollment(Long enrollmentId) {
        CourseEnrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new AppException(ErrorCode.ENROLLMENT_NOT_FOUND));
        enrollment.setStatus(Status.APPROVED);
        enrollmentRepository.save(enrollment);
        log.info("Enrollment {} approved", enrollmentId);
    }

    @Transactional
    public void rejectEnrollment(Long enrollmentId) {
        CourseEnrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new AppException(ErrorCode.ENROLLMENT_NOT_FOUND));
        enrollment.setStatus(Status.REJECTED);
        enrollmentRepository.save(enrollment);
        log.info("Enrollment {} rejected", enrollmentId);
    }

    @Transactional
    public void updateEnrollmentStatus(Long enrollmentId, Status newStatus) {
        CourseEnrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new AppException(ErrorCode.ENROLLMENT_NOT_FOUND));
        enrollment.setStatus(newStatus);
        enrollmentRepository.save(enrollment);
        log.info("Enrollment {} status updated to {}", enrollmentId, newStatus);
    }
}
