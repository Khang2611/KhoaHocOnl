package org.example.khoahoconl.repository;

import org.example.khoahoconl.entity.CourseEnrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CourseEnrollmentRepository extends JpaRepository<CourseEnrollment, Long> {

    Optional<CourseEnrollment> findByUser_UserIdAndCourse_CourseId(Long userId, Long courseId);

    java.util.List<CourseEnrollment> findByUser_UserIdAndStatus(Long userId, org.example.khoahoconl.enums.Status status);

    java.util.List<CourseEnrollment> findByUser_UserId(Long userId);

}
