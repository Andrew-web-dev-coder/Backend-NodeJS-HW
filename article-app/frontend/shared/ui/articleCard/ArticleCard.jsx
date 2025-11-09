import React from "react";
import { Link } from "react-router-dom";
import styles from "./articleCard.module.css";
import Button from "../button/Button"; 

export default function ArticleCard({ id, title }) {
  return (
    <div className={styles.card}>
      <div className={styles.icon}>🚗</div>
      <h3 className={styles.title}>{title}</h3>

      <Link to={`/article/${id}`} style={{ textDecoration: "none" }}>
        <Button>Open →</Button>
      </Link>
    </div>
  );
}
