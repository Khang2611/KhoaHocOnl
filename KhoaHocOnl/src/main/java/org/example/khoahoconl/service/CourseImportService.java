package org.example.khoahoconl.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.khoahoconl.dto.request.CourseImportRequest;
import org.example.khoahoconl.entity.*;
import org.example.khoahoconl.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class CourseImportService {

    private final CourseRepository courseRepository;
    private final CourseLearningObjectiveRepository learningObjectiveRepository;
    private final CourseCurriculumRepository curriculumRepository;
    private final CurriculumLessonRepository curriculumLessonRepository;
    private final CoursePrerequisiteRepository prerequisiteRepository;
    private final UserRepository userRepository;

    @Transactional
    public void importCourses(List<CourseImportRequest> requests) {
        // Get default instructor
        User instructor = userRepository.findByUserName("admin")
                .orElseThrow(() -> new RuntimeException("Admin user not found"));

        for (CourseImportRequest request : requests) {
            importSingleCourse(request, instructor);
        }
    }

    private void importSingleCourse(CourseImportRequest request, User instructor) {
        // Create or update course
        Course course = courseRepository.findById(request.getCourseId())
                .orElse(new Course());

        course.setCourseId(request.getCourseId());
        course.setCourseTitle(request.getCourseTitle());
        course.setDescription(request.getDescription());
        course.setUrlVideo(request.getUrlVideo());
        course.setPrice(request.getPrice());
        course.setCreateBy(instructor);

        course = courseRepository.save(course);

        // Delete existing related data
        learningObjectiveRepository.deleteAll(
                learningObjectiveRepository.findByCourse_CourseIdOrderByDisplayOrder(course.getCourseId())
        );
        curriculumRepository.deleteAll(
                curriculumRepository.findByCourse_CourseIdOrderByDisplayOrder(course.getCourseId())
        );
        prerequisiteRepository.deleteAll(
                prerequisiteRepository.findByCourse_CourseId(course.getCourseId())
        );

        // Import learning objectives
        if (request.getLearningObjectives() != null) {
            int order = 1;
            for (String objective : request.getLearningObjectives()) {
                CourseLearningObjective obj = new CourseLearningObjective();
                obj.setCourse(course);
                obj.setObjective(objective);
                obj.setDisplayOrder(order++);
                learningObjectiveRepository.save(obj);
            }
        }

        // Import curriculum with lessons
        if (request.getCurriculum() != null) {
            int order = 1;
            for (CourseImportRequest.CurriculumItemRequest item : request.getCurriculum()) {
                CourseCurriculum curriculum = new CourseCurriculum();
                curriculum.setCourse(course);
                curriculum.setChapterTitle(item.getChapterTitle());
                curriculum.setChapterDescription(item.getChapterDescription());
                curriculum.setEstimatedDurationMinutes(item.getEstimatedDurationMinutes());
                curriculum.setDisplayOrder(item.getDisplayOrder() != null ? item.getDisplayOrder() : order++);
                curriculum = curriculumRepository.save(curriculum);

                // Import lessons for this curriculum
                if (item.getLessons() != null && !item.getLessons().isEmpty()) {
                    int lessonOrder = 1;
                    for (CourseImportRequest.LessonRequest lessonReq : item.getLessons()) {
                        CurriculumLesson lesson = new CurriculumLesson();
                        lesson.setCurriculum(curriculum);
                        lesson.setLessonTitle(lessonReq.getLessonTitle());
                        lesson.setLessonDescription(lessonReq.getLessonDescription());
                        lesson.setVideoUrl(lessonReq.getVideoUrl());
                        lesson.setEstimatedDurationMinutes(lessonReq.getEstimatedDurationMinutes());
                        lesson.setDisplayOrder(lessonReq.getDisplayOrder() != null ? lessonReq.getDisplayOrder() : lessonOrder++);
                        lesson.setIsFreePreview(lessonReq.getIsFreePreview() != null ? lessonReq.getIsFreePreview() : false);
                        curriculumLessonRepository.save(lesson);
                    }
                }
            }
        }

        // Import prerequisites (will be processed in second pass)
        // This is handled separately after all courses are created
    }

    @Transactional
    public void importPrerequisites(List<CourseImportRequest> requests) {
        for (CourseImportRequest request : requests) {
            if (request.getPrerequisiteIds() != null && !request.getPrerequisiteIds().isEmpty()) {
                Course course = courseRepository.findById(request.getCourseId()).orElse(null);
                if (course == null) {
                    log.warn("Course not found for prerequisites: {}", request.getCourseId());
                    continue;
                }

                for (Long prereqId : request.getPrerequisiteIds()) {
                    Course prereqCourse = courseRepository.findById(prereqId).orElse(null);
                    if (prereqCourse == null) {
                        log.warn("Prerequisite course not found: {} for course: {}", prereqId, request.getCourseId());
                        continue;
                    }

                    // Check if prerequisite already exists
                    boolean exists = prerequisiteRepository.findByCourse_CourseId(course.getCourseId())
                            .stream()
                            .anyMatch(p -> p.getPrerequisiteCourse().getCourseId().equals(prereqId));

                    if (!exists) {
                        CoursePrerequisite prerequisite = new CoursePrerequisite();
                        prerequisite.setCourse(course);
                        prerequisite.setPrerequisiteCourse(prereqCourse);
                        prerequisite.setType(CoursePrerequisite.PrerequisiteType.REQUIRED);
                        prerequisiteRepository.save(prerequisite);
                    }
                }
            }
        }
    }
}
