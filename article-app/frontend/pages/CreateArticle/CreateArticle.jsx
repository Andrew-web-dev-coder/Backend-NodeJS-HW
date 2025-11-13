import React, { useState } from "react";
import Editor from "../Editor/Editor";
import Button from "../../shared/ui/button/Button";

export default function CreateArticle() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); 
  const [successMessage, setSuccessMessage] = useState(""); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!title.trim() || !content.trim()) {
      setErrorMessage(" Both title and content are required.");
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch("http://localhost:4000/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("✅ Article created successfully!");
        setTitle("");
        setContent("");

        
        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
      } else if (response.status === 400) {
        setErrorMessage(`Validation error: ${data.error}`);
      } else {
        setErrorMessage("❌ Unexpected server error.");
      }
    } catch (error) {
      console.error(error);
      setErrorMessage(" Could not connect to backend.");
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

        <div style={{ textAlign: "left", marginTop: "43px" }}>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </div>
  );
}
