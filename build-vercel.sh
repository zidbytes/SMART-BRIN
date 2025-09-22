#!/bin/bash

# Vercel build script for Laravel + Inertia.js

echo "🔧 Setting up Vercel environment..."

# Install Node.js dependencies
echo "📦 Installing Node.js dependencies..."
npm ci

# Install PHP dependencies (production only)
echo "📦 Installing PHP dependencies..."
composer install --no-dev --optimize-autoloader --no-interaction

# Generate application key if not exists
echo "🔑 Setting up Laravel..."
if [ ! -f .env ]; then
    cp .env.example .env
fi

# Run optimization commands
echo "⚡ Optimizing Laravel..."
php artisan config:cache --no-interaction || true
php artisan route:cache --no-interaction || true
php artisan view:cache --no-interaction || true

# Build assets with SSR
echo "🏗️ Building assets with SSR..."
npm run build:ssr

echo "✅ Build completed successfully!"