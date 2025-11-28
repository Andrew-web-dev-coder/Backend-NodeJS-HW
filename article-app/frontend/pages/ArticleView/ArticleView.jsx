import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as api from "../../src/api/index.js";
import Button from "../../shared/ui/button/Button";

import "../../src/ws.js";

export default function ArticleView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editing, setEditing] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newFiles, setNewFiles] = useState([]);

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    api
      .get(id)
      .then((data) => {
        setArticle(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load article");
        setLoading(false);
      });
  }, [id]);

  const startEdit = () => {
    if (!article) return;

    setEditing(true);
    setNewTitle(article.title);
    setNewContent(article.content);
    setNewFiles([]);
  };

  const handleSave = async () => {
    if (!article) return;

    setSaving(true);

    try {
      const updated = await api.updateWithFiles(article.id, {
        title: newTitle,
        content: newContent,
        files: newFiles,
      });

      if (!updated || !updated.id) {
        throw new Error("Bad response from server");
      }

      setArticle(updated);
      setEditing(false);
      setSaving(false);
    } catch (e) {
      console.error(e);
      setError("Failed to save article");
      setSaving(false);
    }
  };

  const handleDeleteArticle = async () => {
    if (!window.confirm("Delete permanently?")) return;

    setDeleting(true);
    try {
      await api.remove(article.id);
      navigate("/");
    } catch (e) {
      console.error(e);
      setError("Failed to delete article");
      setDeleting(false);
    }
  };

  const handleRemoveAttachment = async (filename) => {
    if (!window.confirm("Delete this file?")) return;

    try {
      const updated = await api.removeAttachment(article.id, filename);
      if (updated) setArticle(updated);
    } catch (e) {
      console.error(e);
      setError("Error deleting attachment");
    }
  };

  if (loading) return <p style={{ padding: 24 }}>Loading...</p>;
  if (!article) return <p style={{ padding: 24 }}>Not found</p>;

  const isImage = (f) => /\.(jpg|jpeg|png|gif|webp)$/i.test(f.filename);
  const isPdf = (f) => /\.pdf$/i.test(f.filename);

  return (
    <div style={{ padding: "24px" }}>
      <h1>{article.title}</h1>

      
      {Array.isArray(article.attachments) && article.attachments.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          {article.attachments.map((file) => {
            const url = `http://localhost:4000${file.url}`;
            const img = isImage(file);
            const pdf = isPdf(file);

            return (
              <div key={file.filename} style={{ marginBottom: 24 }}>
                
                {img && (
                  <img
                    src={url}
                    alt=""
                    style={{
                      width: "100%",
                      maxHeight: "70vh",
                      objectFit: "cover",
                      borderRadius: 10,
                    }}
                  />
                )}

                
                {pdf && (
                  <div
                    style={{
                      padding: 20,
                      background: "#f5f5f5",
                      borderRadius: 10,
                      textAlign: "center",
                    }}
                  >
                    <p style={{ marginBottom: 10 }}>PDF Document</p>
                    <a
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        padding: "10px 22px",
                        background: "#6d28d9",
                        color: "white",
                        borderRadius: 8,
                        textDecoration: "none",
                        display: "inline-block",
                      }}
                    >
                      Open PDF
                    </a>
                  </div>
                )}

               
                {!img && !pdf && (
                  <div
                    style={{
                      padding: 20,
                      background: "#eee",
                      borderRadius: 10,
                      textAlign: "center",
                    }}
                  >
                    FILE: {file.originalName || file.originalname}
                  </div>
                )}

                
                {editing && (
                  <>
                    <div style={{ marginTop: 8 }}>
                      <a
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          fontSize: 16,
                          marginRight: 12,
                          display: "inline-block",
                        }}
                      >
                        {file.originalName || file.originalname}
                      </a>

                      <Button
                        style={{ marginLeft: 12 }}
                        onClick={() => handleRemoveAttachment(file.filename)}
                      >
                        Delete file
                      </Button>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}

      
      {editing ? (
        <div>
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

          <div style={{ marginTop: 12 }}>
            <label>Attach new files:</label>

            <Button
              type="button"
              onClick={() => document.getElementById("editFileInput").click()}
              style={{ marginLeft: 10 }}
            >
              Upload files
            </Button>

            <input
              id="editFileInput"
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp,application/pdf"
              style={{ display: "none" }}
              onChange={(e) => setNewFiles([...e.target.files])}
            />

            {newFiles.length > 0 && (
              <ul style={{ marginTop: 10 }}>
                {newFiles.map((f) => (
                  <li key={f.name}>{f.name}</li>
                ))}
              </ul>
            )}
          </div>

          <div style={{ marginTop: 12, display: "flex", gap: 12 }}>
            <Button onClick={handleSave}>
              {saving ? "Saving..." : "Save"}
            </Button>
            <Button onClick={() => setEditing(false)}>Cancel</Button>
          </div>
        </div>
      ) : (
        <>
          <div
            dangerouslySetInnerHTML={{ __html: article.content }}
            style={{ margin: "20px 0", lineHeight: 1.6 }}
          />

          <div style={{ display: "flex", gap: 12 }}>
            <Button onClick={startEdit}>Edit</Button>
            <Button onClick={handleDeleteArticle}>
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </>
      )}

      {error && (
        <p style={{ marginTop: 16, color: "red" }}>
          {error}
        </p>
      )}
    </div>
  );
}
