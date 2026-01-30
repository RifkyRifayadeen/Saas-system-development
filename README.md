# TaskFlow - SaaS Project

TaskFlow is a comprehensive Project Management SaaS platform designed with a scalable architecture, secure REST APIs, and a premium frontend interface.

## 🚀 Getting Started

This project is divided into two parts:
1.  **Backend** (Node.js/Express)
2.  **Frontend** (React/Vite)

### Prerequisites
-   Node.js (v14+)
-   PostgreSQL Database (Ensure a DB named `taskflow` exists)

### 1. Backend Setup

The backend connects to a PostgreSQL database. You must configure your database credentials.

1.  Navigate to the `backend` folder:
    ```bash
    cd backend
    ```
2.  Install dependencies (already done, but good to ensure):
    ```bash
    npm install
    ```
3.  **Database Config**:
    -   Edit `.env` file in the `backend` folder.
    -   Update `DB_USER`, `DB_PASSWORD` to match your local PostgreSQL setup.
4.  **Database Migration**:
    -   Run the SQL commands in `database.sql` to create the tables.
5.  Start the Server:
    ```bash
    npm run dev
    ```
    Server runs on `http://localhost:5000`.

### 2. Frontend Setup

1.  Navigate to the `frontend` folder:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the Development Server:
    ```bash
    npm run dev
    ```
    Access the app at `http://localhost:5173`.

## 🎨 Features
-   **Authentication**: Secure Register/Login with JWT.
-   **Dashboard**: Manage projects with visual indicators.
-   **Landing Page**: Premium "SaaS-style" landing page.

## ⚠️ Important Note
Since this is a fresh setup, **you MUST provide a valid PostgreSQL connection in `backend/.env`** for the API to work. If the database is not running, the backend will exit with an error.
