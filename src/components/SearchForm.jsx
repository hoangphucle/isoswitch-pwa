import React, { useState } from "react";

export default function SearchForm({ onSearch }) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
      <input
        type="text"
        placeholder="Nhập KKS hoặc CAP..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{
          flex: 1,
          padding: "10px 12px",
          borderRadius: "12px",
          border: "1px solid #3a3a3c",
          backgroundColor: "#2c2c2e",
          color: "#fff",
          fontSize: "14px",
        }}
      />
      <button
        type="submit"
        style={{
          ...{
            padding: "10px 18px",
            borderRadius: "12px",
            border: "none",
            backgroundColor: "#0a84ff",
            color: "#fff",
            fontWeight: "500",
            cursor: "pointer",
          }
        }}
      >
        Search
      </button>
    </form>
  );
}
