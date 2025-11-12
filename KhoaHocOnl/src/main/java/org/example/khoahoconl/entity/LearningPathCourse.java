package org.example.khoahoconl.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "learning_path_courses")
public class LearningPathCourse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @ManyToOne
    @JoinColumn(name = "learning_path_id", nullable = false)
    LearningPath learningPath;

    @ManyToOne
    @JoinColumn(name = "course_id", nullable = false)
    Course course;

    @Column(name = "sequence_order", nullable = false)
    Integer sequenceOrder;

    @Column(name = "is_required")
    @Builder.Default
    Boolean isRequired = true;

    // Manual setters
    public void setId(Long id) {
        this.id = id;
    }

    public void setLearningPath(LearningPath learningPath) {
        this.learningPath = learningPath;
    }

    public void setCourse(Course course) {
        this.course = course;
    }

    public void setSequenceOrder(Integer sequenceOrder) {
        this.sequenceOrder = sequenceOrder;
    }

    public void setIsRequired(Boolean isRequired) {
        this.isRequired = isRequired;
    }
}
