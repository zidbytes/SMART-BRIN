#!/bin/bash
# Build script for Vercel deployment

echo "Building for production..."

# Install PHP dependencies
composer install --no-dev --optimize-autoloader

# Install Node dependencies and build assets
npm ci
npm run build

# Clear and cache Laravel configurations
php artisan config:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "Build completed successfully!"