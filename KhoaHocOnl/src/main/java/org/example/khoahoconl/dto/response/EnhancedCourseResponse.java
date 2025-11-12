package org.example.khoahoconl.dto.response;

import java.math.BigDecimal;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EnhancedCourseResponse {

    private Long courseId;
    private String courseTitle;
    private String description;
    private String urlVideo;
    private BigDecimal price;
    private UserResponse createBy;

    // Enhanced fields
    private List<String> learningObjectives;
    private List<CurriculumItem> curriculum;
    private List<PrerequisiteInfo> prerequisites;
    private String difficulty;
    private Integer estimatedDurationHours;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CurriculumItem {

        private String chapterTitle;
        private String chapterDescription;
        private Integer estimatedDurationMinutes;
        private Integer displayOrder;
        private List<LessonInfo> lessons;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LessonInfo {

        private Long lessonId;
        private String lessonTitle;
        private String lessonDescription;
        private String videoUrl;
        private Integer displayOrder;
        private Integer estimatedDurationMinutes;
        private Boolean isFreePreview;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PrerequisiteInfo {

        private Long courseId;
        private String courseTitle;
        private String type; // REQUIRED or RECOMMENDED
    }
}
