import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SearchForm from "./components/SearchForm";
import ResultCard from "./components/ResultCard";
import "./components/Button.css";

// nút chuẩn iOS
const iosButtonStyle = ({ active = false, color = "#0a84ff" }) => ({
  padding: "16px 20px",
  borderRadius: "16px",
  border: "none",
  fontSize: "16px",
  fontWeight: "500",
  color: "#fff",
  background: active ? color : "#3a3a3c",
  boxShadow: active
    ? "0 4px 12px rgba(0,0,0,0.3)"
    : "0 2px 6px rgba(0,0,0,0.2)",
  cursor: "pointer",
  transition: "transform 0.15s ease-in-out, box-shadow 0.15s ease-in-out",
  outline: "none",
  userSelect: "none",
  flex: 1,
  textAlign: "center",
});

// hiệu ứng nhấn giống iPhone
const iosButtonPress = (e) => {
  e.currentTarget.style.transform = "scale(0.95)";
  e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.3)";
};
const iosButtonRelease = (e) => {
  e.currentTarget.style.transform = "scale(1)";
  e.currentTarget.style.boxShadow = "";
};

// ripple effect (nếu muốn giữ)
const createRipple = (e) => {
  const button = e.currentTarget;
  const circle = document.createElement("span");
  circle.className = "ripple";
  const rect = button.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  circle.style.width = circle.style.height = size + "px";
  circle.style.left = e.clientX - rect.left - size / 2 + "px";
  circle.style.top = e.clientY - rect.top - size / 2 + "px";
  button.appendChild(circle);
  setTimeout(() => circle.remove(), 600);
};

