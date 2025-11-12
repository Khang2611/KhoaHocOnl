package org.example.khoahoconl.repository;

import org.example.khoahoconl.entity.CoursePrerequisite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CoursePrerequisiteRepository extends JpaRepository<CoursePrerequisite, Long> {

    List<CoursePrerequisite> findByCourse_CourseId(Long courseId);

    List<CoursePrerequisite> findByPrerequisiteCourse_CourseId(Long prerequisiteCourseId);
}
