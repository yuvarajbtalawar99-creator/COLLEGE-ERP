# 🚀 College ERP - First Time Setup Guide

Welcome to the **College ERP** project! This guide will walk you through the entire setup process, from cloning the code to getting the database and application running on your local machine.

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18.x or higher)
- **Git**
- **XAMPP** (for MySQL and phpMyAdmin)

---

## 🛠️ Step 1: Clone the Repositories

You will need both the frontend and backend repositories. Open your terminal and run:

### Frontend
```bash
git clone <frontend-repo-url>
cd College-ERP-Frontend
```

### Backend
```bash
git clone <backend-repo-url>
cd College-ERP-Backend
```

---

## 🗄️ Step 2: Database Setup (XAMPP)

1.  **Start XAMPP**: Open the XAMPP Control Panel and start **Apache** and **MySQL**.
2.  **Open phpMyAdmin**: Go to [http://localhost/phpmyadmin](http://localhost/phpmyadmin) in your browser.
3.  **Create Database**:
    *   Click on **New** in the left sidebar.
    *   Set the database name to: `erp_system`
    *   Click **Create**.

---

## ⚙️ Step 3: Backend Configuration

Open the `College-ERP-Backend` folder in your terminal.

1.  **Install Dependencies**:
    ```bash
    npm install
    ```
2.  **Environment Variables**:
    *   Check the `.env` file. Ensure `DATABASE_URL` matches your MySQL setup:
        ```env
        DATABASE_URL="mysql://root:@localhost:3306/erp_system"
        ```
3.  **Prisma Migrations**:
    Run these commands to sync your database schema:
    ```bash
    # Generate Prisma Client
    npx prisma generate

    # Run migrations to create tables
    npx prisma migrate dev --name init
    ```
4.  **Seed Data (Optional but Recommended)**:
    If there is initial data to load:
    ```bash
    npx prisma db seed
    ```
5.  **Start Backend Server**:
    ```bash
    npm run dev
    ```
    > The backend will typically run on `http://localhost:5000` (check your console output).

---

## 🖥️ Step 4: Frontend Configuration

Open the `College-ERP-Frontend` folder in a new terminal tab.

1.  **Install Dependencies**:
    ```bash
    npm install
    ```
2.  **Start Development Server**:
    ```bash
    npm run dev
    ```
3.  **Access the App**:
    Open your browser and go to:
    👉 **[http://localhost:5173](http://localhost:5173)**

---

## 🆘 Troubleshooting

> [!TIP]
> **Prisma Errors?**
> If `npx prisma migrate dev` fails, make sure MySQL is running in XAMPP and the database `erp_system` exists.
> 
> **Port Conflicts?**
> If port `5173` or `5000` is already in use, you can kill the process or change the port in `vite.config.ts` (frontend) or `src/server.ts` (backend).

---

Happy Coding! 💻✨
