import React, { useEffect, useState, useRef } from "react";
import supabase from "../supabase";

const icons = {
  kks: "🆔",
  cap: "🔌",
  cb: "⚡",
  name: "📌",
  p: "📊",
  vitri: "📍",
  tu: "🗄️",
  mc: "⚡",
  kks_mc: "🔗",
  kks_load: "📎",
  note: "📝"
};

const labelsDevice = {
  kks: "MÃ KKS",
  cap: "MÃ CÁP",
  tu: "MÃ MC CẤP NGUỒN",
  name_vi: "TÊN TIẾNG VIỆT (VI)",
  name_en: "TÊN TIẾNG ANH (EN)",
  power: "CÔNG SUẤT"
};
const labelsCI = {
  kks: "MÃ KKS",
  cap: "MÃ CÁP",
  cb: "CB",
  name: "TÊN THIẾT BỊ",
  p: "CÔNG SUẤT (kW)",
  vitri: "VỊ TRÍ",
  tu: "MÃ TỦ",
  mc: "MÁY CẮT CẤP NGUỒN",
  kks_mc: "KKS TẠI MC",
  kks_load: "KKS TẠI PHỤ TẢI",
  note: "GHI CHÚ",
};
const fieldsDevice = [
  "kks",
  "cap",
  "tu",
  "power"
];

const fieldsCI = [
  "kks",
  "cap",
  "cb",
  "p",
  "vitri",
  "tu",
  "mc",
  "kks_mc",
  "kks_load",
  "note"
];




