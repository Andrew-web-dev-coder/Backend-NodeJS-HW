import React from "react";
import { Routes, Route } from "react-router-dom";

import Header from "../../shared/ui/header/Header.jsx";
import ArticlesList from "../../pages/ArticlesList/ArticlesList.jsx";
import ArticleView from "../../pages/ArticleView/ArticleView.jsx";
import CreateArticle from "../../pages/CreateArticle/CreateArticle.jsx";
import Editor from "../../pages/Editor/Editor.jsx";

import { ToastProvider } from "../ToastProvider.jsx";
import "../../src/ws.js"; 

export default function App() {
  return (
    <ToastProvider>
      <Header />
      <Routes>
        <Route path="/" element={<ArticlesList />} />
        <Route path="/article/:id" element={<ArticleView />} />
        <Route path="/create" element={<CreateArticle />} />
        <Route path="/edit/:id" element={<Editor />} />
      </Routes>
    </ToastProvider>
  );
}
