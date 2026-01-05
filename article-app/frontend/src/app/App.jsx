import React from "react";
import { Routes, Route } from "react-router-dom";

import Header from "../../shared/ui/header/Header.jsx";

import ArticlesList from "../../pages/ArticlesList/ArticlesList.jsx";
import ArticleView from "../../pages/ArticleView/ArticleView.jsx";
import CreateArticle from "../../pages/CreateArticle/CreateArticle.jsx";
import Editor from "../../pages/Editor/Editor.jsx";

import Login from "../../pages/Login/Login.jsx";
import Register from "../../pages/Register/Register.jsx";
import UserManagement from "../../pages/UserManagement/UserManagement.jsx";

import { ToastProvider } from "../ToastProvider.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";

export default function App() {
  return (
    <ToastProvider>
      <Routes>
        {/* ===== PUBLIC ===== */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ===== PROTECTED ===== */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <>
                <Header />
                <ArticlesList />
              </>
            </ProtectedRoute>
          }
        />

        <Route
          path="/article/:id"
          element={
            <ProtectedRoute>
              <>
                <Header />
                <ArticleView />
              </>
            </ProtectedRoute>
          }
        />

        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <>
                <Header />
                <CreateArticle />
              </>
            </ProtectedRoute>
          }
        />

        <Route
          path="/edit/:id"
          element={
            <ProtectedRoute>
              <>
                <Header />
                <Editor />
              </>
            </ProtectedRoute>
          }
        />

        {/* ===== ADMIN ONLY ===== */}
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute adminOnly>
              <>
                <Header />
                <UserManagement />
              </>
            </ProtectedRoute>
          }
        />
      </Routes>
    </ToastProvider>
  );
}
