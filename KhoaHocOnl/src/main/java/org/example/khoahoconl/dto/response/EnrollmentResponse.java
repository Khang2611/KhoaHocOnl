package org.example.khoahoconl.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EnrollmentResponse {
    long userId ;
    String courseTitle ;
    String status ;

}
