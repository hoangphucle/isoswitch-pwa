import React, { useState } from "react"

export default function SearchForm({ onSearch, darkMode, mutedColor }) {
  const [query, setQuery] = useState("")

  function handleSubmit(e) {
    e.preventDefault()
    onSearch(query)
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Nhập mã KKS hoặc mã cáp, ngăn cách bằng dấu ,"
        style={{
          flex: 1,
          padding: "12px 14px",
          borderRadius: "12px",
          border: `1px solid ${darkMode ? "#3a3a3c" : "#ccc"}`,
          backgroundColor: darkMode ? "#2a2a2a" : "white",
          color: darkMode ? "white" : "black",
          fontSize: "16px",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif"
        }}
      />
      <button type="submit" style={{
        padding: "12px 18px",
        borderRadius: "12px",
        border: "none",
        backgroundColor: "#007bff",
        color: "white",
        fontWeight: 600,
        cursor: "pointer",
        fontSize: "16px"
      }}>Search</button>
    </form>
  )
}
