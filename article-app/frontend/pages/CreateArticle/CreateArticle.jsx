import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Editor from "../Editor/Editor";
import Button from "../../shared/ui/button/Button";
import * as api from "/src/api/index.js";

export default function CreateArticle() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "application/pdf",
  ];

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);

    for (const file of selected) {
      if (!allowedTypes.includes(file.type)) {
        setErrorMessage(
          `❌ File "${file.name}" is not allowed.
Only images (JPG, PNG, WEBP) and PDF files are accepted.`
        );
        return;
      }
    }

    setFiles(selected);
    setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (title.trim().length < 3) {
      setErrorMessage("Title must be at least 3 characters.");
      return;
    }

    if (content.trim().length < 3) {
      setErrorMessage("Content must be at least 3 characters.");
      return;
    }

    const workspaceId = localStorage.getItem("workspaceId") || null;

    setIsSaving(true);

    try {
      const created = await api.createWithFiles({
        title,
        content,
        files,
        workspaceId, 
      });

      setSuccessMessage("✅ Article created successfully!");
      setTitle("");
      setContent("");
      setFiles([]);

      setTimeout(() => {
        navigate(`/article/${created.id}`);
      }, 800);
    } catch (error) {
      console.error(error);
      setErrorMessage("❌ Could not connect to backend.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Create New Article</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter article title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
            fontSize: "16px",
          }}
        />

        <Editor value={content} onChange={setContent} />

        <div style={{ marginTop: "25px" }}>
          <label style={{ fontWeight: 500 }}>Attach files:</label>

          <div style={{ marginTop: "10px" }}>
            <input
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp,application/pdf"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: "none" }}
            />

            <Button
              type="button"
              onClick={() => fileInputRef.current?.click()}
            >
              Upload files
            </Button>
          </div>

          {files.length > 0 && (
            <ul style={{ marginTop: "10px", fontSize: "14px" }}>
              {files.map((f) => (
                <li key={f.name}>{f.name}</li>
              ))}
            </ul>
          )}
        </div>

        {errorMessage && (
          <p
            style={{
              color: "#b91c1c",
              background: "#fee2e2",
              padding: "8px 12px",
              borderRadius: "8px",
              marginTop: "15px",
              fontWeight: "500",
              whiteSpace: "pre-line",
            }}
          >
            {errorMessage}
          </p>
        )}

        {successMessage && (
          <p
            style={{
              color: "#065f46",
              background: "#d1fae5",
              padding: "8px 12px",
              borderRadius: "8px",
              marginTop: "15px",
              fontWeight: "500",
            }}
          >
            {successMessage}
          </p>
        )}

        <div style={{ textAlign: "left", marginTop: "40px" }}>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </div>
  );
}
