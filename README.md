# 🚗 Auto Articles — Full-Stack Node.js + React App

##  Overview

A simple full-stack application for managing car-related articles.

Users can:
- View a list of existing articles  
- Open and read a specific article  
- Create new articles using a WYSIWYG editor  

The **frontend** is built with **React + Vite**,  
and the **backend** uses **Node.js + Express**, storing data as JSON files.

---

## Tech Stack

**Frontend:** React, React Router, React Quill, Vite  
**Backend:** Node.js, Express, FS  
**Other:** concurrently (to run both servers together)

---

##  Setup & Run Instructions

### №1️ Clone the repository and open the project
```bash
git clone <repo-url>
cd article-app
№2 Install dependencies
Install for both backend and frontend:

bash

cd backend
npm install

cd ../frontend
npm install
№3 Run the backend only
bash

cd backend
node server.js
✅ Runs on: http://localhost:4000

№4 Run the frontend only
bash

cd frontend
npm run dev
✅ Opens on: http://localhost:5173
(If the port is busy, Vite will choose another one automatically)

№5 Run both together (from project root)
bash
Копировать код
npm run start:all
This uses concurrently to launch both frontend and backend.

✅ Validation & Error Handling
The backend validates input:
title and content are required fields.
Returns 400 Bad Request if validation fails.

Frontend displays user-friendly messages when errors occur.

--- API Endpoints
Method	Route	Description
GET	/articles	Get all saved articles
GET	/articles/:id	Get a specific article by ID
POST	/articles	Create a new article

--- Development Notes
If you see “Cannot find package ‘express’” or missing dependencies, make sure to:

bash
cd backend && npm install
cd ../frontend && npm install