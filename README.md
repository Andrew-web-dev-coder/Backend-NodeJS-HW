# Article App — SQL Database & Versioning Assignment

## Description

This project is a full-stack application developed as part of **Assignment 7: Setting up relationships**.

The main goal of the assignment is to implement **article versioning** on top of an existing SQL-based application.

Each time an article is updated:
- a **new version** is created
- previous versions remain accessible in **read-only mode**
- the UI clearly indicates when an old version is being viewed

---

## Tech Stack

### Backend
- Node.js
- Express
- PostgreSQL
- Sequelize ORM
- sequelize-cli
- Multer (file uploads)

### Frontend
- React
- React Router
- Vite

---

## Implemented Features

### Articles
- create articles
- update articles **with versioning**
- delete articles
- view latest article version
- view older article versions (read-only)

### Article Versioning
- each update creates a new `ArticleVersion`
- latest version is marked as **Latest**
- old versions:
  - are selectable in UI
  - cannot be edited
  - cannot receive new comments
- version list shows:
  - version number
  - creation date
  - active version highlight

### Comments
- add comments to latest article version
- edit and delete comments
- comments are disabled for old versions

### Workspaces
- create and delete workspaces
- assign articles to workspaces
- filter articles by workspace
- “All workspaces” option shows all articles

### Attachments
- files are stored on disk
- metadata is stored in DB
- supported formats: JPG, PNG, WEBP, PDF

---

## Database Structure

### Main tables
- `articles` — article container
- `article_versions` — versioned content
- `comments`
- `workspaces`

### Relationships
- workspace → articles (one-to-many)
- article → article_versions (one-to-many)
- article → comments (one-to-many)

All schema changes are managed via **Sequelize migrations**.  
Initial data is provided via **Sequelize seeders**, including backfilling article versions.

---

## Environment Configuration

Create a `.env` file inside the `backend/` directory:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=auto_articles
DB_USER=postgres
DB_PASS=your_password
