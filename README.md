# 🌊 Blue Wave Banking

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![MERN](https://img.shields.io/badge/stack-MERN-orange.svg)

Blue Wave Banking is a professional-grade, full-stack financial platform built with the MERN stack. It features secure user authentication, real-time transaction logging, and a robust peer-to-peer transfer engine.

## ✨ Features

- 👤 **Automated Identity**: System-generated unique User IDs (e.g., `USER12345`).
- 🛡️ **Secure Wallet**: Password-protected balance viewing to ensure data privacy.
- 💸 **Instant Transfers**: Securely send money using User ID or Email with atomic balance updates.
- 📊 **Transaction History**: Comprehensive, color-coded audit logs of all credits and transfers.
- ⚙️ **Account Management**: Update email/password or permanently delete your account securely.
- 🔐 **JWT Authentication**: Industry-standard security with protected API endpoints.

## 🚀 Tech Stack

- **Frontend**: React (Vite), TypeScript, Tailwind CSS, Lucide Icons.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose).
- **Security**: JWT, Bcrypt.js.

## 🛠️ Installation & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+)
- [MongoDB](https://www.mongodb.com/try/download/community) (Running locally or MongoDB Atlas)

### Step 1: Clone and Install
```bash
# Clone the repository
git clone https://github.com/your-username/finance-banking.git
cd Finance-Banking

# Install Server Dependencies
cd server
npm install

# Install Client Dependencies
cd ../client
npm install
```

### Step 2: Environment Configuration
Create a `.env` file in the `server` directory:
```env
MONGO_URI=mongodb://127.0.0.1:27017/finance-banking
JWT_SECRET=your_super_secret_key
PORT=5000
```

### Step 3: Run the Application
```bash
# Start Backend (from server directory)
node server.js

# Start Frontend (from client directory)
npm run dev
```

## 📂 Project Structure
```
Finance-Banking/
├── client/          # React + Vite Frontend
│   ├── src/
│   │   ├── components/
│   │   ├── context/ # Auth State
│   │   ├── pages/   # Dashboard, Transfer, etc.
│   │   └── services/# API Interceptor
├── server/          # Node.js + Express Backend
│   ├── config/      # DB Connection
│   ├── controllers/ # Business Logic
│   ├── models/      # Mongoose Schemas
│   ├── routes/      # API Routes
│   └── middleware/  # Auth Protection
└── README.md
```

## 🛡️ Security Features
- **Password Hashing**: Never stored in plain text.
- **Protected Routes**: Only authenticated users can access banking features.
- **Atomic Operations**: Prevents race conditions during fund transfers.
- **Audit Logs**: Every credit and debit is immutable and logged.

## 📄 License
This project is licensed under the MIT License.
