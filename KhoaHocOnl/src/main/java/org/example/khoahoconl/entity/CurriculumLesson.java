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
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "curriculum_lesson")
public class CurriculumLesson {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @ManyToOne
    @JoinColumn(name = "curriculum_id", nullable = false)
    CourseCurriculum curriculum;

    @Column(nullable = false, length = 200)
    String lessonTitle;

    @Column(length = 1000)
    String lessonDescription;

    @Column(name = "video_url", length = 500)
    String videoUrl;

    @Column(name = "display_order")
    Integer displayOrder;

    @Column(name = "estimated_duration_minutes")
    Integer estimatedDurationMinutes;

    @Column(name = "is_free_preview")
    Boolean isFreePreview;
}
