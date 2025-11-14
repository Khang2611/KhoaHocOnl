package org.example.khoahoconl.service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.khoahoconl.dto.request.LoginRequest;
import org.example.khoahoconl.dto.request.RegisterRequest;
import org.example.khoahoconl.dto.request.UserUpdateRequest;
import org.example.khoahoconl.dto.response.AuthResponse;
import org.example.khoahoconl.dto.response.UserResponse;
import org.example.khoahoconl.entity.CourseEnrollment;
import org.example.khoahoconl.entity.User;
import org.example.khoahoconl.enums.Role;
import org.example.khoahoconl.exception.AppException;
import org.example.khoahoconl.exception.ErrorCode;
import org.example.khoahoconl.mapper.CourseMapper;
import org.example.khoahoconl.mapper.UserMapper;
import org.example.khoahoconl.repository.CourseEnrollmentRepository;
import org.example.khoahoconl.repository.UserRepository;
import org.example.khoahoconl.security.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserService {

    final AuthenticationManager authenticationManager;
    final JwtTokenProvider tokenProvider;
    final UserRepository userRepository;
    final PasswordEncoder passwordEncoder;
    final UserMapper userMapper;
    final org.example.khoahoconl.service.CourseManagementFacade courseManagementFacade;

    public UserResponse registerUser(RegisterRequest request) {
        if (userRepository.existsByUserName(request.getUserName())) {
            throw new AppException(ErrorCode.USER_EXISTED);
        }
        User user = userMapper.toUser(request);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole(Role.USER);
        return userMapper.toUserResponse(userRepository.save(user));
    }

    public AuthResponse authenticateUser(LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getUserName(),
                            request.getPassword()
                    )
            );
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            User user = userRepository.findByUserName(userDetails.getUsername())
                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

            String userRole = userDetails.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .collect(Collectors.joining(","));

            String jwt = tokenProvider.generateTokenWithClaims(
                    userDetails.getUsername(),
                    user.getUserId(),
                    userRole
            );
            return AuthResponse.builder()
                    .token(jwt)
                    .authenticated(true)
                    .userName(userDetails.getUsername())
                    .role(userRole)
                    .build();
        } catch (AuthenticationException e) {
            throw new AppException(ErrorCode.INVALID_CREDENTIALS);
        }
    }

    public Long getUserIdByUsername(String username) {
        return userRepository.findByUserName(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND))
                .getUserId();
    }

    public UserResponse getMyInfo(String username) {
        User user = userRepository.findByUserName(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        return userMapper.toUserResponse(user);
    }

    public UserResponse updateUser(UserUpdateRequest request) {
        var context = SecurityContextHolder.getContext();
        String currentUsername = context.getAuthentication().getName();
        User user = userRepository.findByUserName(currentUsername)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        userMapper.updateUser(user, request);
        User updatedUser = userRepository.save(user);
        return userMapper.toUserResponse(updatedUser);
    }

    // Delegate to CourseManagementFacade
    public java.util.List<org.example.khoahoconl.dto.response.CourseResponse> getEnrolledCourses(Long userId) {
        return courseManagementFacade.getUserEnrolledCourses(userId);
    }

    public java.util.List<java.util.Map<String, Object>> getAllEnrollments(Long userId) {
        return courseManagementFacade.getUserAllEnrollments(userId);
    }
}
