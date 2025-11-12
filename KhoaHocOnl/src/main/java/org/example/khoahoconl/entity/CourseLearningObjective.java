package org.example.khoahoconl.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
@Table(name = "course_learning_objectives")
public class CourseLearningObjective {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @ManyToOne
    @JoinColumn(name = "course_id", nullable = false)
    Course course;

    @Column(nullable = false, length = 500)
    String objective;

    @Column(name = "display_order")
    Integer displayOrder;

    // Manual setters
    public void setId(Long id) {
        this.id = id;
    }

    public void setCourse(Course course) {
        this.course = course;
    }

    public void setObjective(String objective) {
        this.objective = objective;
    }

    public void setDisplayOrder(Integer displayOrder) {
        this.displayOrder = displayOrder;
    }
}
