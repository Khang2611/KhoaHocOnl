package org.example.khoahoconl.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CourseResponse {
    private Long courseId;
    private String courseTitle;
    private String description;
    private String urlVideo;
    private BigDecimal price;
    private UserResponse createBy;
}