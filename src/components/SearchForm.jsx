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
        <button className="btn" type="submit">Tìm</button>
      </div>
    </form>
  )
}
