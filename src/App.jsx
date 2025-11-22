// src/App.js
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SearchForm from "./components/SearchForm";
import ResultCard from "./components/ResultCard";
import "./components/Button.css";

/**
 * Full App.js (đã sửa)
 * - Responsive mode grid with square buttons (icon trên, chữ dưới)
 * - BackHeader (mũi tên + tên chế độ) thay thế nút "Quay lại"
 * - Ripple + press effects preserved (Button.css)
 * - Giữ nguyên logic fetch & handleSearch cũ
 */

/* Back header giống iOS: mũi tên + tiêu đề */
function BackHeader({ title, onBack }) {
  return (
    <div
      className="back-header"
      onClick={onBack}
      role="button"
      aria-label={`Back to ${title}`}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        cursor: "pointer",
        padding: "6px 0",
        marginBottom: 8,
        color: "#fff",
        userSelect: "none",
        width: "100%",
      }}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flex: "0 0 20px" }}
      >
        <path
          d="M15 18l-6-6 6-6"
          stroke="#fff"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div style={{ fontWeight: 700, fontSize: 15 }}>{title}</div>
    </div>
  );
}

/* press / release effects */
const iosButtonPress = (e) => {
  e.currentTarget.style.transform = "scale(0.98)";
  e.currentTarget.style.boxShadow = "0 4px 10px rgba(0,0,0,0.35)";
};
const iosButtonRelease = (e) => {
  e.currentTarget.style.transform = "scale(1)";
  e.currentTarget.style.boxShadow = "";
};

/* ripple */
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

