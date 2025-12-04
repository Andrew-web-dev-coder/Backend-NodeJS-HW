# Article App — Backend (Node.js + PostgreSQL + Sequelize)

This project is a backend service for managing articles.
It uses Node.js, Express, PostgreSQL, and Sequelize ORM, and supports:

CRUD operations for articles

File uploads (images, PDFs)

WebSocket notifications

Database migrations

Database seeders

JSONB attachments storage

🚀 Features
✔ Fully functional REST API

Articles can be created, updated, listed, and deleted.

✔ PostgreSQL + Sequelize

All data is stored in a relational database.
Migrations & seeders are provided.

✔ File Uploads (Multer)

Uploads stored in /backend/uploads.

✔ Attachments per Article

Stored as JSONB array in PostgreSQL.

✔ WebSockets

Real-time notifications for:

article created

article updated

article deleted

attachment added/removed

🛠 Requirements

Node.js 18+

PostgreSQL 14+

npm or yarn

# Environment Variables

Create a .env file inside /backend:

DB_USER=postgres
DB_PASS=your_password
DB_NAME=auto_articles
DB_HOST=localhost
DB_PORT=5432

# Installation
1. Install dependencies
cd backend
npm install

2. Create the database (if not exists)
CREATE DATABASE auto_articles;

3. Run migrations
npx sequelize-cli db:migrate

4. Run seeders (default BMW/Supra/Audi articles)
npx sequelize-cli db:seed:all

▶ Run the server
npm run dev


You should see:

REST API running at http://localhost:4000
WebSocket server running at ws://localhost:4001

📝 API Endpoints
GET /articles

Get all articles.

GET /articles/:id

Get a single article.

POST /articles

Create an article.

Body:

{
  "title": "New article",
  "content": "Some content"
}

PUT /articles/:id

Update an article.

DELETE /articles/:id

Delete an article.

🗃 Database Schema
Table: articles
Column	Type
id	INTEGER PK
title	VARCHAR(255)
content	TEXT
attachments	JSONB[]
createdAt	TIMESTAMP
updatedAt	TIMESTAMP
🌱 Seed Data (Initial Articles)

The project includes automatic seeding of:

BMW M3 E46

Toyota Supra A80

Audi RS6 Avant

Each with full description.

🧪 Testing in PgAdmin

To verify DB contents:

SELECT * FROM public.articles;


You should see your automotive articles.