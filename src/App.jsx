import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
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
    const onOnline = () => setOffline(false)
    const onOffline = () => setOffline(true)
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
    <div className="flex flex-col items-center justify-start min-h-screen px-4 py-8 text-center bg-[#0A0F1A] font-[system-ui] text-white">
      {/* Header */}
      <motion.div
        className="flex flex-col items-center justify-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Logo + Tên */}
        <div className="flex items-center justify-center space-x-3 mb-2">
          <motion.img
            src="/icons/logo.png"
            alt="IsoSwitch logo"
            className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 object-contain rounded-xl drop-shadow-[0_0_8px_rgba(0,122,255,0.45)]"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          />
          <h1 className="text-[1.9rem] sm:text-[2.2rem] font-semibold tracking-tight text-white">
            IsoSwitch
          </h1>
        </div>

        <p className="text-gray-400 text-[0.9rem] sm:text-base font-light">
          Tra cứu máy cắt cần cô lập
        </p>
      </motion.div>

      {/* Form tìm kiếm */}
      <div className="w-full max-w-md mb-6">
        <SearchForm onSearch={handleSearch} />
      </div>

      {/* Thông báo offline */}
      {offline && (
        <div className="text-yellow-400 text-sm mb-4">
          ⚠️ Đang ở chế độ Offline — dữ liệu cục bộ vẫn dùng được
        </div>
      )}

      {/* Kết quả tìm kiếm */}
      <div className="w-full max-w-3xl mt-4">
        {results.length === 0 ? (
          <div className="text-gray-500 mt-6 bg-gray-800/30 rounded-xl p-4 border border-gray-700/40">
            Chưa có kết quả. Thử nhập mã KKS hoặc mã cáp.
          </div>
        ) : (
          results.map((dev) => <ResultCard key={dev.id} device={dev} />)
        )}
      </div>

      {/* Footer */}
      <footer className="text-gray-600 text-xs sm:text-sm mt-10">
        © 2025 IsoSwitch — Tra cứu thiết bị cô lập. PX VH2
      </footer>
    </div>
  )
}
