import React from "react"

export default function ResultCard({device}){
  if(!device) return null
  return (
    <div className="card">
      <h3 style={{margin:0,marginBottom:8}}>{device.device_name}</h3>
      <div className="result-row">
        <div className="kv"><strong>KKS</strong><div style={{color:"var(--muted)"}}>{device.kks_code}</div></div>
        <div className="kv"><strong>Mã cáp</strong><div style={{color:"var(--muted)"}}>{device.cable_code}</div></div>
        <div className="kv"><strong>Máy cắt</strong><div style={{color:"var(--muted)"}}>{device.breaker_code}</div></div>
        <div className="kv"><strong>Tủ</strong><div style={{color:"var(--muted)"}}>{device.panel_code}</div></div>
      </div>
      <div style={{marginTop:12}} className="kv"><strong>Bus</strong><div style={{color:"var(--muted)"}}>{device.bus_name}</div></div>
      <div style={{marginTop:8}} className="kv"><strong>Vị trí</strong><div style={{color:"var(--muted)"}}>{device.location}</div></div>
      <div style={{marginTop:8}} className="kv"><strong>Ghi chú</strong><div style={{color:"var(--muted)"}}>{device.remark}</div></div>

      <div style={{display:"flex",gap:8,marginTop:12}}>
        <button className="btn">📊 Xem sơ đồ</button>
        <button className="btn" style={{background:"#10b981"}}>📍 Vị trí tủ</button>
        <button className="btn" style={{background:"#f59e0b"}}>🔖 In phiếu cô lập</button>
      </div>
    </div>
  )
}
