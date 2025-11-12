package org.example.khoahoconl.dto.request;

import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class LoginRequest {
    @Size(min = 3 , message = "USERNAME_INVALID")
    String userName ;
    @Size(min = 6, message = "INVALID_PASSWORD")
    String password ;
}
