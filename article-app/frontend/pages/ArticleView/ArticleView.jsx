import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../src/api/index.js";
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
      .then(setArticle)
      .catch(() => setError("Failed to load article"))
      .finally(() => setLoading(false));
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
    } catch (e) {
      console.error(e);
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
      setArticle(updated);
    } catch (e) {
      console.error(e);
      setError("Error deleting attachment");
    }
  };

  if (loading) return <p style={{ padding: 24 }}>Loading...</p>;
  if (!article) return <p style={{ padding: 24 }}>Not found</p>;

  const isImage = (f) => /\.(jpg|jpeg|png|gif|webp)$/i.test(f.filename);

  return (
    <div style={{ padding: "24px" }}>
      <h1>{article.title}</h1>

   
      {article.attachments?.length > 0 && (
        <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
          {article.attachments.map((file) => {
            const url = `http://localhost:4000${file.url}`;

            return (
              <div
                key={file.filename}
                style={{
                  background: "white",
                  padding: 10,
                  borderRadius: 6,
                  minWidth: 200,
                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                  textAlign: "center",
                }}
              >
                {isImage(file) ? (
                  <img
                    src={url}
                    style={{ width: "100%", borderRadius: 6 }}
                    alt=""
                  />
                ) : (
                  <div style={{ padding: 20, background: "#eee" }}>FILE</div>
                )}

                <a href={url} target="_blank" rel="noreferrer">
                  {file.originalName}
                </a>

                
                {editing && (
                  <Button
                    style={{ marginTop: 10 }}
                    onClick={() => handleRemoveAttachment(file.filename)}
                  >
                    Delete file
                  </Button>
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
              onClick={() =>
                document.getElementById("editFileInput").click()
              }
              style={{ marginLeft: 10 }}
            >
              Upload files
            </Button>

            <input
              id="editFileInput"
              type="file"
              multiple
              style={{ display: "none" }}
              onChange={(e) => setNewFiles([...e.target.files])}
            />

            {newFiles.length > 0 && (
              <ul>
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
