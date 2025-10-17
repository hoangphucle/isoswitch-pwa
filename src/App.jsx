import React, {useEffect, useState} from "react"
import SearchForm from "./components/SearchForm"
import ResultCard from "./components/ResultCard"
import { searchDevices } from "./utils/search"
import devicesData from "./data/devices.json"

export default function App(){
  const [devices,setDevices]=useState([])
  const [results,setResults]=useState([])
  const [offline,setOffline]=useState(!navigator.onLine)

  useEffect(()=>{
    setDevices(devicesData)

    function onOnline(){setOffline(false)}
    function onOffline(){setOffline(true)}
    window.addEventListener("online", onOnline)
    window.addEventListener("offline", onOffline)
    return ()=>{
      window.removeEventListener("online", onOnline)
      window.removeEventListener("offline", onOffline)
    }
  },[])

  function handleSearch(q){
    const r = searchDevices(devices, q)
    setResults(r)
  }

  return (
    <div className="app">
      <div className="header">
        <div className="logo">IS</div>
        <div>
          <h1 style={{margin:0}}>IsoSwitch</h1>
          <div style={{color:"var(--muted)"}}>Tra cứu máy cắt cần cô lập</div>
        </div>
      </div>

      <SearchForm onSearch={handleSearch} />

      {offline && <div className="offline">⚠️ Đang ở chế độ Offline — dữ liệu cục bộ vẫn dùng được</div>}

      <div style={{marginTop:12}}>
        {results.length===0 && <div style={{color:"var(--muted)",marginTop:8}} className="card">Chưa có kết quả. Thử nhập mã KKS hoặc mã cáp.</div>}
        {results.map(dev=> <ResultCard key={dev.id} device={dev} />)}
      </div>

      <footer style={{color:"var(--muted)",marginTop:20}}>
        © IsoSwitch — PWA demo. Import devices.json để đổi dữ liệu.
      </footer>
    </div>
  )
}
