import React from "react";
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from "../../src/api/index.js";

export default function ArticleView() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);

  useEffect(() => {
    api.get(id).then(setArticle);
  }, [id]);

  if (!article) return <p>Loading...</p>;

  return (
    <article>
      <h1>{article.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: article.content }} />
    </article>
  );
}
