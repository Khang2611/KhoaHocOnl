package org.example.khoahoconl.repository;

import org.example.khoahoconl.entity.CourseLearningObjective;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseLearningObjectiveRepository extends JpaRepository<CourseLearningObjective, Long> {

    List<CourseLearningObjective> findByCourse_CourseIdOrderByDisplayOrder(Long courseId);
}
