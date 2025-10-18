import React, { useState } from "react";

export default function SearchForm({ onSearch }) {
  const [query, setQuery] = useState("");

  const handleChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    onSearch(val);
  };

  return (
    <div style={{ width: "100%", maxWidth: "600px", marginBottom: "12px" }}>
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="VD: 33MAV61AN001 hoặc 33BMB1016"
        style={{
          width: "100%",
          padding: "12px 16px",
          fontSize: "16px",
          borderRadius: "12px",
          border: "1px solid #555",
          outline: "none",
          color: "#fff",
          backgroundColor: "#1c1c1e",
          boxSizing: "border-box",
        }}
      />
    </div>
  );
}
