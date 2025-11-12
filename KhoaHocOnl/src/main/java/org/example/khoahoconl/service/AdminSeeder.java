package org.example.khoahoconl.service;

import lombok.RequiredArgsConstructor;
import org.example.khoahoconl.entity.User;
import org.example.khoahoconl.enums.Role;
import org.example.khoahoconl.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Order(1) // Run first
public class AdminSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    @Value("${admin.password}")
    private String adminPassword;

    @Override
    public void run(String... args) throws Exception {
        if (!userRepository.existsByUserName("admin")) {
            User admin = new User();
            admin.setUserName("admin");
            admin.setPassword(passwordEncoder.encode(adminPassword));
            admin.setRole(Role.ADMIN);
            userRepository.save(admin);
            System.out.println("Tài khoản admin đã được tạo thành công.");
        }
    }
}
