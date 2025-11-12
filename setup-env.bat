@echo off
REM Script setup environment cho development (Windows)
REM Chạy: setup-env.bat

echo 🔐 Setting up environment for KhoaHocOnl...

REM Check if application.properties exists
if exist "KhoaHocOnl\src\main\resources\application.properties" (
    echo ⚠️  application.properties đã tồn tại!
    set /p OVERWRITE="Bạn có muốn ghi đè? (y/n): "
    if /i not "%OVERWRITE%"=="y" (
        echo ❌ Hủy bỏ setup
        exit /b 1
    )
)

REM Copy template
echo 📋 Copying template...
copy "KhoaHocOnl\src\main\resources\application.properties.example" ^
     "KhoaHocOnl\src\main\resources\application.properties"

REM Generate JWT secret (PowerShell)
echo 🔑 Generating JWT secret...
for /f "delims=" %%i in ('powershell -Command "$bytes = New-Object byte[] 64; [Security.Cryptography.RNGCryptoServiceProvider]::Create().GetBytes($bytes); [Convert]::ToBase64String($bytes)"') do set JWT_SECRET=%%i

REM Get database password
set /p DB_PASSWORD="🔐 Nhập MySQL password (mặc định: 1111): "
if "%DB_PASSWORD%"=="" set DB_PASSWORD=1111

REM Get admin password
set /p ADMIN_PASSWORD="🔐 Nhập Admin password (mặc định: 112233): "
if "%ADMIN_PASSWORD%"=="" set ADMIN_PASSWORD=112233

REM Update application.properties using PowerShell
echo ✏️  Updating application.properties...
powershell -Command "(Get-Content 'KhoaHocOnl\src\main\resources\application.properties') -replace 'YOUR_DB_PASSWORD', '%DB_PASSWORD%' | Set-Content 'KhoaHocOnl\src\main\resources\application.properties'"
powershell -Command "(Get-Content 'KhoaHocOnl\src\main\resources\application.properties') -replace 'YOUR_STRONG_JWT_SECRET', '%JWT_SECRET%' | Set-Content 'KhoaHocOnl\src\main\resources\application.properties'"
powershell -Command "(Get-Content 'KhoaHocOnl\src\main\resources\application.properties') -replace 'YOUR_STRONG_ADMIN_PASSWORD', '%ADMIN_PASSWORD%' | Set-Content 'KhoaHocOnl\src\main\resources\application.properties'"

echo ✅ Setup hoàn tất!
echo.
echo 📝 Thông tin đã cấu hình:
echo    - Database password: ****
echo    - JWT secret: %JWT_SECRET:~0,20%...
echo    - Admin password: ****
echo.
echo 🚀 Bạn có thể chạy ứng dụng:
echo    cd KhoaHocOnl
echo    mvnw.cmd spring-boot:run

pause
