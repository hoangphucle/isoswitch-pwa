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
    <div className="flex flex-col items-center justify-start min-h-screen px-4 py-8 text-center bg-[#0B1120]">
      {/* Header */}
      <motion.div
        className="flex flex-col items-center justify-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.img
          src="/icons/logo.png"
          alt="IsoSwitch logo"
          className="w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-44 lg:h-44 object-contain drop-shadow-[0_0_10px_rgba(0,114,188,0.4)] mb-4"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        />
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#0072BC] tracking-tight">
          IsoSwitch EVN
        </h1>
        <p className="text-gray-400 mt-2 text-sm sm:text-base">
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
          <div className="text-gray-500 mt-6 bg-gray-800/40 rounded-lg p-4 border border-gray-700">
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
