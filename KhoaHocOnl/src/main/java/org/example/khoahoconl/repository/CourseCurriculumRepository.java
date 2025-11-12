package org.example.khoahoconl.repository;

import org.example.khoahoconl.entity.CourseCurriculum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseCurriculumRepository extends JpaRepository<CourseCurriculum, Long> {

    List<CourseCurriculum> findByCourse_CourseIdOrderByDisplayOrder(Long courseId);
}
