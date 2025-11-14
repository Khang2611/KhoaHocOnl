package org.example.khoahoconl.service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.khoahoconl.dto.request.CourseUpdateRequest;
import org.example.khoahoconl.dto.response.CourseResponse;
import org.example.khoahoconl.dto.response.EnhancedCourseResponse;
import org.example.khoahoconl.entity.Course;
import org.example.khoahoconl.entity.User;
import org.example.khoahoconl.exception.AppException;
import org.example.khoahoconl.exception.ErrorCode;
import org.example.khoahoconl.mapper.CourseMapper;
import org.example.khoahoconl.mapper.UserMapper;
import org.example.khoahoconl.repository.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CourseService {

    CourseRepository courseRepository;
    CourseLearningObjectiveRepository learningObjectiveRepository;
    CourseCurriculumRepository curriculumRepository;
    CurriculumLessonRepository curriculumLessonRepository;
    CoursePrerequisiteRepository prerequisiteRepository;
    UserRepository userRepository;
    CourseMapper courseMapper;
    UserMapper userMapper;
    EnrollmentService enrollmentService;

    public List<CourseResponse> getAllCourses() {
        return courseRepository.findAll().stream()
                .map(courseMapper::toDTO)
                .collect(Collectors.toList());
    }

    public CourseResponse getCourse(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.COURSE_NOT_FOUND));

        CourseResponse response = courseMapper.toDTO(course);

        // Hide video URL if user is not enrolled
        if (!isUserEnrolledInCourse(id)) {
            response.setUrlVideo(null);
        }

        return response;
    }

    public CourseResponse updateCourse(Long courseId, CourseUpdateRequest request) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new AppException(ErrorCode.COURSE_NOT_FOUND));
        courseMapper.updateCourse(course, request);
        return courseMapper.toDTO(courseRepository.save(course));
    }

    public EnhancedCourseResponse getEnhancedCourseDetails(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new AppException(ErrorCode.COURSE_NOT_FOUND));

        List<String> objectives = learningObjectiveRepository
                .findByCourse_CourseIdOrderByDisplayOrder(courseId)
                .stream()
                .map(obj -> obj.getObjective())
                .collect(Collectors.toList());

        List<EnhancedCourseResponse.CurriculumItem> curriculum = curriculumRepository
                .findByCourse_CourseIdOrderByDisplayOrder(courseId)
                .stream()
                .map(c -> {
                    List<EnhancedCourseResponse.LessonInfo> lessons = curriculumLessonRepository
                            .findByCurriculumIdOrderByDisplayOrder(c.getId())
                            .stream()
                            .map(l -> EnhancedCourseResponse.LessonInfo.builder()
                            .lessonId(l.getId())
                            .lessonTitle(l.getLessonTitle())
                            .lessonDescription(l.getLessonDescription())
                            .videoUrl(l.getVideoUrl())
                            .displayOrder(l.getDisplayOrder())
                            .estimatedDurationMinutes(l.getEstimatedDurationMinutes())
                            .isFreePreview(l.getIsFreePreview())
                            .build())
                            .collect(Collectors.toList());

                    return EnhancedCourseResponse.CurriculumItem.builder()
                            .chapterTitle(c.getChapterTitle())
                            .chapterDescription(c.getChapterDescription())
                            .estimatedDurationMinutes(c.getEstimatedDurationMinutes())
                            .displayOrder(c.getDisplayOrder())
                            .lessons(lessons)
                            .build();
                })
                .collect(Collectors.toList());

        List<EnhancedCourseResponse.PrerequisiteInfo> prerequisites = prerequisiteRepository
                .findByCourse_CourseId(courseId)
                .stream()
                .map(p -> EnhancedCourseResponse.PrerequisiteInfo.builder()
                .courseId(p.getPrerequisiteCourse().getCourseId())
                .courseTitle(p.getPrerequisiteCourse().getCourseTitle())
                .type(p.getType().name())
                .build())
                .collect(Collectors.toList());

        int totalMinutes = curriculum.stream()
                .mapToInt(c -> c.getEstimatedDurationMinutes() != null ? c.getEstimatedDurationMinutes() : 0)
                .sum();
        int totalHours = (int) Math.ceil(totalMinutes / 60.0);

        return EnhancedCourseResponse.builder()
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

    private boolean isUserEnrolledInCourse(Long courseId) {
        try {
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            if ("anonymousUser".equals(username)) {
                return false;
            }

            User user = userRepository.findByUserName(username).orElse(null);
            if (user == null) {
                return false;
            }

            return enrollmentService.isUserEnrolled(user.getUserId(), courseId);
        } catch (Exception e) {
            return false;
        }
    }
}