export default function ResultCard({ device, highlight, type, onBack }) {
  const [showEdit, setShowEdit] = useState(false);

  const [editForm, setEditForm] = useState({

    kks: device.kks || "",

    cap: device.cap || "",

    tu: device.tu || "",

    name_en: device.name_en || "",

    name_vi: device.name_vi || "",

    power: device.power || ""

  });

  const [editCIForm, setEditCIForm] = useState({

    tu: device.tu || "",
    vitri: device.vitri || "",
    mc: device.mc || "",
    cb: device.cb || "",

    kks: device.kks || "",
    name: device.name || "",

    p: device.p || "",
    cap: device.cap || "",

    kks_mc: device.kks_mc || "",
    kks_load: device.kks_load || ""

  });

  const [sendingEdit, setSendingEdit] = useState(false);
  const [comments, setComments] = useState([]);
  const [author, setAuthor] = useState(
    localStorage.getItem("author") || ""
  );
  const channelRef = useRef(null);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const fields = type === "ci" ? fieldsCI : fieldsDevice;
  const labels = type === "ci" ? labelsCI : labelsDevice;


  // LOAD COMMENT RIÊNG THEO THIẾT BỊ
  // LOAD COMMENT RIÊNG THEO THIẾT BỊ
  async function loadComments() {

    const kks = (device?.kks || "").trim();
    if (!kks) return;

    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .eq("device_kks", kks)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setComments(data || []);
  }



  /* LOAD BAN ĐẦU + REALTIME */


  useEffect(() => {

    const kks = (device?.kks || "").trim();

    // 🔥 luôn reset trước
    setComments([]);

    // ❌ không có KKS thì không load
    if (!kks) return;

    loadComments();

  }, [device?.kks]);



  async function addComment() {

    if (!note.trim()) return;

    setSaving(true);

    localStorage.setItem(
      "author",
      author
    );

    const textToSave = note;

    setNote("");

    const { error } = await supabase
      .from("comments")
      .insert({
        device_kks: device.kks,
        author: author || "Ẩn danh",
        comment: textToSave
      });

    setSaving(false);

    if (error) {
      alert("Không lưu được comment");
      console.error(error);
      return;
    }


    /* backup sync nếu mobile websocket ngủ */
    loadComments();

  }

  async function submitEdit() {

    if (!editForm.kks.trim()) {

      alert("Thiếu KKS");

      return;
    }

    setSendingEdit(true);

    const exists = !!device?.kks;

    const { error } = await supabase
      .from("device_edits")
      .insert({

        device_kks: editForm.kks,

        cap: editForm.cap,

        tu: editForm.tu,

        name_en: editForm.name_en,

        name_vi: editForm.name_vi,

        power: editForm.power,

        author: author || "Ẩn danh",

        status: "pending"

      });

    setSendingEdit(false);

    if (error) {

      console.error(error);

      alert("Không gửi được");

      return;
    }

    alert(
      exists
        ? "Đã gửi đề xuất cập nhật"
        : "Đã gửi đề xuất thiết bị mới"
    );

  }

  async function submitCIEdit() {

    if (!editCIForm.kks.trim()) {

      alert("Thiếu KKS");

      return;
    }

    setSendingEdit(true);

    const { error } = await supabase
      .from("ci_edits")
      .insert({

        tu: editCIForm.tu,

        vitri: editCIForm.vitri,

        mc: editCIForm.mc,

        cb: editCIForm.cb,

        kks: editCIForm.kks,

        name: editCIForm.name,

        p: editCIForm.p,

        cap: editCIForm.cap,

        kks_mc: editCIForm.kks_mc,

        kks_load: editCIForm.kks_load,

        author: author || "Ẩn danh",

        status: "pending"

      });

    setSendingEdit(false);

    if (error) {

      console.error(error);

      alert("Không gửi được");

      return;
    }

    alert("Đã gửi cập nhật CI");

  }


  const highlightText = (text) => {
    if (!text) return text;

    let t = text.toString();

    (highlight || []).forEach(h => {
      const regex = new RegExp(`(${h})`, "gi");

      t = t.replace(
        regex,
        `<mark style="
background:#ffd54a;
padding:2px 5px;
border-radius:6px;
font-weight:600;
color:#000;">
$1
</mark>`
      );
    });

    return t;
  };


  return (
    <div style={cardWrap}>

      {type === "ci" && (
        <button
          onClick={onBack}
          style={{
            marginBottom: 10,
            background: "#222",
            color: "#fff",
            border: "none",
            padding: "6px 10px",
            borderRadius: 6,
            cursor: "pointer"
          }}
        >
          ← Quay lại danh sách
        </button>
      )}

      {/* HEADER */}
      <div style={header}>
        <div>
          {type === "device" ? (

            <>
              <div style={title}>
                ⚙ {device.name_en || "UNKNOWN DEVICE"}
              </div>

              <div style={subtitle}>
                {device.name_vi || "⚠ Chưa cập nhật"}
              </div>
            </>

          ) : (

            <>
              <div style={title}>
                ⚙ {device.name || "THIẾT BỊ"}
              </div>

              <div style={subtitle}>
                IsoFind CI Information
              </div>
            </>

          )}
        </div>

        <div style={liveBadge}>
          LIVE
        </div>
      </div>


      {/* INFO */}
      <div style={grid}>


        {fields.map((key) => {
          const value = device[key];

          return (
            <div key={key} style={cardField}>
              <div style={labelStyle}>
                {icons[key]} {labels[key]}
              </div>

              <div
                style={{
                  ...valueStyle,
                  opacity: value ? 1 : 0.4
                }}
              >

                {key === "cap" && device.caps?.length > 0 ? (

                  device.caps.map((c, i) => (

                    <div
                      key={i}
                      dangerouslySetInnerHTML={{
                        __html: highlightText(c)
                      }}
                    />

                  ))

                ) : (

                  <div
                    dangerouslySetInnerHTML={{
                      __html: highlightText(value || "—")
                    }}
                  />

                )}

              </div>
            </div>
          );
        })}
      </div>


      <div style={{
        display: "flex",
        marginTop: 18
      }}>

      </div>

      {/* EDIT SUGGESTION */}

      <div style={editWrap}>

        <button
          onClick={() =>
            setShowEdit(!showEdit)
          }
          style={editToggleBtn}
        >

          {showEdit
            ? "✖ Đóng cập nhật"
            : "✏️ Cập nhật thiết bị"}

        </button>

        {showEdit && type === "device" && (

          <>

            <div style={{
              fontWeight: 700,
              marginBottom: 16
            }}>

              📝 {device?.kks
                ? "Cập nhật thiết bị"
                : "Thêm thiết bị"}

            </div>

            <input
              placeholder="KKS"
              value={editForm.kks}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  kks: e.target.value
                })
              }
              style={inputStyle}
            />

            <input
              placeholder="Mã cáp"
              value={editForm.cap}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  cap: e.target.value
                })
              }
              style={inputStyle}
            />

            <input
              placeholder="Máy cắt cấp nguồn"
              value={editForm.tu}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  tu: e.target.value
                })
              }
              style={inputStyle}
            />

            <input
              placeholder="Tên tiếng Anh"
              value={editForm.name_en}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  name_en: e.target.value
                })
              }
              style={inputStyle}
            />

            <input
              placeholder="Tên tiếng Việt"
              value={editForm.name_vi}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  name_vi: e.target.value
                })
              }
              style={inputStyle}
            />

            <input
              placeholder="Công suất"
              value={editForm.power}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  power: e.target.value
                })
              }
              style={inputStyle}
            />

            <button
              onClick={submitEdit}
              disabled={sendingEdit}
              style={btnGreen}
            >

              {sendingEdit
                ? "Đang gửi..."
                : "Gửi đề xuất"}

            </button>

          </>

        )}

        {showEdit && type === "ci" && (

          <>

            <div style={{
              fontWeight: 700,
              marginBottom: 16
            }}>
              📝 Cập nhật CI
            </div>

            {fieldsCI.map((field) => (

              <input
                key={field}

                placeholder={labelsCI[field]}

                value={editCIForm[field] || ""}

                onChange={(e) =>
                  setEditCIForm({
                    ...editCIForm,
                    [field]: e.target.value
                  })
                }

                style={inputStyle}
              />

            ))}

            <button
              onClick={submitCIEdit}
              disabled={sendingEdit}
              style={btnGreen}
            >

              {sendingEdit
                ? "Đang gửi..."
                : "Gửi cập nhật CI"}

            </button>

          </>

        )}

      </div>
      {/* COMMENTS */}
      <div style={commentWrap}>

        <div style={{
          fontWeight: 700,
          fontSize: 16,
          marginBottom: 12
        }}>
          💬 Lịch sử ghi chú
        </div>


        {comments.length === 0 && (
          <div style={{
            opacity: .65,
            fontSize: 13,
            marginBottom: 12
          }}>
            Chưa có ghi chú cho thiết bị này.
          </div>
        )}


        {comments.map(c => (

          <div
            key={c.id}
            style={commentBubble}
          >

            <div style={{
              fontSize: 12,
              color: "#8fb0d8",
              fontWeight: 600
            }}>
              👷 {c.author}
            </div>

            <div style={{
              marginTop: 6
            }}>
              {c.comment}
            </div>

            <div style={{
              marginTop: 8,
              fontSize: 11,
              opacity: .5
            }}>
              {new Date(
                c.created_at
              ).toLocaleString()}
            </div>

          </div>

        ))}



        <input
          value={author}
          onChange={(e) =>
            setAuthor(e.target.value)
          }
          placeholder="Tên người ghi chú"
          style={inputStyle}
        />


        <textarea
          rows="3"
          value={note}
          onChange={(e) =>
            setNote(e.target.value)
          }
          placeholder="Thêm ghi chú vận hành..."
          style={textareaStyle}
        />


        <button
          onClick={addComment}
          disabled={saving}
          style={btnBlue}
        >
          {saving
            ? "Đang lưu..."
            : "Lưu ghi chú"}
        </button>


      </div>

    </div>
  )

}



