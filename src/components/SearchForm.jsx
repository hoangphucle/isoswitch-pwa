import React, { useState } from "react"

export default function SearchForm({ onSearch, darkMode, mutedColor }) {
  const [ma, setMa] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    if (onSearch) onSearch(ma)
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: 12, marginBottom: 12, display: "flex", flexWrap: "wrap", gap: "8px" }}>
      <input
        type="text"
        value={ma}
        onChange={(e) => setMa(e.target.value)}
        placeholder="Nhập mã KKS hoặc mã cáp, phân tách bằng dấu phẩy"
        style={{
          flex: "1 1 300px",
          padding: "10px 12px",
          borderRadius: "10px",
          border: `1px solid ${darkMode ? "#444" : "#ccc"}`,
          fontSize: "16px",
          outline: "none",
          color: darkMode ? "#f5f5f7" : "#222",
          backgroundColor: darkMode ? "#2c2c2e" : "white",
          boxShadow: darkMode ? "inset 0 1px 2px rgba(255,255,255,0.05)" : "inset 0 1px 2px rgba(0,0,0,0.1)"
        }}
      />
      <button
        type="submit"
        style={{
          padding: "10px 16px",
          borderRadius: "10px",
          border: "none",
          backgroundColor: "#007bff",
          color: "white",
          fontSize: "16px",
          cursor: "pointer",
          boxShadow: "0 2px 6px rgba(0,0,0,0.15)"
        }}
      >
        Tra cứu
      </button>
    </form>
  )
}
