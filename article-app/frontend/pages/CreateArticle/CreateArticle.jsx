import React, { useState, useRef } from "react";
import Editor from "../Editor/Editor";
import Button from "../../shared/ui/button/Button";
import { api } from "../../src/api/index.js";

export default function CreateArticle() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const fileInputRef = useRef(null);

  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"];

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);

    for (const file of selected) {
      if (!allowedTypes.includes(file.type)) {
        setErrorMessage(`❌ Unsupported file: ${file.name}`);
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

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);

    files.forEach((f) => formData.append("files", f));

    setIsSaving(true);

    try {
      await api.postForm(formData);

      setSuccessMessage("✅ Article created successfully!");
      setTitle("");
      setContent("");
      setFiles([]);

      setTimeout(() => {
        window.location.href = "/";
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
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: "none" }}
            />

          
            <Button
              type="button"
              onClick={() => fileInputRef.current.click()}
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
