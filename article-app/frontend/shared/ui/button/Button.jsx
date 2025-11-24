import styles from './button.module.css';
import React, { useState } from "react";

export default function Button({ children, ...props }) {
  return (
    <button className={styles.btn} {...props}>
      {children}
    </button>
  );
}