/* STYLES */

const cardWrap = {
  background: "linear-gradient(145deg,#162235,#0f172a)",
  border: "1px solid rgba(255,255,255,.08)",
  borderRadius: "22px",
  padding: "22px",
  marginBottom: "18px",
  boxShadow: "0 8px 30px rgba(0,0,0,.35)"
}

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "18px"
}

const title = {
  fontSize: "20px",
  fontWeight: 700
}

const subtitle = {
  fontSize: "16px",
  fontWeight: 600,
  color: "#cbd5e1",
  marginTop: "6px",
  lineHeight: "1.4"
}

const liveBadge = {
  background: "#2563eb",
  padding: "6px 12px",
  borderRadius: "12px",
  fontSize: "12px",
  fontWeight: 600
}

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
  gap: "14px"
}

const cardField = {
  background: "rgba(255,255,255,.03)",
  padding: "14px",
  borderRadius: "16px"
}

const labelStyle = {
  fontSize: 12,
  color: "#94a3b8",
  letterSpacing: 0.5

}

const valueStyle = {
  fontSize: 16,
  fontWeight: 600,
  color: "#e5e7eb",
  marginTop: "12px"


}

const commentWrap = {
  marginTop: "26px",
  paddingTop: "18px",
  borderTop: "1px solid rgba(255,255,255,.08)"
}

const commentBubble = {
  background: "#1e293b",
  padding: "12px",
  borderRadius: "12px",
  marginBottom: "10px"
}

const inputStyle = {
  width: "100%",
  background: "#1e293b",
  border: "1px solid #334155",
  color: "#fff",
  padding: "12px",
  borderRadius: "12px",
  marginTop: "12px",
  outline: "none"
}

const textareaStyle = {
  width: "100%",
  background: "#1e293b",
  border: "1px solid #334155",
  color: "#fff",
  padding: "12px",
  borderRadius: "12px",
  marginTop: "10px",
  outline: "none"
}

const btnBlue = {
  marginTop: "12px",
  background: "#2563eb",
  color: "#fff",
  border: "none",
  padding: "10px 16px",
  borderRadius: "12px",
  cursor: "pointer"
}

const btnGreen = {
  background: "#059669",
  color: "#fff",
  border: "none",
  padding: "10px 16px",
  borderRadius: "12px",
  cursor: "pointer"
}

const editWrap = {

  marginTop: "24px",

  paddingTop: "18px",

  borderTop: "1px solid rgba(255,255,255,.08)"

};

const editToggleBtn = {

  width: "100%",

  padding: "14px",

  border: "none",

  borderRadius: "14px",

  background: "#1d4ed8",

  color: "#fff",

  fontWeight: 700,

  cursor: "pointer",

  marginBottom: "14px"

};