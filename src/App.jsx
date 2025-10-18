import React, { useEffect, useState } from "react"
import SearchForm from "./components/SearchForm"
import ResultCard from "./components/ResultCard"

export default function App() {
  const [devices, setDevices] = useState([])
  const [results, setResults] = useState([])
  const [offline, setOffline] = useState(!navigator.onLine)
  const [loading, setLoading] = useState(true)
  const [highlight, setHighlight] = useState([])
  const [darkMode, setDarkMode] = useState(window.matchMedia("(prefers-color-scheme: dark)").matches)

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handler = e => setDarkMode(e.matches)
    mediaQuery.addEventListener("change", handler)
    return () => mediaQuery.removeEventListener("change", handler)
  }, [])

  useEffect(() => {
    fetch("/devices.json")
      .then(res => res.json())
      .then(data => {
        const normalized = data.map(d => ({
          kks: String(d.kks || "").trim().toUpperCase(),
          cap: String(d.cap || "").trim().toUpperCase(),
          tu: String(d.tu || ""),
          ten: String(d.ten || "")
        }))
        setDevices(normalized)
        setLoading(false)
      })
      .catch(err => {
        console.error("Không load được devices.json:", err)
        setLoading(false)
      })

    function onOnline() { setOffline(false) }
    function onOffline() { setOffline(true) }
    window.addEventListener("online", onOnline)
    window.addEventListener("offline", onOffline)
    return () => {
      window.removeEventListener("online", onOnline)
      window.removeEventListener("offline", onOffline)
    }
  }, [])

  // -----------------------------
  // Tra cứu và loại bỏ duplicate
  // -----------------------------
  function handleSearch(q) {
    if (!q) { setResults([]); setHighlight([]); return }
    if (loading) { alert("Dữ liệu đang load, vui lòng chờ..."); return }

    const maArr = q.split(",").map(m => String(m).trim().toUpperCase()).filter(Boolean)
    setHighlight(maArr)

    const filtered = devices.filter(d => maArr.includes(d.kks) || maArr.includes(d.cap))

    // Loại bỏ trùng lặp: key = kks + cap + tu
    const uniqueMap = {}
    filtered.forEach(d => {
      const key = `${d.kks}_${d.cap}_${d.tu}`
      if (!uniqueMap[key]) uniqueMap[key] = d
    })

    setResults(Object.values(uniqueMap))
  }

  // -----------------------------
  // Colors chuẩn iOS
  // -----------------------------
  const bgColor = darkMode ? "#1c1c1e" : "#f7f7f7"
  const cardBgColor = darkMode ? "#2a2a2a" : "white"
  const borderColor = darkMode ? "#3a3a3c" : "#e0e0e0"
  const textColor = darkMode ? "#f5f5f7" : "#222"
  const mutedColor = darkMode ? "#8e8e93" : "#666"

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: bgColor,
      padding: "20px",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      color: textColor
    }}>
      {/* Header */}
      <div className="header" style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
        <div className="logo" style={{
          width: "48px", height: "48px", borderRadius: "12px",
          backgroundColor: "#007bff", color: "white",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontWeight: "bold", fontSize: "20px"
        }}>
          ⚡
        </div>
        <div>
          <h1 style={{ margin: 0, fontSize: "24px", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>IsoFind</h1>
          <div style={{
            color: mutedColor,
            fontSize: "14px",
            fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif",
            fontWeight: 400,
            letterSpacing: "0.5px"
          }}>
            Find & Isolate Fast
          </div>
        </div>
      </div>

      <SearchForm onSearch={handleSearch} darkMode={darkMode} mutedColor={mutedColor} />

      {offline && <div style={{
        padding:"10px 14px",
        marginBottom:12,
        backgroundColor: darkMode ? "#5a3e00" : "#fff3cd",
        borderRadius:"10px",
        color: darkMode ? "#fff" : "#856404"
      }}>⚠️ Đang ở chế độ Offline — dữ liệu cục bộ vẫn dùng được</div>}

      <div style={{ marginTop: 12 }}>
        {loading && <div style={{ fontSize: "16px" }}>Đang load dữ liệu...</div>}

        {!loading && results.length === 0 && (
          <div style={{
            color: mutedColor,
            marginTop: 8,
            padding: "14px",
            borderRadius: "12px",
            backgroundColor: cardBgColor,
            boxShadow: darkMode ? "0 2px 6px rgba(0,0,0,0.4)" : "0 2px 6px rgba(0,0,0,0.08)",
            fontSize: "16px"
          }}>
            Chưa có kết quả. Thử nhập mã KKS hoặc mã cáp.
          </div>
        )}

        {results.map((dev, idx) => (
          <ResultCard key={idx} device={dev} highlight={highlight} darkMode={darkMode} />
        ))}
      </div>

      <footer style={{ color: mutedColor, marginTop: 20, textAlign: "center", fontSize: "14px" }}>
        © IsoFind — By Vận hành 2 - Công ty Nhiệt điện Duyên Hải
      </footer>
    </div>
  )
}
