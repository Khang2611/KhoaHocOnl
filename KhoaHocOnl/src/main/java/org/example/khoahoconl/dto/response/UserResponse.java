package org.example.khoahoconl.dto.response;


import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserResponse {
    long userId ;
    String userName ;
    String fullName ;
    String role ;
    String phoneNumber ;

}
