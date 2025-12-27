import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as api from "../../src/api/index.js";
import Button from "../../shared/ui/button/Button";

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

  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  
  useEffect(() => {
    async function load() {
      try {
        const data = await api.get(id);
        setArticle(data);
        setComments(data.comments || []);
        setSelectedVersion(data.version);
        setIsReadOnly(false);

        const versionsRes = await fetch(
          `http://localhost:4000/articles/${id}/versions`
        );
        const versionsData = await versionsRes.json();
        setVersions(versionsData);
      } catch {
        setError("Failed to load article");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

 
  const handleSelectVersion = async (version) => {
    try {
      const latestVersion = versions[0]?.version;

      if (version === latestVersion) {
        const data = await api.get(id);
        setArticle(data);
        setComments(data.comments || []);
        setIsReadOnly(false);
      } else {
        const res = await fetch(
          `http://localhost:4000/articles/${id}/versions/${version}`
        );
        const oldVersion = await res.json();

        setArticle({
          ...article,
          title: oldVersion.title,
          content: oldVersion.content,
        });

        setIsReadOnly(true);
        setEditing(false);
      }

      setSelectedVersion(version);
    } catch {
      alert("Failed to load version");
    }
  };

  
  const startEdit = () => {
    setEditing(true);
    setNewTitle(article.title);
    setNewContent(article.content);
  };

  const handleSave = async () => {
    try {
      const updated = await api.updateWithFiles(id, {
        title: newTitle,
        content: newContent,
      });

      setArticle(updated);
      setSelectedVersion(updated.version);
      setIsReadOnly(false);
      setEditing(false);
    } catch {
      setError("Failed to save article");
    }
  };

  
  const handleDeleteArticle = async () => {
    if (!window.confirm("Delete permanently?")) return;
    await api.remove(id);
    navigate("/");
  };

  
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

  if (loading) return <p style={{ padding: 24 }}>Loading...</p>;
  if (!article) return <p style={{ padding: 24 }}>Not found</p>;

  const latestVersion = versions[0]?.version;

  return (
    <div style={{ padding: 24, maxWidth: 900 }}>
      {/* ===== Versions UI ===== */}
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
                  background: isActive ? "#6c5ce7" : "#e0e0e0",
                  color: isActive ? "#fff" : "#000",
                  position: "relative",
                }}
              >
                v{v.version} (
                {new Date(v.createdAt).toLocaleString()})
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
