package org.example.khoahoconl.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

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
@Table(name = "course")
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "course_id")
    Long courseId;

    @Column(name = "course_title", nullable = false, length = 200)
    String courseTitle;

    @Column(length = 2000)
    String description;

    @Column(name = "url_video", length = 500)
    String urlVideo;

    @Column(precision = 10, scale = 2)
    BigDecimal price;

    @ManyToOne
    @JoinColumn(name = "create_by")
    User createBy;

    @Column(name = "created_date")
    LocalDateTime createdDate;

    @Column(name = "updated_date")
    LocalDateTime updatedDate;

    @Column(name = "duration_hours")
    Integer durationHours;

    @Column(length = 50)
    String level;

    @Column(length = 100)
    String category;
}
