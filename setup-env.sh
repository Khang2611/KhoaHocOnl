#!/bin/bash

# Script setup environment cho development
# Chạy: bash setup-env.sh

echo "🔐 Setting up environment for KhoaHocOnl..."

# Check if application.properties exists
if [ -f "KhoaHocOnl/src/main/resources/application.properties" ]; then
    echo "⚠️  application.properties đã tồn tại!"
    read -p "Bạn có muốn ghi đè? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Hủy bỏ setup"
        exit 1
    fi
fi

# Copy template
echo "📋 Copying template..."
cp KhoaHocOnl/src/main/resources/application.properties.example \
   KhoaHocOnl/src/main/resources/application.properties

# Generate JWT secret
echo "🔑 Generating JWT secret..."
JWT_SECRET=$(openssl rand -base64 64 | tr -d '\n')

# Get database password
read -sp "🔐 Nhập MySQL password (mặc định: 1111): " DB_PASSWORD
echo
DB_PASSWORD=${DB_PASSWORD:-1111}

# Get admin password
read -sp "🔐 Nhập Admin password (mặc định: 112233): " ADMIN_PASSWORD
echo
ADMIN_PASSWORD=${ADMIN_PASSWORD:-112233}

# Update application.properties
echo "✏️  Updating application.properties..."
sed -i.bak "s|YOUR_DB_PASSWORD|$DB_PASSWORD|g" KhoaHocOnl/src/main/resources/application.properties
sed -i.bak "s|YOUR_STRONG_JWT_SECRET|$JWT_SECRET|g" KhoaHocOnl/src/main/resources/application.properties
sed -i.bak "s|YOUR_STRONG_ADMIN_PASSWORD|$ADMIN_PASSWORD|g" KhoaHocOnl/src/main/resources/application.properties

# Remove backup file
rm KhoaHocOnl/src/main/resources/application.properties.bak

echo "✅ Setup hoàn tất!"
echo ""
echo "📝 Thông tin đã cấu hình:"
echo "   - Database password: ****"
echo "   - JWT secret: ${JWT_SECRET:0:20}..."
echo "   - Admin password: ****"
echo ""
echo "🚀 Bạn có thể chạy ứng dụng:"
echo "   cd KhoaHocOnl"
echo "   ./mvnw spring-boot:run"