/* small helper style used for CI select buttons (kept inline in jsx or can extract) */
const iosButtonStyleBase = ({ active = false, color = "#0a84ff" } = {}) => ({
  borderRadius: "12px",
  border: active ? "none" : "1px solid rgba(255,255,255,0.06)",
  fontSize: "14px",
  fontWeight: 600,
  color: "#fff",
  background: active ? `linear-gradient(135deg, ${color}, #5ac8fa)` : "#2c2c2e",
  boxShadow: active ? "0 8px 20px rgba(10,132,255,0.14)" : "0 2px 6px rgba(0,0,0,0.25)",
  cursor: "pointer",
  transition: "transform 0.12s ease, box-shadow 0.12s ease, background 0.12s ease",
  outline: "none",
  userSelect: "none",
  overflow: "hidden",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
});

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

    function onOnline() {
      setOffline(false);
    }
    function onOffline() {
      setOffline(true);
    }
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
    const maArr = q
      .split(",")
      .map((m) => m.trim().toUpperCase())
      .filter(Boolean);
    setHighlight(maArr);

    let source = [];
    if (type === "device") source = devices;
    else if (type === "ci") source = cis[ciSheet] || [];

    const filtered = source.filter(
      (d) => maArr.includes(d.kks) || maArr.includes(d.cap)
    );

    const merged = {};
    filtered.forEach((d) => {
      const key = d.kks + "|" + d.tu;
      if (!merged[key]) {
        merged[key] = { ...d, caps: d.cap ? [d.cap] : [] };
      } else {
        if (d.cap && !merged[key].caps.includes(d.cap)) {
          merged[key].caps.push(d.cap);
        }
      }
    });

    setResults(Object.values(merged));
  };

  const variants = {
    hidden: { x: 300, opacity: 0 },
    visible: { x: 0, opacity: 1 },
    exit: { x: -300, opacity: 0 },
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        fontFamily:
          "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif",
        color: "#fff",
        backgroundColor: "#1c1c1e",
        padding: "12px",
        maxWidth: "900px",
        margin: "0 auto",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "12px",
        }}
      >
        <img
          src="/logo-spark.svg"
          alt="IsoFind Logo"
          style={{ width: "40px", height: "40px", objectFit: "contain" }}
        />
        <div>
          <h1 style={{ margin: 0, fontSize: "18px" }}>IsoFind</h1>
          <div style={{ color: "#8e8e93", fontSize: "12px" }}>
            Find & Isolate Fast
          </div>
        </div>
      </div>

      {offline && (
        <div style={{ color: "#ff3b30", marginBottom: "12px" }}>
          ⚠️ Offline — dữ liệu cục bộ vẫn dùng được
        </div>
      )}

      {/* Main content */}
      <div style={{ flex: 1 }}>
        <AnimatePresence mode="wait">
          {layer === "mode" && (
            <motion.div
              key="mode"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={variants}
              transition={{ duration: 0.28 }}
            >
              <h2 style={{ marginBottom: 8 }}>Chọn chế độ</h2>

              <div className="mode-grid" style={{ marginTop: 12 }}>
                
                {/* DEVICE */}
                <button
                  className={`mode-btn ${
                    layer === "searchDevice" ? "mode-btn--active" : ""
                  }`}
                  aria-label="Tra cứu nguồn thiết bị"
                  onClick={(e) => {
                    createRipple(e);
                    setLayer("searchDevice");
                    setResults([]);
                  }}
                  onMouseDown={iosButtonPress}
                  onMouseUp={iosButtonRelease}
                  onMouseLeave={iosButtonRelease}
                >
                  <div className="mode-btn__inner">
                    <img
                      src="/icons/device.svg"
                      alt="device"
                      className="mode-btn__icon big"
                    />
                    <div className="mode-btn__label big-text">
                      Tra cứu nguồn thiết bị
                    </div>
                  </div>
                </button>

                {/* CI */}
                <button
                  className={`mode-btn ${
                    layer === "ciSelect" ? "mode-btn--active" : ""
                  }`}
                  aria-label="Tra cứu nguồn CI"
                  onClick={(e) => {
                    createRipple(e);
                    setLayer("ciSelect");
                    setResults([]);
                  }}
                  onMouseDown={iosButtonPress}
                  onMouseUp={iosButtonRelease}
                  onMouseLeave={iosButtonRelease}
                >
                  <div className="mode-btn__inner">
                    <img
                      src="/icons/ci.svg"
                      alt="ci"
                      className="mode-btn__icon big"
                    />
                    <div className="mode-btn__label big-text">
                      Tra cứu nguồn CI
                    </div>
                  </div>
                </button>
              </div>
            </motion.div>
          )}

         {layer === "ciSelect" && (
  <motion.div
    key="ciSelect"
    initial="hidden"
    animate="visible"
    exit="exit"
    variants={variants}
    transition={{ duration: 0.28 }}
  >
    {/* Back to mode */}
    <BackHeader title="Chọn chế độ" onBack={() => setLayer("mode")} />

    {/* CI buttons: giống style với mode buttons, dùng icon từ /public/icons */}
    <div className="ci-grid" style={{ marginTop: 12 }}>
      {["LÒ", "MÁY", "ECB"].map((s) => (
        <button
          key={s}
          className={`mode-btn ci-btn ${ciSheet === s ? "mode-btn--active" : ""}`}
          aria-label={s.toUpperCase()}
          onClick={(e) => {
            createRipple(e);
            setCiSheet(s);
            setLayer("searchCI");
            setResults([]);
          }}
          onMouseDown={iosButtonPress}
          onMouseUp={iosButtonRelease}
          onMouseLeave={iosButtonRelease}
        >
          <div className="mode-btn__inner">
            {/* dùng SVG từ public/icons */}
            <img src={`/icons/${s}.svg`} alt={s} className="mode-btn__icon ci-icon-img" />
            <div className="mode-btn__label">{s.toUpperCase()}</div>
          </div>
        </button>
      ))}
    </div>
  </motion.div>
)}




          {layer === "searchDevice" && (
            <motion.div
              key="searchDevice"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={variants}
              transition={{ duration: 0.28 }}
            >
              {/* Back header */}
              <BackHeader title="Chọn chế độ" onBack={() => { setLayer("mode"); setResults([]); }} />

              <SearchForm onSearch={(q) => handleSearch(q, "device")} />
              <div style={{ marginTop: "12px" }}>
                {results.length === 0 && (
                  <div style={{ color: "#8e8e93", textAlign: "left" }}>
                    Nhập mã KKS hoặc mã cáp
                  </div>
                )}
                {results.map((dev) => (
                  <ResultCard key={dev.kks + dev.cap} device={dev} highlight={highlight} />
                ))}
              </div>
              {/* no Quay lại here */}
            </motion.div>
          )}

          {layer === "searchCI" && (
            <motion.div
              key="searchCI"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={variants}
              transition={{ duration: 0.28 }}
            >
              {/* Back header goes back to ciSelect */}
              <BackHeader title="Cô lập nguồn C&I" onBack={() => { setLayer("ciSelect"); setResults([]); }} />

              <SearchForm onSearch={(q) => handleSearch(q, "ci")} />
              <div style={{ marginTop: "12px" }}>
                {loading && <div>Loading...</div>}
                {results.length === 0 && !loading && (
                  <div style={{ color: "#8e8e93", textAlign: "left" }}>
                    Nhập mã KKS hoặc mã cáp
                  </div>
                )}
                {results.map((dev) => (
                  <ResultCard key={dev.kks + dev.cap} device={dev} highlight={highlight} />
                ))}
              </div>
              {/* no Quay lại here */}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <footer style={{ textAlign: "center", color: "#8e8e93", padding: "12px 0", fontSize: "12px" }}>
        © IsoFind - Vận hành 2 - Designed by PhucLH
      </footer>
    </div>
  );
}
