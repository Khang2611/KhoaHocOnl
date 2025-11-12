package org.example.khoahoconl.repository;

import org.example.khoahoconl.entity.LearningPathCourse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LearningPathCourseRepository extends JpaRepository<LearningPathCourse, Long> {

    List<LearningPathCourse> findByLearningPath_PathIdOrderBySequenceOrder(Long pathId);

    List<LearningPathCourse> findByCourse_CourseId(Long courseId);
}
