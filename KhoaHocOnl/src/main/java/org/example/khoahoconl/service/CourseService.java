package org.example.khoahoconl.service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.khoahoconl.dto.request.CourseUpdateRequest;
import org.example.khoahoconl.dto.response.CourseResponse;
import org.example.khoahoconl.dto.response.PaymentResponse;
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
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CourseService {

    CourseRepository courseRepository;
    CourseEnrollmentRepository courseEnrollmentRepository;
    CourseMapper courseMapper;
    UserRepository userRepository;
    org.example.khoahoconl.repository.CourseLearningObjectiveRepository learningObjectiveRepository;
    org.example.khoahoconl.repository.CourseCurriculumRepository curriculumRepository;
    org.example.khoahoconl.repository.CurriculumLessonRepository curriculumLessonRepository;
    org.example.khoahoconl.repository.CoursePrerequisiteRepository prerequisiteRepository;
    org.example.khoahoconl.mapper.UserMapper userMapper;

    public List<CourseResponse> getAllCourses() {
        return courseRepository.findAll().stream()
                .map(courseMapper::toDTO).toList();
    }

    public CourseResponse getCourse(long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.COURSE_NOT_FOUND));

        CourseResponse response = courseMapper.toDTO(course);

        // Check if user is authenticated
        try {
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            if (!"anonymousUser".equals(username)) {
                User user = userRepository.findByUserName(username)
                        .orElse(null);

                if (user != null) {
                    Optional<CourseEnrollment> enrollmentOpt = courseEnrollmentRepository
                            .findByUser_UserIdAndCourse_CourseId(user.getUserId(), course.getCourseId());

                    // If user is enrolled and approved, show video
                    if (enrollmentOpt.isPresent() && enrollmentOpt.get().getStatus() == Status.APPROVED) {
                        return response; // Keep original urlVideo
                    }
                }
            }
        } catch (Exception e) {
            // If authentication fails, treat as anonymous user
        }

        // For anonymous users or non-enrolled users, hide video URL
        response.setUrlVideo(null);
        return response;
    }

    public Long enrollCourse(Long userId, Long courseId) {
        if (courseEnrollmentRepository.findByUser_UserIdAndCourse_CourseId(userId, courseId).isPresent()) {
            throw new AppException(ErrorCode.ENROLLMENT_EXISTED);
        }
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new AppException(ErrorCode.COURSE_NOT_FOUND));
        CourseEnrollment enrollment = new CourseEnrollment();
        enrollment.setUser(user);
        enrollment.setCourse(course);
        enrollment.setStatus(Status.PENDING);
        enrollment.setRequestDate(LocalDateTime.now());
        CourseEnrollment saved = courseEnrollmentRepository.save(enrollment);
        return saved.getCourseEnrollmentId();
    }

    public CourseResponse updateCourse(Long courseId, CourseUpdateRequest request) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new AppException(ErrorCode.COURSE_NOT_FOUND));
        courseMapper.updateCourse(course, request);
        return courseMapper.toDTO(courseRepository.save(course));
    }

    public PaymentResponse processPayment(long courseId, long userId) {
        CourseEnrollment enrollment = courseEnrollmentRepository.findByUser_UserIdAndCourse_CourseId(userId, courseId)
                .orElseThrow(() -> new AppException(ErrorCode.ENROLLMENT_NOT_FOUND));
        if (enrollment.getStatus() == Status.APPROVED) {
            throw new AppException(ErrorCode.ALREADY_PAID);
        }
        String transactionId = "TXN-" + enrollment.getCourseEnrollmentId() + "-" + System.currentTimeMillis();
        String paymentQRCodeUrl = "https://placehold.co/400x400/E9E9E9/000000?text=Scan+to+Pay\nID: " + transactionId;
        return PaymentResponse.builder()
                .paymentQRCodeUrl(paymentQRCodeUrl)
                .message("Vui lòng quét mã QR để thanh toán. Giao dịch đang chờ xác nhận.")
                .build();
    }

    public CourseEnrollment updateStatusByWebhook(Long enrollmentId, String transactionId, Status newStatus) {
        CourseEnrollment enrollment = courseEnrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new AppException(ErrorCode.ENROLLMENT_NOT_FOUND));
        enrollment.setStatus(newStatus);
        return courseEnrollmentRepository.save(enrollment);
    }

    public String simulatePaymentSuccess(Long enrollmentId) {
        CourseEnrollment enrollment = courseEnrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new AppException(ErrorCode.ENROLLMENT_NOT_FOUND));

        if (enrollment.getStatus() == Status.APPROVED) {
            return "Payment already completed for enrollment ID: " + enrollmentId;
        }

        // Simulate payment success
        enrollment.setStatus(Status.APPROVED);
        courseEnrollmentRepository.save(enrollment);

        return "Payment simulation successful! Enrollment ID: " + enrollmentId + " is now APPROVED";
    }

    public String getEnrollmentStatus(Long userId, Long courseId) {
        Optional<CourseEnrollment> enrollmentOpt = courseEnrollmentRepository
                .findByUser_UserIdAndCourse_CourseId(userId, courseId);

        if (enrollmentOpt.isEmpty()) {
            return "NOT_ENROLLED";
        }

        CourseEnrollment enrollment = enrollmentOpt.get();
        return enrollment.getStatus().name(); // PENDING, APPROVED, REJECTED
    }

    // New method to get enhanced course details
    public org.example.khoahoconl.dto.response.EnhancedCourseResponse getEnhancedCourseDetails(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new AppException(ErrorCode.COURSE_NOT_FOUND));

        // Get learning objectives
        List<String> objectives = learningObjectiveRepository
                .findByCourse_CourseIdOrderByDisplayOrder(courseId)
                .stream()
                .map(org.example.khoahoconl.entity.CourseLearningObjective::getObjective)
                .toList();

        // Get curriculum with lessons
        List<org.example.khoahoconl.dto.response.EnhancedCourseResponse.CurriculumItem> curriculum
                = curriculumRepository
                        .findByCourse_CourseIdOrderByDisplayOrder(courseId)
                        .stream()
                        .map(c -> {
                            // Get lessons for this curriculum
                            List<org.example.khoahoconl.dto.response.EnhancedCourseResponse.LessonInfo> lessons
                                    = curriculumLessonRepository
                                            .findByCurriculumIdOrderByDisplayOrder(c.getId())
                                            .stream()
                                            .map(l -> org.example.khoahoconl.dto.response.EnhancedCourseResponse.LessonInfo.builder()
                                            .lessonId(l.getId())
                                            .lessonTitle(l.getLessonTitle())
                                            .lessonDescription(l.getLessonDescription())
                                            .videoUrl(l.getVideoUrl())
                                            .displayOrder(l.getDisplayOrder())
                                            .estimatedDurationMinutes(l.getEstimatedDurationMinutes())
                                            .isFreePreview(l.getIsFreePreview())
                                            .build())
                                            .toList();

                            return org.example.khoahoconl.dto.response.EnhancedCourseResponse.CurriculumItem.builder()
                                    .chapterTitle(c.getChapterTitle())
                                    .chapterDescription(c.getChapterDescription())
                                    .estimatedDurationMinutes(c.getEstimatedDurationMinutes())
                                    .displayOrder(c.getDisplayOrder())
                                    .lessons(lessons)
                                    .build();
                        })
                        .toList();

        // Get prerequisites
        List<org.example.khoahoconl.dto.response.EnhancedCourseResponse.PrerequisiteInfo> prerequisites
                = prerequisiteRepository
                        .findByCourse_CourseId(courseId)
                        .stream()
                        .map(p -> org.example.khoahoconl.dto.response.EnhancedCourseResponse.PrerequisiteInfo.builder()
                        .courseId(p.getPrerequisiteCourse().getCourseId())
                        .courseTitle(p.getPrerequisiteCourse().getCourseTitle())
                        .type(p.getType().name())
                        .build())
                        .toList();

        // Calculate total duration
        int totalMinutes = curriculum.stream()
                .mapToInt(c -> c.getEstimatedDurationMinutes() != null ? c.getEstimatedDurationMinutes() : 0)
                .sum();
        int totalHours = (int) Math.ceil(totalMinutes / 60.0);

        return org.example.khoahoconl.dto.response.EnhancedCourseResponse.builder()
                .courseId(course.getCourseId())
                .courseTitle(course.getCourseTitle())
                .description(course.getDescription())
                .urlVideo(course.getUrlVideo())
                .price(course.getPrice())
                .createBy(userMapper.toUserResponse(course.getCreateBy()))
                .learningObjectives(objectives)
                .curriculum(curriculum)
                .prerequisites(prerequisites)
                .estimatedDurationHours(totalHours)
                .build();
    }
}
