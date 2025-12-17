# Article App — SQL DB Assignment

## 📌 Description

This project is a full-stack application developed as part of **Assignment 6: Work with SQL DB**.  
The goal of the assignment is to refactor the application so that **articles and comments are persisted in a SQL database**, and to introduce **workspaces** for grouping articles.

The application allows users to:
- Create, view, edit, and delete articles
- Add comments to articles
- Attach files to articles
- Group articles into workspaces and switch between them

---

## 🛠 Tech Stack

### Backend
- **Node.js**
- **Express**
- **PostgreSQL**
- **Sequelize ORM**
- **Multer** (file uploads)

### Frontend
- **React**
- **React Router**
- **React Quill** (rich text editor)
- **Vite**


##  Implemented Features

### Articles
- Create article with title, rich text content, attachments, and workspace
- Read article with comments
- Update article
- Delete article

### Comments
- Add comments to articles
- Display comments when viewing an article
- Edit and delete comments

### Workspaces
- Create and delete workspaces
- Assign articles to a workspace
- Switch between workspaces
- Filter articles by selected workspace
- "All workspaces" option shows all articles

### Attachments
- File uploads are handled as files (not stored in DB)
- Supported formats: JPG, PNG, WEBP, PDF

---

## 🗄 Database

### Main tables:
- `articles`
- `comments`
- `workspaces`

Relationships:
- Article → Workspace (many-to-one)
- Comment → Article (many-to-one)

All database changes are managed via **Sequelize migrations**.

---

## 🚀 How to Run the Project

### 1. Install dependencies
From the root directory:
```bash
npm install
2. Configure environment variables
Create a .env file inside backend/:

env

DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=auto_articles
DB_PORT=5432
3. Run migrations
bash

cd backend
npx sequelize-cli db:migrate
4. Start backend and frontend together
From the root directory:

bash

npm run start:all
Backend runs on: http://localhost:4000

Frontend runs on: http://localhost:5173

* Assignment Requirements Coverage
Requirement	Status
Articles persisted in DB	✅
Comments persisted in DB	✅
CRUD for articles	✅
CRUD for comments	✅
Workspaces implemented	✅
UI workspace switching	✅
Attachments handled as files	✅
Clean project structure	✅
Migrations provided	✅