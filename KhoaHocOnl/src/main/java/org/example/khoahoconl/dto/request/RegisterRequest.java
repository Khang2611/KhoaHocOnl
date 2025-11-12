package org.example.khoahoconl.dto.request;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RegisterRequest {

    @Size(min = 3, max = 50, message = "USERNAME_INVALID")
    @Pattern(regexp = "^[a-zA-Z0-9_]+$", message = "Username chỉ được chứa chữ cái, số và dấu gạch dưới")
    String userName;

    @Size(min = 8, max = 100, message = "Password phải có ít nhất 8 ký tự")
    @Pattern(
            regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$",
            message = "Password phải chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt"
    )
    String password;

    @Size(min = 2, max = 100, message = "Họ tên phải từ 2-100 ký tự")
    String fullName;

    @Pattern(regexp = "^[0-9]{10,11}$", message = "Số điện thoại không hợp lệ")
    String phoneNumber;
}
