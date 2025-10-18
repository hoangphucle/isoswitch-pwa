import React, { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
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
    <div className="flex flex-col items-center justify-between min-h-screen px-4 py-8 text-center 
      bg-gradient-to-br from-[#0b1220] via-[#121c33] to-[#1b2948] 
      font-[system-ui] text-white overflow-hidden relative">
      
      {/* Hiệu ứng ánh sáng nền */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,102,255,0.15),transparent_60%)] pointer-events-none"></div>

      {/* Header + Search */}
      <div className="flex flex-col items-center justify-center flex-grow w-full">
        {/* Logo */}
        <motion.div
          className="flex flex-col items-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.img
  src="/icons/logo.png"
  alt="IsoSwitch logo"
  className="w-[80px] h-[80px] sm:w-[96px] sm:h-[96px] max-w-[100px] max-h-[100px] object-contain rounded-xl drop-shadow-[0_0_10px_rgba(0,122,255,0.4)]"
  style={{ width: "80px", height: "80px" }}
  initial={{ scale: 0.9, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  transition={{ duration: 0.6, delay: 0.2 }}
/>

          <h1 className="mt-4 text-3xl sm:text-4xl font-semibold tracking-tight text-white drop-shadow-lg">
            IsoSwitch
          </h1>
          <p className="text-gray-400 text-sm sm:text-base font-light mt-1">
            Tra cứu máy cắt cần cô lập
          </p>
        </motion.div>

        {/* Form tìm kiếm */}
        <motion.div
          className="w-full max-w-md mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="backdrop-blur-md bg-white/10 border border-white/10 rounded-2xl shadow-[0_4px_30px_rgba(0,0,0,0.2)] p-2">
            <SearchForm onSearch={handleSearch} />
          </div>
        </motion.div>

        {/* Offline notice */}
        {offline && (
          <motion.div
            className="text-yellow-400 text-sm mb-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            ⚠️ Đang ở chế độ Offline — dữ liệu cục bộ vẫn dùng được
          </motion.div>
        )}

        {/* Kết quả */}
        <div className="w-full max-w-3xl mt-4 space-y-3">
          <AnimatePresence>
            {results.length === 0 ? (
              <motion.div
                key="no-result"
                className="text-gray-400 mt-6 bg-white/5 rounded-2xl p-5 border border-white/10 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Chưa có kết quả. Thử nhập mã KKS hoặc mã cáp.
              </motion.div>
            ) : (
              results.map((dev) => (
                <motion.div
                  key={dev.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ResultCard device={dev} />
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-gray-500 text-xs sm:text-sm mt-10 mb-2 opacity-70">
        © 2025 IsoSwitch — PX VH2
      </footer>
    </div>
  )
}
