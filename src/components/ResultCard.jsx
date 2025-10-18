import React from "react"

export default function ResultCard({ device, highlight, darkMode }) {
  const bgColor = darkMode ? "#2c2c2e" : "white"
  const borderColor = darkMode ? "#444" : "#e0e0e0"
  const textColor = darkMode ? "#f5f5f7" : "#222"

  // Màu highlight nhạt, trong suốt hơn
  const highlightStyle = {
    backgroundColor: darkMode ? "rgba(255, 229, 77, 0.3)" : "rgba(255, 235, 59, 0.3)",
    borderRadius: "4px",
    padding: "2px 4px"
  }

  const kksHighlighted = highlight.includes(device.kks) ? (
    <span style={highlightStyle}>{device.kks}</span>
  ) : device.kks

  const capHighlighted = highlight.includes(device.cap) ? (
    <span style={{ ...highlightStyle, fontWeight: "600" }}>{device.cap}</span>
  ) : (
    <span style={{ fontWeight: "600", color: textColor }}>{device.cap}</span>
  )

  return (
    <div style={{
      padding: "14px 18px",
      marginBottom: "12px",
      borderRadius: "14px",
      border: `1px solid ${borderColor}`,
      backgroundColor: bgColor,
      boxShadow: darkMode ? "0 3px 8px rgba(0,0,0,0.4)" : "0 3px 8px rgba(0,0,0,0.12)",
      fontSize: "16px",
      lineHeight: "1.5",
    }}>
      <p style={{ margin: 0 }}><strong>KKS:</strong> {kksHighlighted}</p>
      <p style={{ margin: 0 }}><strong>Cap:</strong> {capHighlighted}</p>
      <p style={{ margin: 0 }}><strong>Tủ:</strong> {device.tu}</p>
      <p style={{ margin: 0 }}><strong>Phụ tải:</strong> {device.ten}</p>
    </div>
  )
}
