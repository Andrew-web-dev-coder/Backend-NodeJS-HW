import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function Editor({ value, onChange }) {
  return (
    <div style={{ marginTop: "10px" }}>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        placeholder="Write your article here..."
        style={{ height: "300px", backgroundColor: "white" }}
      />
    </div>
  );
}