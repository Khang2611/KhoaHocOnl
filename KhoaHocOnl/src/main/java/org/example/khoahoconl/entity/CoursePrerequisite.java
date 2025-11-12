package org.example.khoahoconl.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "course_prerequisites")
public class CoursePrerequisite {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @ManyToOne
    @JoinColumn(name = "course_id", nullable = false)
    Course course;

    @ManyToOne
    @JoinColumn(name = "prerequisite_course_id", nullable = false)
    Course prerequisiteCourse;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    PrerequisiteType type; // REQUIRED or RECOMMENDED

    public enum PrerequisiteType {
        REQUIRED,
        RECOMMENDED
    }

    // Manual setters
    public void setId(Long id) {
        this.id = id;
    }

    public void setCourse(Course course) {
        this.course = course;
    }

    public void setPrerequisiteCourse(Course prerequisiteCourse) {
        this.prerequisiteCourse = prerequisiteCourse;
    }

    public void setType(PrerequisiteType type) {
        this.type = type;
    }
}
