import React from "react"
import { motion } from "framer-motion"
import { Cable, Zap, MapPin, Info } from "lucide-react"


export default function ResultCard({ device }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-5 mb-4 
      shadow-[0_8px_24px_rgba(0,0,0,0.25)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.3)] 
      transition-all duration-300"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Zap className="text-blue-400 w-5 h-5" />
          <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
            {device.name || "Thiết bị không tên"}
          </h2>
        </div>
        <span className="text-xs sm:text-sm text-gray-400 italic">
          {device.kks || "—"}
        </span>
      </div>

      {/* Body */}
      <div className="space-y-2 text-left">
        {device.cable && (
          <p className="flex items-center gap-2 text-gray-300">
            <Cable className="w-4 h-4 text-indigo-300" />
            <span>Mã cáp: {device.cable}</span>
          </p>
        )}
        {device.location && (
          <p className="flex items-center gap-2 text-gray-300">
            <MapPin className="w-4 h-4 text-pink-300" />
            <span>Vị trí: {device.location}</span>
          </p>
        )}
        {device.note && (
          <p className="flex items-center gap-2 text-gray-300">
            <Info className="w-4 h-4 text-teal-300" />
            <span>Ghi chú: {device.note}</span>
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="mt-3 text-right">
        <span className="text-xs text-gray-500 italic">
          Cập nhật gần đây • IsoSwitch
        </span>
      </div>
    </motion.div>
  )
}
