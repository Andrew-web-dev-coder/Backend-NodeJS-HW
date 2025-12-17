import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as api from "../../src/api/index.js";
import Button from "../../shared/ui/button/Button";

import "../../src/ws.js";

export default function ArticleView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  
  const [editing, setEditing] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newFiles, setNewFiles] = useState([]);

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentError, setCommentError] = useState("");

  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentText, setEditingCommentText] = useState("");

  
  useEffect(() => {
    api
      .get(id)
      .then((data) => {
        setArticle(data);
        setComments(data.comments || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load article");
        setLoading(false);
      });
  }, [id]);

  
  const startEdit = () => {
    setEditing(true);
    setNewTitle(article.title);
    setNewContent(article.content);
    setNewFiles([]);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await api.updateWithFiles(article.id, {
        title: newTitle,
        content: newContent,
        files: newFiles,
      });
      setArticle(updated);
      setEditing(false);
      setNewFiles([]);
    } catch {
      setError("Failed to save article");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteArticle = async () => {
    if (!window.confirm("Delete permanently?")) return;
    setDeleting(true);
    try {
      await api.remove(article.id);
      navigate("/");
    } catch {
      setError("Failed to delete article");
      setDeleting(false);
    }
  };

  
  const handleAddComment = async () => {
    if (!commentText.trim()) return;

    setCommentLoading(true);
    try {
      const res = await fetch(
        `http://localhost:4000/articles/${article.id}/comments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: commentText }),
        }
      );

      const created = await res.json();
      setComments((prev) => [created, ...prev]);
      setCommentText("");
    } catch {
      setCommentError("Failed to add comment");
    } finally {
      setCommentLoading(false);
    }
  };

 
  const handleUpdateComment = async (commentId) => {
    try {
      const res = await fetch(
        `http://localhost:4000/comments/${commentId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: editingCommentText }),
        }
      );

      const updated = await res.json();
      setComments((prev) =>
        prev.map((c) => (c.id === commentId ? updated : c))
      );
      setEditingCommentId(null);
      setEditingCommentText("");
    } catch {
      alert("Failed to update comment");
    }
  };

 
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Delete comment?")) return;

    try {
      await fetch(`http://localhost:4000/comments/${commentId}`, {
        method: "DELETE",
      });

      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch {
      alert("Failed to delete comment");
    }
  };

  
  if (loading) return <p style={{ padding: 24 }}>Loading...</p>;
  if (!article) return <p style={{ padding: 24 }}>Not found</p>;

  return (
    <div style={{ padding: 24, maxWidth: 900 }}>
      <h1>{article.title}</h1>

      {editing ? (
        <>
          <input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            style={{ width: "100%", marginBottom: 12 }}
          />
          <textarea
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            style={{ width: "100%", minHeight: 150 }}
          />
          <div style={{ marginTop: 12, display: "flex", gap: 12 }}>
            <Button onClick={handleSave}>
              {saving ? "Saving..." : "Save"}
            </Button>
            <Button onClick={() => setEditing(false)}>Cancel</Button>
          </div>
        </>
      ) : (
        <>
          <div
            dangerouslySetInnerHTML={{ __html: article.content }}
            style={{ margin: "20px 0" }}
          />
          <div style={{ display: "flex", gap: 12 }}>
            <Button onClick={startEdit}>Edit</Button>
            <Button onClick={handleDeleteArticle}>
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </>
      )}

      <hr style={{ margin: "40px 0" }} />
      <h2>Comments</h2>

      {comments.map((c) => (
        <div
          key={c.id}
          style={{
            background: "#f5f5f5",
            padding: 12,
            borderRadius: 8,
            marginBottom: 12,
          }}
        >
          <div style={{ fontSize: 12, opacity: 0.6 }}>
            {new Date(c.createdAt).toLocaleString()}
          </div>

          {editingCommentId === c.id ? (
            <>
              <textarea
                value={editingCommentText}
                onChange={(e) => setEditingCommentText(e.target.value)}
                style={{ width: "100%", marginTop: 8 }}
              />
              <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                <Button onClick={() => handleUpdateComment(c.id)}>
                  Save
                </Button>
                <Button onClick={() => setEditingCommentId(null)}>
                  Cancel
                </Button>
              </div>
            </>
          ) : (
            <>
              <div style={{ marginTop: 8 }}>{c.text}</div>
              <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                <Button
                  onClick={() => {
                    setEditingCommentId(c.id);
                    setEditingCommentText(c.text);
                  }}
                >
                  Edit
                </Button>
                <Button onClick={() => handleDeleteComment(c.id)}>
                  Delete
                </Button>
              </div>
            </>
          )}
        </div>
      ))}

      <div style={{ marginTop: 24 }}>
        <textarea
          placeholder="Write a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          style={{ width: "100%", minHeight: 80 }}
        />
        <Button
          style={{ marginTop: 8 }}
          onClick={handleAddComment}
          disabled={commentLoading}
        >
          {commentLoading ? "Sending..." : "Add comment"}
        </Button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
