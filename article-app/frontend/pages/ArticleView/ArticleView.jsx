import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as api from "../../src/api/index.js";
import Button from "../../shared/ui/button/Button";

import "../../src/ws.js";

export default function ArticleView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [article, setArticle] = useState(null);
  const [versions, setVersions] = useState([]);
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [isReadOnly, setIsReadOnly] = useState(false);

  const [editing, setEditing] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newFiles, setNewFiles] = useState([]);

  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =========================
     Initial load
  ========================= */
  useEffect(() => {
    async function load() {
      try {
        const data = await api.get(id);
        setArticle(data);
        setComments(data.comments || []);
        setSelectedVersion(data.version);
        setIsReadOnly(false);

        const vers = await api.listVersions(id);
        setVersions(vers);
      } catch {
        setError("Failed to load article");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  /* =========================
     Version switch
  ========================= */
  const handleSelectVersion = async (version) => {
    try {
      const latestVersion = versions[0]?.version;

      if (version === latestVersion) {
        const data = await api.get(id);
        setArticle(data);
        setComments(data.comments || []);
        setIsReadOnly(false);
      } else {
        const oldVersion = await api.getVersion(id, version);

        setArticle((prev) => ({
          ...prev,
          title: oldVersion.title,
          content: oldVersion.content,
          attachments: oldVersion.attachments || [],
        }));

        setIsReadOnly(true);
        setEditing(false);
      }

      setSelectedVersion(version);
    } catch {
      setError("Failed to load version");
    }
  };

  /* =========================
     Edit / Save
  ========================= */
  const startEdit = () => {
    if (isReadOnly) return;

    setEditing(true);
    setNewTitle(article.title);
    setNewContent(article.content);
    setNewFiles([]);
  };

  const handleSave = async () => {
    try {
      const updated = await api.updateWithFiles(id, {
        title: newTitle,
        content: newContent,
        files: newFiles,
      });

      setArticle(updated);
      setSelectedVersion(updated.version);
      setIsReadOnly(false);
      setEditing(false);

      const vers = await api.listVersions(id);
      setVersions(vers);
    } catch {
      setError("Failed to save article");
    }
  };

  /* =========================
     Delete article
  ========================= */
  const handleDeleteArticle = async () => {
    if (!window.confirm("Delete permanently?")) return;
    await api.remove(id);
    navigate("/");
  };

  /* =========================
     Comments
  ========================= */
  const handleAddComment = async () => {
    if (!commentText.trim()) return;

    const res = await fetch(
      `http://localhost:4000/articles/${id}/comments`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: commentText }),
      }
    );

    const created = await res.json();
    setComments((prev) => [created, ...prev]);
    setCommentText("");
  };

  /* =========================
     Helpers
  ========================= */
  const isImage = (f) => /\.(jpg|jpeg|png|gif|webp)$/i.test(f.filename);
  const isPdf = (f) => /\.pdf$/i.test(f.filename);

  if (loading) return <p style={{ padding: 24 }}>Loading...</p>;
  if (!article) return <p style={{ padding: 24 }}>Not found</p>;

  const latestVersion = versions[0]?.version;

  return (
    <div style={{ padding: 24, maxWidth: 1600 }}>
      {/* ================= Versions ================= */}
      <div style={{ marginBottom: 20 }}>
        <strong>Versions:</strong>
        <div style={{ marginTop: 8, display: "flex", gap: 8, flexWrap: "wrap" }}>
          {versions.map((v) => {
            const isActive = v.version === selectedVersion;
            const isLatest = v.version === latestVersion;

            return (
              <Button
                key={v.version}
                onClick={() => handleSelectVersion(v.version)}
                style={{
                  background: isActive ? "#6d28d9" : "#e0e0e0",
                  color: isActive ? "#fff" : "#000",
                }}
              >
                v{v.version} ({new Date(v.createdAt).toLocaleString()})
                {isLatest && (
                  <span
                    style={{
                      marginLeft: 6,
                      background: "#00b894",
                      color: "#fff",
                      padding: "2px 6px",
                      borderRadius: 6,
                      fontSize: 12,
                    }}
                  >
                    Latest
                  </span>
                )}
              </Button>
            );
          })}
        </div>

        {isReadOnly && (
          <div style={{ marginTop: 8, color: "orange" }}>
            Viewing old version (read-only)
          </div>
        )}
      </div>

      {/* ================= Article ================= */}
      <h1>{article.title}</h1>

      {/* ================= Attachments ================= */}
      {Array.isArray(article.attachments) &&
        article.attachments.length > 0 && (
          <div style={{ marginBottom: 32 }}>
            {article.attachments.map((file) => {
              const url = `http://localhost:4000${file.url}`;

              return (
                <div key={file.filename} style={{ marginBottom: 24 }}>
                  {isImage(file) && (
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

                  {isPdf(file) && (
                    <a href={url} target="_blank" rel="noreferrer">
                      Open PDF
                    </a>
                  )}

                  {!isImage(file) && !isPdf(file) && (
                    <a href={url} target="_blank" rel="noreferrer">
                      {file.originalname}
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        )}

      {/* ================= Content ================= */}
      {editing ? (
        <>
          <input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            style={{ width: "115%", marginBottom: 12 }}
          />
          <textarea
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            style={{ width: "115%", minHeight: 150 }}
          />

          <div style={{ marginTop: 12 }}>
            <Button
              type="button"
              onClick={() => document.getElementById("fileInput").click()}
            >
              Upload files
            </Button>

            <input
              id="fileInput"
              type="file"
              multiple
              style={{ display: "none" }}
              onChange={(e) => setNewFiles([...e.target.files])}
            />
          </div>

          <div style={{ marginTop: 12, display: "flex", gap: 12 }}>
            <Button onClick={handleSave}>Save</Button>
            <Button onClick={() => setEditing(false)}>Cancel</Button>
          </div>
        </>
      ) : (
        <>
          <div
            dangerouslySetInnerHTML={{ __html: article.content }}
            style={{ margin: "20px 0" }}
          />

          {!isReadOnly && (
            <div style={{ display: "flex", gap: 12 }}>
              <Button onClick={startEdit}>Edit</Button>
              <Button onClick={handleDeleteArticle}>Delete</Button>
            </div>
          )}
        </>
      )}

      {/* ================= Comments ================= */}
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
          <div style={{ marginTop: 8 }}>{c.text}</div>
        </div>
      ))}

      {!isReadOnly && (
        <div style={{ marginTop: 24 }}>
          <textarea
            placeholder="Write a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            style={{ width: "100%", minHeight: 80 }}
          />
          <Button style={{ marginTop: 8 }} onClick={handleAddComment}>
            Add comment
          </Button>
        </div>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
