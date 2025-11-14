package org.example.khoahoconl.repository;

import java.util.List;

import org.example.khoahoconl.entity.CourseCurriculum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CourseCurriculumRepository extends JpaRepository<CourseCurriculum, Long> {

    List<CourseCurriculum> findByCourse_CourseIdOrderByDisplayOrder(Long courseId);
}
