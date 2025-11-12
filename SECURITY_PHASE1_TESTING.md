# 🧪 Testing - Phần 1: Password & JWT Security

## ✅ Đã Triển Khai

1. ✅ Tăng BCrypt strength từ 10 → 12
2. ✅ Giảm JWT expiration từ 7 days → 24 hours
3. ✅ Thêm password validation (8+ chars, uppercase, lowercase, number, special char)
4. ✅ Thêm username validation (chỉ chữ cái, số, underscore)
5. ✅ Thêm phone validation (10-11 số)
6. ✅ Cập nhật .gitignore để bảo vệ sensitive files
7. ✅ Tạo application.properties.example template

## 🧪 Cách Test

### 1. Test Password Validation

#### Test 1.1: Password quá yếu (should FAIL)

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "userName": "testuser",
    "password": "weak",
    "fullName": "Test User",
    "phoneNumber": "0123456789"
  }'
```

**Kết quả mong đợi**: 400 Bad Request - "Password phải có ít nhất 8 ký tự"

#### Test 1.2: Password không có chữ hoa (should FAIL)

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "userName": "testuser",
    "password": "test@123",
    "fullName": "Test User",
    "phoneNumber": "0123456789"
  }'
```

**Kết quả mong đợi**: 400 Bad Request - "Password phải chứa ít nhất 1 chữ hoa..."

#### Test 1.3: Password hợp lệ (should SUCCESS)

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "userName": "testuser",
    "password": "Test@123456",
    "fullName": "Test User",
    "phoneNumber": "0123456789"
  }'
```

**Kết quả mong đợi**: 200 OK - User created successfully

### 2. Test Username Validation

#### Test 2.1: Username có ký tự đặc biệt (should FAIL)

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "userName": "test@user",
    "password": "Test@123456",
    "fullName": "Test User",
    "phoneNumber": "0123456789"
  }'
```

**Kết quả mong đợi**: 400 Bad Request - "Username chỉ được chứa chữ cái, số và dấu gạch dưới"

#### Test 2.2: Username hợp lệ (should SUCCESS)

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "userName": "test_user_123",
    "password": "Test@123456",
    "fullName": "Test User",
    "phoneNumber": "0123456789"
  }'
```

**Kết quả mong đợi**: 200 OK

### 3. Test Phone Validation

#### Test 3.1: Phone không hợp lệ (should FAIL)

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "userName": "testuser",
    "password": "Test@123456",
    "fullName": "Test User",
    "phoneNumber": "123"
  }'
```

**Kết quả mong đợi**: 400 Bad Request - "Số điện thoại không hợp lệ"

### 4. Test JWT Token Expiration

#### Test 4.1: Login và kiểm tra token

```bash
# Login
RESPONSE=$(curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "userName": "admin",
    "password": "112233"
  }')

echo $RESPONSE

# Extract token (trên Linux/Mac)
TOKEN=$(echo $RESPONSE | jq -r '.result.token')

# Sử dụng token
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8080/api/user/profile
```

#### Test 4.2: Kiểm tra token expiration

Token sẽ hết hạn sau 24 giờ (thay vì 7 ngày như trước).

### 5. Test BCrypt Strength

#### Test 5.1: Tạo user mới và kiểm tra hash

```bash
# Tạo user
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "userName": "bcrypt_test",
    "password": "Test@123456",
    "fullName": "BCrypt Test",
    "phoneNumber": "0123456789"
  }'

# Kiểm tra trong database
# Password hash sẽ bắt đầu với $2a$12$ (12 là strength)
```

## 📊 Checklist

- [ ] Test password quá yếu → FAIL
- [ ] Test password không đủ phức tạp → FAIL
- [ ] Test password hợp lệ → SUCCESS
- [ ] Test username có ký tự đặc biệt → FAIL
- [ ] Test username hợp lệ → SUCCESS
- [ ] Test phone không hợp lệ → FAIL
- [ ] Test phone hợp lệ → SUCCESS
- [ ] Test login và nhận token → SUCCESS
- [ ] Test sử dụng token → SUCCESS
- [ ] Kiểm tra password hash trong DB có $2a$12$ → SUCCESS

## 🔄 Rollback (Nếu Cần)

Nếu có vấn đề, rollback bằng cách:

1. **Revert BCrypt strength**:

```java
return new BCryptPasswordEncoder(); // Về default (10)
```

2. **Revert JWT expiration**:

```properties
jwt.expiration.ms=604800000  # 7 days
```

3. **Revert validation**:
   Xóa các @Pattern annotations trong RegisterRequest.java

## ✅ Kết Quả Mong Đợi

Sau khi test xong:

- ✅ Chỉ password mạnh mới được chấp nhận
- ✅ Username không chứa ký tự đặc biệt
- ✅ Phone number phải đúng format
- ✅ Token hết hạn sau 24h (an toàn hơn)
- ✅ Password hash mạnh hơn (BCrypt 12)

## 🎯 Tiếp Theo

Sau khi test xong Phần 1, chúng ta sẽ tiếp tục:

- **Phần 2**: Rate Limiting & Security Headers
- **Phần 3**: Frontend Security (XSS Prevention, Input Sanitization)
- **Phần 4**: Database Security
- **Phần 5**: Logging & Monitoring
