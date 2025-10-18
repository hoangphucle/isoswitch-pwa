import React from "react";

const icons = {
  kks: "🆔 MÃ KKS: ",
  caps: "🔌 MÃ CÁP: ",
  macb: "⚡ MÃ CB: ",
  ten: "📌 TÊN THIẾT BỊ: ",
  vitri: "📍 VỊ TRÍ: ",
  tu: "🗄️ NGĂN TỦ: ",
  thanhcai: "🟦 THANH CÁI CẤP: ",
};

export default function ResultCard({ device, highlight = [] }) {
  const highlightText = (text) => {
    if (!text) return text;
    let t = text;
    highlight.forEach(h => {
      const regex = new RegExp(`(${h})`, "gi");
      t = t.replace(regex, `<mark style="background:#ffcc00;color:#000;padding:0 2px;border-radius:2px;">$1</mark>`);
    });
    return t;
  };

  return (
    <div style={{ padding: "12px", backgroundColor: "#2c2c2e", borderRadius: "12px", marginBottom: "8px" }}>
      {Object.keys(icons).map((key) => {
        // xử lý caps riêng vì là mảng
        if (key === "caps" && device.caps && device.caps.length > 0) {
          return (
            <div key={key} style={{ marginBottom: "4px", fontSize: "14px" }}>
              <span style={{ marginRight: "6px" }}>{icons[key]}</span>
              <span dangerouslySetInnerHTML={{ __html: highlightText(device.caps.join(", ")) }} />
            </div>
          );
        }

        // các trường còn lại
        if (device[key]) {
          return (
            <div key={key} style={{ marginBottom: "4px", fontSize: "14px" }}>
              <span style={{ marginRight: "6px" }}>{icons[key]}</span>
              <span dangerouslySetInnerHTML={{ __html: highlightText(device[key]) }} />
            </div>
          );
        }

        return null;
      })}
    </div>
  );
}
