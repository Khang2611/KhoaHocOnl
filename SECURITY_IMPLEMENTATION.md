# 🔐 Hướng Dẫn Triển Khai Bảo Mật - Khóa Học Online

## 📋 Mục Lục

1. [Setup Ban Đầu](#setup-ban-đầu)
2. [Backend Security](#backend-security)
3. [Frontend Security](#frontend-security)
4. [Database Security](#database-security)
5. [Testing](#testing)
6. [Production Checklist](#production-checklist)

---

## 🚀 Setup Ban Đầu

### 1. Cài đặt Dependencies

#### Backend (Maven)

```bash
cd KhoaHocOnl
mvn clean install
mvn dependency-check:check  # Kiểm tra vulnerabilities
```

#### Frontend (npm)

```bash
cd frontend
npm install
npm audit
npm audit fix
```

### 2. Cấu hình Environment Variables

#### Backend

```bash
# Tạo JWT secret mạnh
openssl rand -base64 64

# Cập nhật application.properties
```

**File: `KhoaHocOnl/src/main/resources/application.properties`**

```properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/KhoaHocOnl
spring.datasource.username=${DB_USERNAME:root}
spring.datasource.password=${DB_PASSWORD:1111}

# JWT Configuration (THAY ĐỔI TRONG PRODUCTION!)
jwt.secret=${JWT_SECRET:MjNPVkgzUWlSNmJpaGd0UTJUbEVDY2lHNkJIMHNjcDJFQWRFdjIwUDVyL3Npd2U3cDhaVWpGaVZOQ0kzSkhlYwo=}
jwt.expiration.ms=86400000  # 24 hours

# Admin Configuration (THAY ĐỔI TRONG PRODUCTION!)
admin.password=${ADMIN_PASSWORD:112233}

# CORS Configuration
cors.allowed-origins=http://localhost:3000,http://localhost:5173
```

#### Frontend

```bash
cd frontend
# Tạo file .env.local
```

**File: `frontend/.env.local`**

```env
REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_ENV=development
```

### 3. Cập nhật .gitignore

Đảm bảo các file nhạy cảm không bị commit:

```
# Environment files
.env
.env.local
.env.production
*.properties

# Logs
*.log

# IDE
.idea/
.vscode/
```

---

## 🛡️ Backend Security

### ✅ Đã Có (Hiện Tại)

1. **Password Hashing**: BCrypt
2. **JWT Authentication**: Token-based auth
3. **CORS Configuration**: Localhost allowed
4. **Role-based Access Control**: ADMIN, USER roles
5. **Stateless Sessions**: No server-side sessions

### 🔧 Cần Cải Tiến

#### 1. Tăng Cường BCrypt Strength

**File: `SecurityConfig.java`**

```java
@Bean
public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder(12);  // Tăng từ 10 (default) lên 12
}
```

#### 2. JWT Token Expiration & Refresh

**Hiện tại**: 7 days (quá dài!)
**Nên**:

- Access Token: 15-30 phút
- Refresh Token: 7 days

#### 3. Rate Limiting

Cần thêm để chống brute force attacks.

#### 4. Input Validation

Cần validate tất cả input từ user.

#### 5. Security Headers

Thêm headers bảo mật trong response.

---

## 🎨 Frontend Security

### ✅ Đã Có

1. **Protected Routes**: Kiểm tra authentication
2. **Token Storage**: LocalStorage
3. **Axios Interceptors**: Auto attach token

### 🔧 Cần Cải Tiến

#### 1. XSS Prevention

Sanitize tất cả user input trước khi render.

#### 2. CSRF Protection

Implement CSRF tokens cho state-changing operations.

#### 3. Secure Token Storage

Xem xét dùng httpOnly cookies thay vì localStorage.

#### 4. Content Security Policy

Thêm CSP headers.

---

## 🗄️ Database Security

### ✅ Đã Có

1. **JPA/Hibernate**: Prevent SQL injection
2. **Connection Pooling**: HikariCP

### 🔧 Cần Cải Tiến

#### 1. Database User Privileges

```sql
-- Tạo user riêng cho application
CREATE USER 'khoahoc_app'@'localhost' IDENTIFIED BY 'strong_password';

-- Chỉ grant quyền cần thiết
GRANT SELECT, INSERT, UPDATE, DELETE ON KhoaHocOnl.* TO 'khoahoc_app'@'localhost';

-- KHÔNG grant DROP, CREATE, ALTER trong production
FLUSH PRIVILEGES;
```

#### 2. SSL Connection

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/KhoaHocOnl?useSSL=true&requireSSL=true
```

#### 3. Prepared Statements

Đảm bảo tất cả queries dùng JPA hoặc prepared statements.

---

## 🧪 Testing

### 1. Authentication Testing

```bash
# Test login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"112233"}'

# Test protected endpoint without token (should fail)
curl http://localhost:8080/api/admin/courses

# Test with token
TOKEN="your_token_here"
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8080/api/admin/courses
```

### 2. Input Validation Testing

```bash
# Test XSS
curl -X POST http://localhost:8080/api/course \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"<script>alert(1)</script>"}'

# Test SQL Injection
curl "http://localhost:8080/api/course/search?q='; DROP TABLE users; --"
```

### 3. Rate Limiting Testing

```bash
# Send 100 requests rapidly
for i in {1..100}; do
  curl http://localhost:8080/api/course/all
done
```

---

## ✅ Production Checklist

### Pre-Deployment

- [ ] **Environment Variables**

  - [ ] JWT secret đủ mạnh (64+ characters)
  - [ ] Database credentials an toàn
  - [ ] CORS origins chỉ production domains
  - [ ] Debug mode = false

- [ ] **Dependencies**

  - [ ] Chạy `mvn dependency-check:check`
  - [ ] Chạy `npm audit`
  - [ ] Update packages có vulnerabilities

- [ ] **Code Review**

  - [ ] Không có credentials trong code
  - [ ] Không có console.log với sensitive data
  - [ ] Không có commented code với passwords

- [ ] **Files**
  - [ ] .gitignore đầy đủ
  - [ ] Xóa file .env, application.properties khỏi Git
  - [ ] Xóa test credentials

### Post-Deployment

- [ ] **HTTPS**

  - [ ] SSL Certificate installed
  - [ ] Force HTTPS redirect
  - [ ] HSTS header enabled

- [ ] **Security Headers**

  ```
  Strict-Transport-Security: max-age=31536000
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  X-XSS-Protection: 1; mode=block
  Content-Security-Policy: default-src 'self'
  ```

- [ ] **Monitoring**

  - [ ] Error logging configured
  - [ ] Security alerts setup
  - [ ] Failed login attempts monitoring

- [ ] **Backup**
  - [ ] Database backup automated
  - [ ] Backup encryption enabled
  - [ ] Recovery process tested

---

## 🔄 Regular Maintenance

### Weekly

- [ ] Review security logs
- [ ] Check failed login attempts
- [ ] Monitor rate limiting hits

### Monthly

- [ ] Update dependencies
- [ ] Run security scan
- [ ] Review access logs

### Quarterly

- [ ] Change JWT secret
- [ ] Rotate database passwords
- [ ] Security audit

---

## 🆘 Troubleshooting

### 1. Token Expired Error

**Error**: `JWT token is expired`
**Solution**: Token hết hạn, user cần login lại hoặc sử dụng refresh token.

### 2. CORS Error

**Error**: `Access to XMLHttpRequest blocked by CORS policy`
**Solution**: Kiểm tra `cors.allowed-origins` trong application.properties

### 3. Rate Limit Exceeded

**Error**: `429 Too Many Requests`
**Solution**: Đợi 1 phút hoặc tăng rate limit

### 4. Invalid JWT Signature

**Error**: `Invalid JWT signature`
**Solution**: JWT secret không khớp, kiểm tra environment variables

---

## 📚 Tài Liệu Tham Khảo

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Spring Security Docs](https://spring.io/projects/spring-security)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [React Security Best Practices](https://reactjs.org/docs/dom-elements.html#dangerouslysetinnerhtml)

---

## 📞 Support

Nếu có vấn đề, vui lòng:

1. Check logs: `logs/khoahoc.log`
2. Check browser console
3. Review troubleshooting section
4. Contact security team

---

**Lưu ý**: Document này là hướng dẫn cơ bản. Trong production, cần có security audit chuyên nghiệp.
