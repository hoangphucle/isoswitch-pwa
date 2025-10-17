import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"     // ✅ di chuyển lên đây
import SearchForm from "./components/SearchForm"
import ResultCard from "./components/ResultCard"
import { searchDevices } from "./utils/search"
import devicesData from "./data/devices.json"

export default function App() {
  const [devices, setDevices] = useState([])
  const [results, setResults] = useState([])
  const [offline, setOffline] = useState(!navigator.onLine)

  useEffect(() => {
    setDevices(devicesData)

    function onOnline() {
      setOffline(false)
    }
    function onOffline() {
      setOffline(true)
    }
    window.addEventListener("online", onOnline)
    window.addEventListener("offline", onOffline)
    return () => {
      window.removeEventListener("online", onOnline)
      window.removeEventListener("offline", onOffline)
    }
  }, [])

  function handleSearch(q) {
    const r = searchDevices(devices, q)
    setResults(r)
  }

  return (
    <>
      <motion.div
        className="flex items-center gap-3 justify-center mb-6 mt-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.img
          src="/icons/logo.png"
          alt="IsoSwitch logo"
          className="w-10 h-10 sm:w-14 sm:h-14 max-w-[50px] max-h-[50px] object-contain drop-shadow-lg"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        />
        <div>
          <h1 className="text-3xl font-bold text-[#0072BC]">IsoSwitch EVN</h1>
          <p className="text-gray-400 text-sm">Tra cứu máy cắt cần cô lập</p>
        </div>
      </motion.div>

      <SearchForm onSearch={handleSearch} />

      {offline && (
        <div className="offline">
          ⚠️ Đang ở chế độ Offline — dữ liệu cục bộ vẫn dùng được
        </div>
      )}

      <div style={{ marginTop: 12 }}>
        {results.length === 0 && (
          <div style={{ color: "var(--muted)", marginTop: 8 }} className="card">
            Chưa có kết quả. Thử nhập mã KKS hoặc mã cáp.
          </div>
        )}
        {results.map((dev) => (
          <ResultCard key={dev.id} device={dev} />
        ))}
      </div>

      <footer style={{ color: "var(--muted)", marginTop: 20 }}>
        © 2025 IsoSwitch — Tra cứu thiết bị cô lập. PX VH3
      </footer>
    </>
  )
}
