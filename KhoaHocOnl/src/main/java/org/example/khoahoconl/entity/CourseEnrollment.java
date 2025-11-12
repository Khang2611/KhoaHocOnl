package org.example.khoahoconl.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.example.khoahoconl.enums.Status;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)

public class CourseEnrollment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "course_enrollment_id")
    Long courseEnrollmentId;
    @ManyToOne
    @JoinColumn(name = "user_id")
    User user;
    @ManyToOne
    @JoinColumn(name = "course_id")
    Course course;
    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    Status status;
    @Column(name = "request_date")
    LocalDateTime requestDate;
}
