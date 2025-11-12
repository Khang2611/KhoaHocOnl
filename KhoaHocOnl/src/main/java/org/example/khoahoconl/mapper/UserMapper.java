package org.example.khoahoconl.mapper;

import org.example.khoahoconl.dto.request.RegisterRequest;
import org.example.khoahoconl.dto.request.UserUpdateRequest;
import org.example.khoahoconl.dto.response.UserResponse;
import org.example.khoahoconl.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(target = "userId", ignore = true)
    @Mapping(target = "role", ignore = true)
    User toUser(RegisterRequest request);

    @Mapping(target = "userName", source = "userName")
    @Mapping(target = "fullName", source = "fullName")
    @Mapping(target = "role", expression = "java(user.getRole() != null ? user.getRole().name() : null)")
    @Mapping(target = "phoneNumber", source = "phoneNumber")
    @Mapping(target = "userId", source = "userId")
    UserResponse toUserResponse(User user);

    @Mapping(target = "userName", ignore = true)
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "userId", ignore = true)
    @Mapping(target = "role", ignore = true)
    void updateUser(@MappingTarget User user, UserUpdateRequest request);
}
