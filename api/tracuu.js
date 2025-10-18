import devices from '../data/devices.json';

export default function handler(req, res) {
  const { ma } = req.query;

  if (!ma) {
    return res.status(400).json({ error: 'Chưa nhập mã KKS hoặc cáp' });
  }

  // Hỗ trợ tra cứu nhiều mã cùng lúc, phân tách bằng dấu phẩy
  const maArr = ma.split(',').map(m => m.trim());

  const ketqua = devices.filter(d => maArr.includes(d.kks) || maArr.includes(d.cap));

  if (ketqua.length === 0) {
    return res.status(404).json({ error: 'Không tìm thấy thiết bị' });
  }

  const output = ketqua.map(d => ({ tu: d.tu, ten: d.ten }));

  res.status(200).json(output);
}
