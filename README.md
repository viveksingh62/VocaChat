
<p align="center">
  <img src="./frontend/src/assets/chatlogo.png" alt="vocahat Logo" width="120" />
</p>

<h1 align="center"> VocaChat </h1>

<p align="center">
  A real-time multilingual chat application built with the MERN stack, Socket.io, and Redis
</p>

<p align="center">
  <b>Live Translation • Real-time Messaging • Scalable Architecture</b>
</p>

---

## 📖 About the Project

**VocaChat** is a **real-time multilingual chat application** that allows users to communicate instantly with **live message translation** across different languages.

The system is designed with a strong focus on **low latency**, **scalability**, and **smooth real-time user experience**, making it suitable for modern real-time applications.

---

## 🎥 Demo Video

> 📌 Click to Watch Demo showcasing real-time chat and live translation


<p align="center">
  <a href="https://youtu.be/GmMqWdp7G9c">
    <img src="https://img.youtube.com/vi/GmMqWdp7G9c/0.jpg" alt="VocaChat Demo Video" width="600"/>
        <br/>
    ▶️ Watch Demo on YouTube
  </a>
</p>


---

## 📸 Screenshots

> 📌 UI previews from the application

### 🔐 Login & 💬 Chat Interface
<p align="center">
  <img src="./frontend/src/assets/login.png" width="45%" />
  <img src="./frontend/src/assets/chat.png" width="45%" />
</p>

### 🌍 Language Selection
<p align="center">
  <img src="./frontend/src/assets/language.png" width="45%" />
</p>

---

## 🚀 Features

- 🌐 **Real-time Messaging** using Socket.io
- 🌍 **Live Message Translation** between users
- 🔐 **Authentication** (JWT / Google OAuth)
- 👤 **One-to-One Chat System**
- 🟢 **Online / Offline User Presence**
- ⌨️ **Typing Indicator**
- 🕒 **Message Timestamps**
- ⚡ **Redis-powered Caching & Socket State Management**
- 📱 **Fully Responsive UI**

---

## 🛠️ Tech Stack

### Frontend
- React
- CSS / Tailwind CSS
- Socket.io-client

### Backend
- Node.js
- Express.js
- Socket.io
- MongoDB + Mongoose
- Redis (Upstash)
- JWT Authentication
- Open-source Translation API

### Deployment
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas
- Cache Store: Redis

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/viveksingh62/chatter.git
cd chatter

2️⃣ Setup Backend

cd backend
npm install

Create a .env file inside backend/:

PORT=8080
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
REDIS_URL=your_redis_url
TRANSLATION_API_KEY=your_translation_api_key
CLIENT_URL=http://localhost:5173

Run backend:

node index.js

3️⃣ Setup Frontend

cd frontend
npm install

Create a .env file inside frontend/:

VITE_BACKEND_URL=http://localhost:8080

Run frontend:
npm run dev
```bash

🧠 Challenges & Learnings

Built scalable real-time communication using Socket.io

Integrated live translation into active chat streams

Used Redis to optimize socket events and state handling

Handled authentication, cookies, and CORS in production

Improved system design for real-time MERN applications



Developed by Vivek Singh ✨
