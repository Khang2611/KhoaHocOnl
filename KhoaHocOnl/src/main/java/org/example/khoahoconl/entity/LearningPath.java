package org.example.khoahoconl.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "learning_paths")
public class LearningPath {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long pathId;

    @Column(nullable = false, length = 200)
    String title;

    @Column(length = 1000)
    String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    Difficulty difficulty;

    @Column(name = "estimated_duration")
    String estimatedDuration; // e.g., "6-8 tháng"

    @Column(name = "bundle_price")
    BigDecimal bundlePrice;

    @Column(name = "original_price")
    BigDecimal originalPrice;

    @Column(name = "discount_percentage")
    Integer discountPercentage;

    @Column(name = "is_active")
    @Builder.Default
    Boolean isActive = true;

    @OneToMany(mappedBy = "learningPath", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    List<LearningPathCourse> courses;

    public enum Difficulty {
        BEGINNER,
        INTERMEDIATE,
        ADVANCED
    }

    // Manual setters
    public void setPathId(Long pathId) {
        this.pathId = pathId;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setDifficulty(Difficulty difficulty) {
        this.difficulty = difficulty;
    }

    public void setEstimatedDuration(String estimatedDuration) {
        this.estimatedDuration = estimatedDuration;
    }

    public void setBundlePrice(BigDecimal bundlePrice) {
        this.bundlePrice = bundlePrice;
    }

    public void setOriginalPrice(BigDecimal originalPrice) {
        this.originalPrice = originalPrice;
    }

    public void setDiscountPercentage(Integer discountPercentage) {
        this.discountPercentage = discountPercentage;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public void setCourses(List<LearningPathCourse> courses) {
        this.courses = courses;
    }
}
