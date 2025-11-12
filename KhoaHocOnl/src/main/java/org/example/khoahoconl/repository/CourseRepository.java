package org.example.khoahoconl.repository;

import java.util.Optional;

import org.example.khoahoconl.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {

    Optional<Course> findByCourseTitle(String courseTitle);
}