export default function App() {
  const [layer, setLayer] = useState("mode"); // mode / ciSelect / searchDevice / searchCI
  const [ciSheet, setCiSheet] = useState("lo"); // lo / may / ecb

  const [devices, setDevices] = useState([]);
  const [cis, setCIs] = useState({ lo: [], may: [], ecb: [] });
  const [results, setResults] = useState([]);
  const [highlight, setHighlight] = useState([]);
  const [offline, setOffline] = useState(!navigator.onLine);
  const [loading, setLoading] = useState(true);

  const normalize = (d) => ({
    kks: String(d.kks || d.KKS || "").toUpperCase().trim(),
    cap: String(d.cap || d.CAP || "").toUpperCase().trim(),
    macb: String(d.macb || d.CB || "").toUpperCase().trim(),
    ten: String(d.ten || d.NAME || "").toUpperCase().trim(),
    vitri: String(d.vitri || d["VỊ TRÍ"] || "").toUpperCase().trim(),
    tu: String(d.tu || d["TỦ"] || "").toUpperCase().trim(),
    thanhcai: String(d.thanhcai || d["THANH CÁI"] || "").toUpperCase().trim(),
  });

  useEffect(() => {
    fetch("/devices.json")
      .then((r) => r.json())
      .then((d) => setDevices(d.map(normalize)))
      .catch(console.error);

    fetch("/C&I.json")
      .then((r) => r.json())
      .then((d) => {
        setCIs({
          lo: (d["lò"] || []).map(normalize),
          may: (d["máy"] || []).map(normalize),
          ecb: (d["ecb"] || []).map(normalize),
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));

    function onOnline() { setOffline(false); }
    function onOffline() { setOffline(true); }
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

 const handleSearch = (q, type) => {
  if (!q) {
    setResults([]);
    setHighlight([]);
    return;
  }
  const maArr = q.split(",").map((m) => m.trim().toUpperCase()).filter(Boolean);
  setHighlight(maArr);

  let source = [];
  if (type === "device") source = devices;
  else if (type === "ci") source = cis[ciSheet] || [];

  const filtered = source.filter(d => maArr.includes(d.kks) || maArr.includes(d.cap));

  const merged = {};
  filtered.forEach(d => {
    const key = d.kks + "|" + d.tu; // gộp theo KKS + TỦ
    if (!merged[key]) {
      merged[key] = { ...d, caps: d.cap ? [d.cap] : [] }; // tạo mảng caps
    } else {
      if (d.cap && !merged[key].caps.includes(d.cap)) {
        merged[key].caps.push(d.cap);
      }
    }
  });

  setResults(Object.values(merged));
};


  const variants = { hidden: { x: 300, opacity: 0 }, visible: { x: 0, opacity: 1 }, exit: { x: -300, opacity: 0 } };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif",
        color: "#fff",
        backgroundColor: "#1c1c1e",
        padding: "12px",
        maxWidth: "900px",
        margin: "0 auto"
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
        <img
          src="/logo-spark.svg"
          alt="IsoFind Logo"
          style={{ width: "40px", height: "40px", objectFit: "contain" }}
        />
        <div>
          <h1 style={{ margin: 0, fontSize: "18px" }}>IsoFind</h1>
          <div style={{ color: "#8e8e93", fontSize: "12px" }}>Find & Isolate Fast</div>
        </div>
      </div>

      {offline && <div style={{ color: "#ff3b30", marginBottom: "12px" }}>⚠️ Offline — dữ liệu cục bộ vẫn dùng được</div>}

      {/* Nội dung chính */}
      <div style={{ flex: 1 }}>
        <AnimatePresence mode="wait">
          {layer === "mode" && (
            <motion.div key="mode" initial="hidden" animate="visible" exit="exit" variants={variants} transition={{ duration: 0.3 }}>
              <h2>Chọn chế độ</h2>
              <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
                <button
                  style={{ ...iosButtonStyle({ active: true }), background: "linear-gradient(135deg,#0a84ff,#5ac8fa)" }}
                  onClick={(e) => { createRipple(e); setLayer("searchDevice"); }}
                  onMouseDown={iosButtonPress}
                  onMouseUp={iosButtonRelease}
                  onMouseLeave={iosButtonRelease}
                >
                  Cô lập thiết bị
                </button>
                <button
                  style={iosButtonStyle({ active: false })}
                  onClick={(e) => { createRipple(e); setLayer("ciSelect"); }}
                  onMouseDown={iosButtonPress}
                  onMouseUp={iosButtonRelease}
                  onMouseLeave={iosButtonRelease}
                >
                  Cô lập nguồn C&I
                </button>
              </div>
            </motion.div>
          )}

          {layer === "ciSelect" && (
            <motion.div key="ciSelect" initial="hidden" animate="visible" exit="exit" variants={variants} transition={{ duration: 0.3 }}>
              <h2>Chọn nguồn C&I</h2>
              <div style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
                {["lo", "may", "ecb"].map(s => (
                  <button
                    key={s}
                    style={{ ...iosButtonStyle({ active: ciSheet === s }), background: ciSheet === s ? "linear-gradient(135deg,#0a84ff,#5ac8fa)" : "#3a3a3c" }}
                    onClick={(e) => { createRipple(e); setCiSheet(s); setLayer("searchCI"); }}
                    onMouseDown={iosButtonPress}
                    onMouseUp={iosButtonRelease}
                    onMouseLeave={iosButtonRelease}
                  >
                    {s.toUpperCase()}
                  </button>
                ))}
              </div>
              <button
                style={{ ...iosButtonStyle({ active: false, color: "#ff3b30" }), background: "#ff3b30" }}
                onClick={(e) => { createRipple(e); setLayer("mode"); setResults([]); }}
                onMouseDown={iosButtonPress}
                onMouseUp={iosButtonRelease}
                onMouseLeave={iosButtonRelease}
              >
                Quay lại
              </button>
            </motion.div>
          )}

          {layer === "searchDevice" && (
            <motion.div key="searchDevice" initial="hidden" animate="visible" exit="exit" variants={variants} transition={{ duration: 0.3 }}>
              <SearchForm onSearch={(q) => handleSearch(q, "device")} />
              <div style={{ marginTop: "12px" }}>
                {results.length === 0 && <div style={{ color: "#8e8e93", textAlign:"left" }}>Nhập mã KKS hoặc mã cáp</div>}
                {results.map((dev) => <ResultCard key={dev.kks + dev.cap} device={dev} highlight={highlight} />)}
              </div>
              <button
                style={{ ...iosButtonStyle({ active: false, color: "#ff3b30" }), background: "#ff3b30", marginTop: "12px" }}
                onClick={(e) => { createRipple(e); setLayer("mode"); setResults([]); }}
                onMouseDown={iosButtonPress}
                onMouseUp={iosButtonRelease}
                onMouseLeave={iosButtonRelease}
              >
                Quay lại
              </button>
            </motion.div>
          )}

          {layer === "searchCI" && (
            <motion.div key="searchCI" initial="hidden" animate="visible" exit="exit" variants={variants} transition={{ duration: 0.3 }}>
              <SearchForm onSearch={(q) => handleSearch(q, "ci")} />
              <div style={{ marginTop: "12px" }}>
                {loading && <div>Loading...</div>}
                {results.length === 0 && !loading && <div style={{ color: "#8e8e93", textAlign:"left" }}>Nhập mã KKS hoặc mã cáp</div>}
                {results.map((dev) => <ResultCard key={dev.kks + dev.cap} device={dev} highlight={highlight} />)}
              </div>
              <button
                style={{ ...iosButtonStyle({ active: false, color: "#ff3b30" }), background: "#ff3b30", marginTop: "12px" }}
                onClick={(e) => { createRipple(e); setLayer("ciSelect"); setResults([]); }}
                onMouseDown={iosButtonPress}
                onMouseUp={iosButtonRelease}
                onMouseLeave={iosButtonRelease}
              >
                Quay lại
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer cố định */}
      <footer style={{ textAlign: "center", color: "#8e8e93", padding: "12px 0", fontSize: "12px" }}>
        © IsoFind - Vận hành 2 - TPC Duyên Hải
      </footer>
    </div>
  );
}
