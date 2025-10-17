import { motion } from "framer-motion"
import React, {useState} from "react"

export default function SearchForm({onSearch}){
  const [q,setQ]=useState("")
  function submit(e){
    e.preventDefault()
    onSearch(q)
  }
  return (
    <form onSubmit={submit} className="card">
      <label style={{fontSize:14,color:"var(--muted)"}}>Nhập mã KKS hoặc mã cáp</label>
      <div style={{display:"flex",gap:10,marginTop:8}}>
        <input className="input" placeholder="M03-MTR-0101 hoặc CBL-03-0452" value={q} onChange={e=>setQ(e.target.value)} />
        <motion.button
  type="submit"
  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white font-semibold shadow-md"
  whileTap={{ scale: 0.9 }}
  whileHover={{ scale: 1.05, boxShadow: "0px 0px 10px #3b82f6" }}
  transition={{ type: "spring", stiffness: 300 }}
>
  🔍 Tìm
</motion.button>

      </div>
    </form>
  )
}
