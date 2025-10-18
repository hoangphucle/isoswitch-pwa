import React from "react"

export default function ResultCard({ device, highlight, darkMode }) {
  const cardBg = darkMode ? "#2a2a2a" : "white"
  const borderColor = darkMode ? "#3a3a3c" : "#e0e0e0"
  const textColor = darkMode ? "#f5f5f7" : "#222"

  const glowStyle = {
    backgroundColor: darkMode ? "rgba(255, 229, 77, 0.2)" : "rgba(255, 235, 59, 0.2)",
    borderRadius: "4px",
    padding: "1px 3px",
    fontWeight: "600",
    boxShadow: darkMode ? "0 0 6px rgba(255,229,77,0.6)" : "0 0 6px rgba(255,235,59,0.6)"
  }

  const kksHighlighted = highlight.includes(device.kks) ? <span style={glowStyle}>{device.kks}</span> : device.kks
  const capHighlighted = highlight.includes(device.cap) ? <span style={glowStyle}>{device.cap}</span> : <span style={{ fontWeight: "600", color: textColor }}>{device.cap}</span>

  return (
    <div style={{
      padding: "14px 18px",
      marginBottom: "12px",
      borderRadius: "14px",
      border: `1px solid ${borderColor}`,
      backgroundColor: cardBg,
      boxShadow: darkMode ? "0 3px 8px rgba(0,0,0,0.4)" : "0 3px 8px rgba(0,0,0,0.12)",
      fontSize: "16px",
      lineHeight: "1.5"
    }}>
      <p style={{ margin: 0 }}><span>⚙️</span> <strong>KKS:</strong> {kksHighlighted}</p>
      <p style={{ margin: 0 }}><span>🔌</span> <strong>Cap:</strong> {capHighlighted}</p>
      <p style={{ margin: 0 }}><span>🗄️</span> <strong>Tủ:</strong> {device.tu}</p>
      <p style={{ margin: 0 }}><span>💡</span> <strong>Phụ tải:</strong> {device.ten}</p>
    </div>
  )
}
