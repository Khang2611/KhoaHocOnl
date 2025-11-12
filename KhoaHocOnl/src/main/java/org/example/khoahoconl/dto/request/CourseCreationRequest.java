package org.example.khoahoconl.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CourseCreationRequest {

    String courseTitle;
    String description;
    BigDecimal price;
    String urlVideo;
}
