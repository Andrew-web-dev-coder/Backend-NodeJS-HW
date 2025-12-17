import React, { useEffect, useMemo, useState } from "react";
import * as api from "../../src/api/index.js";
import ArticleCard from "../../shared/ui/articleCard/ArticleCard.jsx";

import "../../src/ws.js";

export default function ArticlesList() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [workspaceId, setWorkspaceId] = useState(localStorage.getItem("workspaceId") || "");

  useEffect(() => {
    api.list()
      .then((data) => setArticles(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

 
  useEffect(() => {
    const onWsChange = () => setWorkspaceId(localStorage.getItem("workspaceId") || "");
    window.addEventListener("workspaceChanged", onWsChange);
    window.addEventListener("storage", onWsChange); 
    return () => {
      window.removeEventListener("workspaceChanged", onWsChange);
      window.removeEventListener("storage", onWsChange);
    };
  }, []);

  const filtered = useMemo(() => {
    if (!workspaceId) return articles;
    return articles.filter((a) => String(a.workspaceId) === String(workspaceId));
  }, [articles, workspaceId]);

  if (loading) return <p style={{ padding: 24 }}>Loading...</p>;

  return (
    <section style={{ padding: "24px" }}>
      {filtered.length === 0 ? (
        <p style={{ opacity: 0.7 }}>No articles in this workspace</p>
      ) : (
        <div
          style={{
            display: "grid",
            gap: 12,
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          }}
        >
          {filtered.map((a) => (
            <ArticleCard key={a.id} {...a} />
          ))}
        </div>
      )}
    </section>
  );
}
