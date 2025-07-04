[![CI](https://github.com/oj9299/motolog/actions/workflows/ci.yml/badge.svg)](https://github.com/oj9299/motolog/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

# 🚗 Motolog - Vehicle Trip Logger & Analytics Platform
https://motolog.online/

Motolog is a modern, full-stack web application for logging, tracking, and analyzing vehicle trips, fuel usage, and ride sharing. It features a beautiful UI, real-time analytics, and leverages the latest in cloud and DevOps technologies for a seamless, scalable experience.

---

## 🌟 Features

### 🚙 Vehicle Management
- Add, edit, and view vehicles with images and verified specs.

### 🛣️ Trip Logging & Rideboard
- Log trips with automatic distance and route mapping. Browse and like public trips with infinite scroll.

### ⛽ Fuel Tracking
- Log fuel-ups, view/edit logs, and see mileage/odometer analytics.

### 📊 Analytics Dashboard
- Visualize fuel, mileage, and odometer data with interactive charts.

### 👤 User Experience
- Secure authentication, dark/light mode, responsive design, and premium UI.

### ☁️ Cloud & DevOps
- CI/CD with GitHub Actions, Docker, AWS S3/EC2, Vercel, and environment-based config.

---

## 🛠️ Tech Stack

### Frontend
- React 18, Tailwind CSS, shadcn/ui, Framer Motion, Clerk, Chart.js, Recharts, ECharts, styled-components

### Backend
- Node.js, Express.js, MongoDB, Mongoose, JWT, Nominatim, RESTful API

### Cloud & DevOps
- Docker, GitHub Actions, AWS S3, AWS EC2, Vercel

---

## ✨ Feature Demonstration

### 1. **My Vehicles**
- Manage vehicles with images and verified specs.

### 2. **Trip Logging & Rideboard**
- Log trips, view analytics, and browse public trips with infinite scroll.

### 3. **Fuel Logs**
- Log and analyze fuel-ups and mileage trends.

### 4. **Analytics Dashboard**
- Visualize your data with interactive, responsive charts.

### 5. **Cloud & DevOps**
- Automated CI/CD, Docker, AWS S3/EC2, and Vercel for deployment.

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+), MongoDB, Docker (optional), AWS account (for S3/EC2)

### 1. Clone & Install
```bash
git clone <repository-url>
cd motolog-1
# Server
yarn install # or npm install
cd ../client
yarn install # or npm install
```

### 2. Environment Setup
- See `.env.example` in both `server/` and `client/` for required variables

### 3. Run Locally
```bash
# Start backend
cd server
npm start
# Start frontend
cd ../client
npm run dev
```

### 4. Docker (Optional)
```bash
docker-compose up --build
```

### 5. Mock Data
```bash
cd server
node scripts/mockData.js
```

---

## 🧑‍💻 Contributing
- Contributions are welcome! Open an issue or pull request.

## 🛡️ License
- MIT License.

--
