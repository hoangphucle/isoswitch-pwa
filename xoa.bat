@echo off
title Fix Tailwind + NPM errors for Vite React App
echo ============================================
echo   🚀 ISO SWITCH - AUTO FIX SCRIPT
echo ============================================
echo.

:: B1: Xóa cache npm
echo 🧹 Đang xóa cache npm...
npm cache clean --force

:: B2: Xóa folder node_modules và package-lock.json
echo 🗑️  Dọn sạch node_modules và package-lock.json...
rmdir /s /q node_modules
del /f /q package-lock.json

:: B3: Cài lại dependencies
echo 📦 Cài lại dependencies gốc...
npm install

:: B4: Cài TailwindCSS, PostCSS, Autoprefixer
echo 🪶 Cài TailwindCSS + PostCSS + Autoprefixer...
npm install -D tailwindcss postcss autoprefixer

:: B5: Kiểm tra cài đặt
echo 🔍 Kiểm tra phiên bản tailwind...
npx tailwindcss -v

:: B6: Tạo file config nếu chưa có
if not exist tailwind.config.js (
    echo ⚙️ Tạo file tailwind.config.js...
    echo /** @type {import('tailwindcss').Config} */> tailwind.config.js
    echo export default {>> tailwind.config.js
    echo.    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],>> tailwind.config.js
    echo.    theme: { extend: {}, },>> tailwind.config.js
    echo.    plugins: [],>> tailwind.config.js
    echo }>> tailwind.config.js
)

if not exist postcss.config.js (
    echo ⚙️ Tạo file postcss.config.js...
    echo export default {> postcss.config.js
    echo.   plugins: {>> postcss.config.js
    echo.       tailwindcss: {},>> postcss.config.js
    echo.       autoprefixer: {},>> postcss.config.js
    echo.   },>> postcss.config.js
    echo }>> postcss.config.js
)

:: B7: Hoàn tất
echo ✅ Xong rồi! Giờ bạn có thể chạy:
echo.
echo     npm run dev
echo.
echo để khởi động lại dự án IsoSwitch.
echo ============================================
pause
