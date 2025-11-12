package org.example.khoahoconl.mapper;

import org.example.khoahoconl.dto.request.CourseCreationRequest;
import org.example.khoahoconl.dto.request.CourseUpdateRequest;
import org.example.khoahoconl.dto.response.CourseResponse;
import org.example.khoahoconl.entity.Course;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring", uses = {UserMapper.class})
public interface CourseMapper {

    @Mapping(target = "courseId", ignore = true)
    @Mapping(target = "createBy", ignore = true)
    Course toEntity(CourseCreationRequest request);

    @Mapping(target = "courseId", source = "courseId")
    @Mapping(target = "courseTitle", source = "courseTitle")
    @Mapping(target = "description", source = "description")
    @Mapping(target = "urlVideo", source = "urlVideo")
    @Mapping(target = "price", source = "price")
    @Mapping(target = "createBy", source = "createBy")
    CourseResponse toDTO(Course course);

    @Mapping(target = "courseId", ignore = true)
    @Mapping(target = "createBy", ignore = true)
    @Mapping(target = "courseTitle", source = "courseTitle")
    void updateCourse(@MappingTarget Course course, CourseUpdateRequest request);
}
