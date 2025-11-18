import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../src/api/index.js";
import Button from "../../shared/ui/button/Button";

export default function ArticleView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  
  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError("");

    api
      .get(id)
      .then((data) => {
        if (!cancelled) setArticle(data);
      })
      .catch(() => {
        if (!cancelled) setError("Failed to load article");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleEdit = async () => {
    if (!article) return;

    const newTitle = window.prompt("Edit title:", article.title);
    if (newTitle === null) return; 

    const newContent = window.prompt("Edit content:", article.content);
    if (newContent === null) return;

    setSaving(true);
    setError("");

    try {
      const updated = await api.update(article.id, {
        title: newTitle,
        content: newContent,
      });
      setArticle(updated);
    } catch (e) {
      console.error(e);
      setError("Failed to update article");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!article) return;
    const ok = window.confirm("Delete this article permanently?");
    if (!ok) return;

    setDeleting(true);
    setError("");

    try {
      await api.remove(article.id);
      
      navigate("/");
    } catch (e) {
      console.error(e);
      setError("Failed to delete article");
      setDeleting(false);
    }
  };

  if (loading) {
    return <p style={{ padding: 24 }}>Loading...</p>;
  }

  if (error) {
    return (
      <div style={{ padding: 24 }}>
        <p style={{ color: "#b91c1c" }}>{error}</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div style={{ padding: 24 }}>
        <p>Article not found.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "24px" }}>
      <h1 style={{ marginBottom: "16px" }}>{article.title}</h1>

      <div
        style={{ marginBottom: "32px", lineHeight: 1.6 }}
        
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      <div style={{ display: "flex", gap: "12px" }}>
        <Button type="button" onClick={handleEdit} disabled={saving || deleting}>
          {saving ? "Saving..." : "Edit"}
        </Button>

        <Button
          type="button"
          onClick={handleDelete}
          disabled={saving || deleting}
        >
          {deleting ? "Deleting..." : "Delete"}
        </Button>
      </div>
    </div>
  );
}
