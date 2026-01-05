# Article App — Role-Based Access Control & User Management

## Description

This project is a full-stack application developed as part of **Assignment 9: User Management**.

The goal of this assignment is to introduce a **role-based access control (RBAC)** system into an existing SQL-based article application.

Each user has a role (`admin` or `user`) which determines:

- access to protected routes
- ability to edit articles
- visibility of admin-only UI sections

Additionally, a **User Management** page is implemented to allow administrators to manage user roles.

---

## Tech Stack

### Backend
- Node.js
- Express
- PostgreSQL
- Sequelize ORM
- sequelize-cli
- JWT Authentication
- Multer (file uploads)

### Frontend
- React
- React Router
- Vite

---

## Implemented Features

### Role System
- each user has a `role` field (`admin` or `user`)
- role is stored in the database
- role is embedded into JWT token on login
- role is available on backend via `req.user`

---

### Article Permissions (RBAC)
- only the **article creator** or an **admin** can edit an article
- unauthorized edit attempts are blocked on backend
- frontend hides edit controls for unauthorized users
- backend enforces permissions regardless of frontend state

---

### User Management Page (Admin Only)
- accessible only to users with `admin` role
- regular users cannot see or access the page
- displays a list of all registered users
- shows current role for each user
- admins can change roles of **other users**
- admins **cannot change their own role** (protected by backend)

---

### Frontend Role-Based Visibility
- admin-only navigation links are hidden for regular users
- protected routes redirect unauthorized users
- UI dynamically reacts to current user role

---

## Security & Access Control

### Backend Enforcement
- all protected routes require authentication
- admin-only routes validate `req.user.role === "admin"`
- role checks are centralized and enforced server-side

### Frontend Enforcement
- role-based UI rendering
- protected routes via `ProtectedRoute` component
- backend remains the source of truth for permissions

---

## Database Structure

### Users Table
- `id`
- `email`
- `password`
- `role` (`admin` | `user`)
- `createdAt`
- `updatedAt`

### Articles
- each article is linked to its creator via `userId`
- permissions are validated against this relationship

All schema changes are managed via **Sequelize migrations**.

---

## Environment Configuration

Create a `.env` file inside the `backend/` directory:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=auto_articles
DB_USER=postgres
DB_PASS=your_password
JWT_SECRET=your_secret_key
