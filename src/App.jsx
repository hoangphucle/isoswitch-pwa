// src/App.js
import React, {
  useEffect,
  useState,
  useMemo
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import SearchForm from "./components/SearchForm";
import ResultCard from "./components/ResultCard";
import "./components/Button.css";
import supabase from "./supabase";

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
  const [ciData, setCiData] = useState({
    tus: {},
    index: {}
  });

  const [ciMap, setCiMap] = useState({});
  const [results, setResults] = useState([]);
  const [highlight, setHighlight] = useState([]);
  const [offline, setOffline] = useState(!navigator.onLine);
  const [loading, setLoading] = useState(true);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showLoginModal, setShowLoginModal] =
    useState(false);

  const [loginForm, setLoginForm] =
    useState({

      username: "",

      password: ""

    });
  const [loginError, setLoginError] =
    useState("");
  const [addForm, setAddForm] = useState({

    kks: "",

    cap: "",

    tu: "",

    name_en: "",

    name_vi: "",

    power: ""

  });


  let currentUser = null;

  let isAdmin = false;

  if (typeof window !== "undefined") {

    try {

      currentUser = JSON.parse(

        localStorage.getItem("user") || "null"

      );

      isAdmin =
        currentUser?.role === "admin";

    } catch (err) {

      console.error(err);

    }

  }
  const cardField = {
    padding: 12,
    borderRadius: 12,
    background: "linear-gradient(145deg, #1e293b, #0f172a)",
    boxShadow: "0 2px 6px rgba(0,0,0,0.3)"
  };
  const normalizeDevice = (d) => ({
    kks: String(d.kks || d.KKS || "").toUpperCase().trim(),

    cap: String(d.cap || d.CAP || "").toUpperCase().trim(),

    tu: String(d.tu || d.TU || "").toUpperCase().trim(),

    ten: String(
      d.name_vi ||
      d.name_en ||
      ""
    ).trim(),

    name_en: String(d.name_en || "").trim(),

    name_vi: String(d.name_vi || "").trim(),

    power: String(d.power || "").trim(),
  });
  const normalizeCI = (d, tuData = {}) => ({
    kks: String(d.kks || "").toUpperCase().trim(),
    cap: String(d.cap || "").toUpperCase().trim(),

    cb: String(d.cb || "").toUpperCase().trim(),
    name: String(d.name || "").toUpperCase().trim(),
    p: String(d.p || "").toUpperCase().trim(),

    tu: String(tuData.tu || "").toUpperCase().trim(),
    vitri: String(tuData.vitri || "").toUpperCase().trim(),
    mc: String(tuData.mc || "").toUpperCase().trim(),

    kks_mc: String(d.kks_mc || "").toUpperCase().trim(),
    kks_load: String(d.kks_load || "").toUpperCase().trim(),
    note: String(d.note || "").toUpperCase().trim(),

    _id: `${tuData.tu}_${d.cb}`
  });
  const deviceMap = useMemo(() => {

    const dMap = {};

    devices.forEach((d) => {

      // SEARCH THEO KKS
      if (d.kks) {

        const key = d.kks
          .trim()
          .toUpperCase();

        if (!dMap[key]) {
          dMap[key] = [];
        }

        dMap[key].push(d);
      }

      // SEARCH THEO CÁP
      if (d.cap) {

        const key = d.cap
          .trim()
          .toUpperCase();

        if (!dMap[key]) {
          dMap[key] = [];
        }

        dMap[key].push(d);
      }

    });

    return dMap;

  }, [devices]);
  useEffect(() => {

    async function loadDevices() {

      try {

        const { data, error } = await supabase
          .from("devices")
          .select("*")
          .range(0, 20000);

        if (error) {
          console.error(error);
          return;
        }

        console.log("SUPABASE DEVICES:", data.length);
        console.log("FIRST DEVICE:", data[0]);
        setDevices(
          (data || []).map(normalizeDevice)
        );

      } catch (err) {

        console.error(err);

      }
    }

    loadDevices();

    fetch("/ci_data.json")
      .then((r) => r.json())
      .then((d) => {
        setCiData(d);
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
  useEffect(() => {
    const setVH = () => {
      document.documentElement.style.setProperty(
        "--vh",
        `${window.innerHeight * 0.01}px`
      );
    };

    setVH();
    window.addEventListener("resize", setVH);

    return () => window.removeEventListener("resize", setVH);
  }, []);
  useEffect(() => {
    if (!devices.length || !ciData?.tus) return;

    // ===== CI MAP =====
    const map = {};

    Object.entries(ciData.tus).forEach(([tu, tuData]) => {
      tuData.devices.forEach((d) => {

        const full = normalizeCI(d, {
          tu,
          vitri: tuData.vitri,
          mc: tuData.mc
        });

        if (d.kks) map[d.kks] = full;
        if (d.cap) map[d.cap] = full;

      });
    });

    setCiMap(map);
    console.log("CI MAP BUILT:", map);

  }, [devices, ciData]);

  const handleSearch = (q, type) => {
    if (!q) {
      setResults([]);
      setHighlight([]);
      return;
    }
    const normalizeText = (text = "") => {

      return text
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // bỏ dấu
        .replace(/\s+/g, " ")
        .toUpperCase()
        .trim();

    };

    const groupDevices = (list) => {

      const grouped = {};

      list.forEach((d) => {

        const key = d.kks;

        if (!grouped[key]) {

          grouped[key] = {
            ...d,
            caps: []
          };
        }

        if (d.cap) {

          grouped[key].caps.push(d.cap);
        }

      });

      return Object.values(grouped);

    };
    const keywords = q
      .split(",")
      .map((k) => k.trim().toUpperCase())
      .filter(Boolean);

    setHighlight(keywords);
    console.log("SEARCH:", keywords);
    console.log("MAP:", deviceMap);
    // 🔧 DEVICE
    if (type === "device") {

      setSelectedDevice(null);

      const k = normalizeText(
        keywords[0]
      );

      // =====================
      // EXACT
      // =====================

      const exact = devices.filter((d) => {

        return (
          d.kks === k ||
          d.cap === k ||
          d.tu === k
        );

      });

      if (exact.length > 0) {

        setResults(groupDevices(exact));
        return;
      }

      // =====================
      // STARTS WITH
      // =====================

      const starts = devices.filter((d) => {

        return (
          d.kks?.startsWith(k) ||
          d.cap?.startsWith(k) ||
          d.tu?.startsWith(k)
        );

      });

      if (starts.length > 0) {

        setResults(
          groupDevices(
            starts.slice(0, 50)
          )
        );
        return;
      }
      // =====================
      // FUZZY TOKEN SEARCH
      // =====================

      if (k.length < 3) {

        setResults([]);
        return;
      }

      // tách keyword
      const tokens = k
        .split(" ")
        .filter(Boolean);

      const fuzzy = devices.filter((d) => {

        const text = normalizeText(`
          ${d.name_en || ""}
          ${d.name_vi || ""}
        `);

        // tất cả token phải tồn tại
        return tokens.every((token) =>
          text.includes(token)
        );

      });

      setResults(
        groupDevices(
          fuzzy.slice(0, 50)
        )
      );

      return;
    }

    // ⚡ CI
    if (type === "ci") {

      // 🔥 1. ƯU TIÊN: nếu nhập đúng 1 mã tủ
      if (keywords.length === 1 && ciData.tus?.[keywords[0]]) {

        const key = keywords[0];
        const tuData = ciData.tus[key];

        const list = tuData.devices.map((d, idx) => ({
          ...normalizeCI(d, {
            tu: key,
            vitri: tuData.vitri,
            mc: tuData.mc
          }),
          _id: key + "_" + idx
        }));

        setResults(list);
        setSelectedDevice(null); // 👉 list mode
        return;
      }

      // 🔥 2. CÒN LẠI → SEARCH KKS / CAP → DETAIL MODE
      const results = keywords
        .map((key) => ciMap[key])
        .filter(Boolean);

      if (results.length > 0) {
        setSelectedDevice(results[0]); // 👉 show detail luôn
        setResults(results); // (giữ lại nếu bạn cần)
      } else {
        setResults([]);
        setSelectedDevice(null);
      }
    }
  }
  function handleAddDevice() {

    setShowLoginModal(true);

  }

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
        minHeight: "calc(var(--vh, 1vh) * 100)",
        maxWidth: "900px",
        margin: "0 auto",

        backgroundColor: "#1c1c1e",
        color: "#fff",
        fontFamily:
          "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif",

        boxSizing: "border-box",

        /* ✅ SAFE AREA CHUẨN */
        paddingTop: "calc(12px + env(safe-area-inset-top))",
        paddingBottom: "env(safe-area-inset-bottom)",
        paddingLeft: "calc(12px + env(safe-area-inset-left))",
        paddingRight: "calc(12px + env(safe-area-inset-right))",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "12px",
          flexShrink: 0, // 🔥 không bị co
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
      <div
        style={{
          flex: 1,
          overflowY: "auto",              // 🔥 QUAN TRỌNG NHẤT
          WebkitOverflowScrolling: "touch", // 🔥 mượt như iOS
          paddingBottom: "20px",          // tránh bị đè footer
        }}
      >
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
                  className={`mode-btn ${layer === "searchDevice" ? "mode-btn--active" : ""
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
                  className={`mode-btn ${layer === "ciSelect" ? "mode-btn--active" : ""
                    }`}
                  aria-label="Tra cứu nguồn CI"
                  onClick={(e) => {
                    createRipple(e);
                    setLayer("searchCI");
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

              {isAdmin && (

                <button
                  onClick={handleAddDevice}
                  style={addBtn}
                >
                  ➕ Thêm thiết bị
                </button>

              )}
              <div style={{ marginTop: "12px" }}>
                {results.length === 0 && (
                  <div style={{ color: "#8e8e93", textAlign: "left" }}>
                    Nhập mã KKS hoặc mã cáp
                  </div>
                )}
                {results.map((dev) => (
                  <ResultCard
                    key={`${dev.kks}_${dev.cap}`}
                    device={dev}
                    highlight={highlight}
                    type="device"
                  />
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
              <BackHeader title="Chọn chế độ" onBack={() => { setLayer("mode"); setResults([]); }} />

              <SearchForm onSearch={(q) => handleSearch(q, "ci")} />
              <div style={{ marginTop: "12px" }}>
                {loading && <div>Loading...</div>}
                {results.length === 0 && !loading && (
                  <div style={{ color: "#8e8e93", textAlign: "left" }}>
                    Nhập mã KKS hoặc mã cáp của phụ tải để tra cứu<br />
                    Ngoài ra có thể nhập mã tủ để hiển thị toàn bộ phụ tải
                  </div>
                )}
                {selectedDevice ? (

                  // 👉 DETAIL MODE
                  <ResultCard
                    device={selectedDevice}
                    highlight={highlight}
                    type="ci"
                    onBack={() => setSelectedDevice(null)}
                  />

                ) : (

                  // 👉 LIST MODE
                  results.map((dev, i) => (

                    <div
                      key={dev._id || i}
                      style={{
                        padding: 12,
                        borderBottom: "1px solid #333",
                        cursor: "pointer"
                      }}
                      onClick={() => setSelectedDevice(dev)}
                    >
                      ⚡ <b>{dev.cb || "—"}</b> — {dev.name || "—"}
                    </div>

                  ))

                )}
              </div>
              {/* no Quay lại here */}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <footer
        style={{
          textAlign: "center",
          color: "#8e8e93",
          fontSize: "12px",
          marginTop: "auto", // 🔥 quan trọng
          paddingTop: "12px",
          paddingBottom: "env(safe-area-inset-bottom)",
          marginBottom: 8
        }}
      >
        © IsoFind - Vận hành 2 - Designed by PhucLH v3.3

        {showLoginModal && (

          <div style={modalOverlay}>

            <div style={modalBox}>

              <div style={{
                fontSize: 18,
                fontWeight: 700,
                marginBottom: 16
              }}>
                🔐 Vui lòng đăng nhập
              </div>
              {loginError && (

                <div style={errorBox}>

                  ⚠ {loginError}

                </div>

              )}
              <input
                placeholder="Tài khoản"
                value={loginForm.username}
                onChange={(e) =>
                  setLoginForm({
                    ...loginForm,
                    username: e.target.value
                  })
                }
                style={modalInput}
              />

              <input
                type="password"
                placeholder="Mật khẩu"
                value={loginForm.password}
                onChange={(e) =>
                  setLoginForm({
                    ...loginForm,
                    password: e.target.value
                  })
                }
                style={modalInput}
              />

              <button

                onClick={async () => {

                  const { data, error } = await supabase

                    .from("users")

                    .select("*")

                    .eq(
                      "username",
                      loginForm.username
                    )

                    .eq(
                      "password",
                      loginForm.password
                    )

                    .single();

                  if (error || !data) {

                    setLoginError(
                      "Sai tài khoản hoặc mật khẩu"
                    );

                    return;
                  }

                  // LƯU SESSION USER
                  localStorage.setItem(

                    "user",

                    JSON.stringify(data)

                  );
                  setLoginError("");
                  // ĐÓNG LOGIN
                  setShowLoginModal(false);

                  // MỞ FORM ADD DEVICE
                  setShowAddModal(true);

                }}

                style={saveBtn}
              >
                Đăng nhập
              </button>

              <button
                onClick={() =>
                  setShowLoginModal(false)
                }
                style={cancelBtn}
              >
                Đóng
              </button>

            </div>

          </div>

        )}

        {showAddModal && (

          <div style={modalOverlay}>

            <div style={modalBox}>

              <div style={{
                fontSize: 18,
                fontWeight: 700,
                marginBottom: 16
              }}>
                ➕ Thêm thiết bị mới
              </div>


              <input
                placeholder="Mã KKS"
                value={addForm.kks}
                onChange={(e) =>
                  setAddForm({
                    ...addForm,
                    kks: e.target.value
                  })
                }
                style={modalInput}
              />

              <input
                placeholder="Mã cáp"
                value={addForm.cap}
                onChange={(e) =>
                  setAddForm({
                    ...addForm,
                    cap: e.target.value
                  })
                }
                style={modalInput}
              />

              <input
                placeholder="Mã tủ"
                value={addForm.tu}
                onChange={(e) =>
                  setAddForm({
                    ...addForm,
                    tu: e.target.value
                  })
                }
                style={modalInput}
              />

              <input
                placeholder="Tên tiếng Anh"
                value={addForm.name_en}
                onChange={(e) =>
                  setAddForm({
                    ...addForm,
                    name_en: e.target.value
                  })
                }
                style={modalInput}
              />

              <input
                placeholder="Tên tiếng Việt"
                value={addForm.name_vi}
                onChange={(e) =>
                  setAddForm({
                    ...addForm,
                    name_vi: e.target.value
                  })
                }
                style={modalInput}
              />

              <input
                placeholder="Công suất"
                value={addForm.power}
                onChange={(e) =>
                  setAddForm({
                    ...addForm,
                    power: e.target.value
                  })
                }
                style={modalInput}
              />

              <button

                onClick={async () => {

                  // CHECK TRỐNG
                  if (
                    !addForm.kks ||
                    !addForm.cap
                  ) {

                    alert("Thiếu KKS hoặc CAP");

                    return;
                  }

                  // CHECK TRÙNG KKS
                  const existed = devices.find(

                    (d) =>

                      d.kks ===
                      addForm.kks
                        .toUpperCase()
                        .trim()

                      &&

                      d.tu ===
                      addForm.tu
                        .toUpperCase()
                        .trim()

                  );

                  if (existed) {

                    alert("Thiết bị đã tồn tại");

                    return;
                  }

                  // INSERT DATABASE
                  const { error } = await supabase
                    .from("devices")
                    .insert({

                      kks: addForm.kks
                        .toUpperCase()
                        .trim(),

                      cap: addForm.cap
                        .toUpperCase()
                        .trim(),

                      tu: addForm.tu
                        .toUpperCase()
                        .trim(),

                      name_en:
                        addForm.name_en,

                      name_vi:
                        addForm.name_vi,

                      power:
                        addForm.power,

                      created_by:
                        currentUser?.username

                    });

                  if (error) {

                    console.error(error);

                    alert("Không lưu được");

                    return;
                  }

                  // UPDATE LOCAL UI
                  setDevices([
                    ...devices,
                    normalizeDevice(addForm)
                  ]);

                  // RESET FORM
                  setAddForm({

                    kks: "",

                    cap: "",

                    tu: "",

                    name_en: "",

                    name_vi: "",

                    power: ""

                  });

                  // ĐÓNG MODAL
                  setShowAddModal(false);

                  alert("Đã thêm thiết bị");

                }}

                style={saveBtn}
              >
                Lưu thiết bị
              </button>

              <button
                onClick={() =>
                  setShowAddModal(false)
                }
                style={cancelBtn}
              >
                Đóng
              </button>

            </div>

          </div>

        )}
      </footer>
    </div>
  );
}

const addBtn = {

  width: "100%",

  marginTop: "12px",

  padding: "14px",

  border: "none",

  borderRadius: "14px",

  background: "#059669",

  color: "#fff",

  fontWeight: 700,

  fontSize: "15px",

  cursor: "pointer"

};

const modalOverlay = {

  position: "fixed",

  inset: 0,

  background: "rgba(0,0,0,0.65)",

  display: "flex",

  alignItems: "center",

  justifyContent: "center",

  zIndex: 9999

};

const modalBox = {

  width: "90%",

  maxWidth: "420px",

  background: "#1e293b",

  borderRadius: "18px",

  padding: "20px",

  boxSizing: "border-box"

};

const modalInput = {

  width: "100%",

  padding: "12px",

  marginBottom: "12px",

  borderRadius: "12px",

  border: "1px solid #334155",

  background: "#0f172a",

  color: "#fff",

  outline: "none",

  boxSizing: "border-box"

};

const saveBtn = {

  width: "100%",

  padding: "14px",

  border: "none",

  borderRadius: "12px",

  background: "#059669",

  color: "#fff",

  fontWeight: 700,

  cursor: "pointer",

  marginTop: "6px"

};

const cancelBtn = {

  width: "100%",

  padding: "12px",

  border: "none",

  borderRadius: "12px",

  background: "#334155",

  color: "#fff",

  cursor: "pointer",

  marginTop: "10px"

};

const errorBox = {

  background: "rgba(239,68,68,0.15)",

  border: "1px solid rgba(239,68,68,0.35)",

  color: "#fca5a5",

  padding: "12px",

  borderRadius: "12px",

  marginBottom: "14px",

  fontSize: "14px",

  fontWeight: 600

};
