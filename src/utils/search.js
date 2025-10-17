export function searchDevices(devices, q) {
  if (!q) return []
  q = q.trim().toLowerCase()
  return devices.filter(d => (
    (d.kks_code && d.kks_code.toLowerCase().includes(q)) ||
    (d.cable_code && d.cable_code.toLowerCase().includes(q)) ||
    (d.device_name && d.device_name.toLowerCase().includes(q))
  ))
}
