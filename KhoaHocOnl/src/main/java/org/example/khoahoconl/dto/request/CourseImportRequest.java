package org.example.khoahoconl.dto.request;

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
public class CourseImportRequest {

    private Long courseId;
    private String courseTitle;
    private String description;
    private String urlVideo;
    private BigDecimal price;
    private List<Long> prerequisiteIds;
    private List<String> learningObjectives;
    private List<CurriculumItemRequest> curriculum;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CurriculumItemRequest {

        private String chapterTitle;
        private String chapterDescription;
        private Integer estimatedDurationMinutes;
        private Integer displayOrder;
        private List<LessonRequest> lessons;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class LessonRequest {

        private String lessonTitle;
        private String lessonDescription;
        private String videoUrl;
        private Integer displayOrder;
        private Integer estimatedDurationMinutes;
        private Boolean isFreePreview;
    }
}
