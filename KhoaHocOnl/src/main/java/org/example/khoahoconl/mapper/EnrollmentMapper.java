package org.example.khoahoconl.mapper;

import org.example.khoahoconl.dto.response.EnrollmentResponse;
import org.example.khoahoconl.entity.CourseEnrollment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface EnrollmentMapper {

    @Mapping(target = "userId", source = "user.userId")
    @Mapping(target = "courseTitle", source = "course.courseTitle")
    @Mapping(target = "status", expression = "java(enrollment.getStatus() != null ? enrollment.getStatus().name() : null)")
    EnrollmentResponse toResponse(CourseEnrollment enrollment);
}
