🚗 Auto Articles — Full-Stack Node.js + React App
- Overview

A simple full-stack application for managing car-related articles.
Users can:

View a list of existing articles

Open and read a specific article

Create new articles using a WYSIWYG editor

The frontend is built with React + Vite,
and the backend uses Node.js + Express, storing data as JSON files.

* Tech Stack

Frontend: React, React Router, React Quill, Vite
Backend: Node.js, Express, FS
Other: concurrently (to run both servers together)

* Setup & Run Instructions

Install dependencies

npm install


Run only the backend

npm run start:backend


Backend server runs at http://localhost:4000

Run only the frontend

npm run start:frontend


App starts at http://localhost:5173

(Vite may choose another port if it’s already in use)

Run both frontend and backend together

npm run start:all


Both servers start concurrently using concurrently.

* Validation & Error Handling

Backend validates title and content (required and minimum length).

Returns 400 Bad Request with a JSON error if validation fails.

Frontend shows user-friendly messages for errors instead of plain alerts.

* API Endpoints
Method	Route	Description
GET	/articles	Get all saved articles
GET	/articles/:id	Get a specific article by ID
POST	/articles	Create a new article