import React, { useState } from "react";

export default function SearchForm({ onSearch }) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        gap: "12px",
        marginBottom: "12px",
        flexWrap: "wrap",
        justifyContent: "center",
      }}
    >
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Nhập KKS hoặc CAP"
        style={{
          flex: "1 1 250px",
          padding: "12px 16px",
          borderRadius: "12px",
          border: "1px solid #3a3a3c",
          outline: "none",
          fontSize: "16px",
          backgroundColor: "#2c2c2e",
          color: "#fff",
          boxSizing: "border-box",
        }}
        onFocus={(e) => (e.target.style.borderColor = "#0a84ff")}
        onBlur={(e) => (e.target.style.borderColor = "#3a3a3c")}
      />
      <button
        type="submit"
        style={{
          padding: "12px 20px",
          borderRadius: "12px",
          border: "none",
          background: "linear-gradient(135deg,#0a84ff,#5ac8fa)",
          color: "#fff",
          fontSize: "16px",
          fontWeight: "600",
          cursor: "pointer",
          minWidth: "120px",
          flexShrink: 0,
        }}
      >
        Tìm
      </button>
    </form>
  );
}
