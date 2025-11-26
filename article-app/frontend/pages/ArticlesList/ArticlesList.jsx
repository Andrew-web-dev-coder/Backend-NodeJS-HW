import React, { useEffect, useState } from "react";
import * as api from "../../src/api/index.js";

import ArticleCard from "../../shared/ui/articleCard/ArticleCard.jsx";


import "../../src/ws.js";

export default function ArticlesList() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    api.list().then(setArticles);
  }, []);

  return (
    <section>
      <h1></h1>

      <div
        style={{
          display: "grid",
          gap: 12,
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
        }}
      >
        {articles.map((a) => (
          <ArticleCard key={a.id} {...a} />
        ))}
      </div>
    </section>
  );
}
