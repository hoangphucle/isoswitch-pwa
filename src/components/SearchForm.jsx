import React, { useState } from "react"
import { motion } from "framer-motion"
import { Search } from "lucide-react"

export default function SearchForm({ onSearch }) {
  const [query, setQuery] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    if (query.trim() === "") return
    onSearch(query.trim())
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="flex items-center justify-between bg-white/10 rounded-full px-4 py-2 shadow-inner 
      border border-white/20 backdrop-blur-md focus-within:ring-2 focus-within:ring-blue-400/40 
      transition-all duration-300"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center w-full">
        {/* Icon kính lúp */}
        <Search className="w-5 h-5 text-gray-300 mr-3" />

        {/* Ô nhập */}
        <input
          type="text"
          placeholder="Nhập mã KKS hoặc mã cáp..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-grow bg-transparent text-white placeholder-gray-400 
          focus:outline-none text-base sm:text-lg tracking-wide"
        />
      </div>

      {/* Nút tìm */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        className="ml-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-1.5 
        rounded-full shadow-md hover:shadow-lg transition-all duration-300"
      >
        Tìm
      </motion.button>
    </motion.form>
  )
}
