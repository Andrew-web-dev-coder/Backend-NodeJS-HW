# Article App — SQL DB Assignment

## Description

This project is a full-stack application developed as part of **Assignment: Work with SQL Database**.

The main goal of the assignment is to:

# persist articles, comments, and workspaces in a SQL database  
# use Sequelize ORM with migrations and seeders  
# follow a clean layered architecture (routes → controllers → services)  
# properly document database setup and initialization steps  

The application allows users to:

# create, view, edit, and delete articles  
# add, edit, and delete comments  
# upload file attachments for articles  
# group articles into workspaces and switch between them  

---

## Tech Stack

### Backend

# Node.js  
# Express  
# PostgreSQL  
# Sequelize ORM  
# sequelize-cli  
# Multer (file uploads)  

### Frontend

# React  
# React Router  
# Vite  

---

## Implemented Features

### Articles

# create article with title, content, attachments, and workspace  
# read article with related comments  
# update article  
# delete article  

### Comments

# add comments to articles  
# edit and delete comments  
# comments are ordered by creation date  

### Workspaces

# create and delete workspaces  
# assign articles to workspaces  
# switch between workspaces  
# filter articles by selected workspace  
# “All workspaces” option shows all articles  

### Attachments

# files are stored on disk (not in DB)  
# file metadata is stored in DB  
# supported formats: JPG, PNG, WEBP, PDF  

---

## Database

### Main tables

# articles  
# comments  
# workspaces  

### Relationships

# workspace → articles (one-to-many)  
# article → comments (one-to-many)  

All schema changes are managed using Sequelize migrations.  
Initial data is provided via Sequelize seeders.

---

## Environment Configuration

Create a `.env` file inside the `backend/` directory:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=auto_articles
DB_USER=postgres
DB_PASS=your_password
Note
The configuration uses DB_PASS (not DB_PASSWORD), as expected by the application config.

How to Run the Project
1. Install dependencies

npm install
2. Create the database

cd backend
npx sequelize-cli db:create
3. Run migrations

npx sequelize-cli db:migrate
4. Seed the database (initial articles)


npx sequelize-cli db:seed:all
This will insert default articles into the database
5. Optional: Full database reset


npm run db:reset
Drops database, recreates it, runs migrations, and seeds
6. Start the application

npm run start:all
Backend: http://localhost:4000
Frontend: http://localhost:5173
Project Architecture
The backend follows a layered architecture:


routes → controllers → services → models
Routes
only define HTTP endpoints and middleware
Controllers
handle request/response logic
Services
contain business logic and DB access
Models
Sequelize models and associations
This ensures consistency, testability, and separation of concerns.

