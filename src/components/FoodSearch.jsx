import { useMemo, useState } from 'react';
import { Search, Plus, X } from 'lucide-react';
import { motion } from 'framer-motion';
import Spline from '@splinetool/react-spline';

// Expanded food & beverage database (common in Jakarta & Bandung)
const populer = [
  // Sarapan & umum
  { nama: 'Nasi Putih', porsi: '1 piring (150 g)', kalori: 260, protein: 4, karbo: 57, lemak: 0 },
  { nama: 'Nasi Uduk', porsi: '1 piring', kalori: 500, protein: 10, karbo: 65, lemak: 20 },
  { nama: 'Bubur Ayam', porsi: '1 mangkuk', kalori: 300, protein: 12, karbo: 45, lemak: 8 },
  { nama: 'Lontong Sayur', porsi: '1 porsi', kalori: 420, protein: 12, karbo: 55, lemak: 14 },
  { nama: 'Ketoprak', porsi: '1 porsi', kalori: 520, protein: 18, karbo: 62, lemak: 22 },
  { nama: 'Gado-Gado', porsi: '1 porsi', kalori: 450, protein: 20, karbo: 38, lemak: 24 },
  { nama: 'Nasi Kuning', porsi: '1 piring', kalori: 480, protein: 10, karbo: 70, lemak: 16 },
  { nama: 'Nasi Goreng', porsi: '1 piring', kalori: 550, protein: 16, karbo: 70, lemak: 20 },
  { nama: 'Mie Goreng', porsi: '1 piring', kalori: 420, protein: 12, karbo: 60, lemak: 14 },
  { nama: 'Mie Ayam', porsi: '1 mangkuk', kalori: 450, protein: 20, karbo: 60, lemak: 12 },
  { nama: 'Bakso', porsi: '1 mangkuk', kalori: 380, protein: 18, karbo: 45, lemak: 10 },
  { nama: 'Soto Betawi', porsi: '1 mangkuk', kalori: 520, protein: 24, karbo: 22, lemak: 34 },
  { nama: 'Soto Bandung', porsi: '1 mangkuk', kalori: 350, protein: 22, karbo: 20, lemak: 18 },
  { nama: 'Rawon', porsi: '1 mangkuk', kalori: 430, protein: 28, karbo: 18, lemak: 22 },
  { nama: 'Gudeg', porsi: '1 porsi', kalori: 500, protein: 18, karbo: 65, lemak: 16 },
  { nama: 'Rendang', porsi: '1 potong', kalori: 200, protein: 17, karbo: 3, lemak: 13 },
  { nama: 'Ayam Goreng', porsi: '1 potong paha', kalori: 250, protein: 22, karbo: 8, lemak: 14 },
  { nama: 'Ayam Bakar', porsi: '1 potong', kalori: 220, protein: 24, karbo: 5, lemak: 10 },
  { nama: 'Ikan Bakar', porsi: '1 potong', kalori: 200, protein: 26, karbo: 0, lemak: 8 },
  { nama: 'Tempe Goreng', porsi: '2 potong', kalori: 180, protein: 10, karbo: 12, lemak: 10 },
  { nama: 'Tahu Goreng', porsi: '2 potong', kalori: 150, protein: 8, karbo: 8, lemak: 9 },
  { nama: 'Pecel Lele', porsi: '1 porsi', kalori: 520, protein: 28, karbo: 35, lemak: 28 },
  { nama: 'Ayam Penyet', porsi: '1 porsi', kalori: 600, protein: 30, karbo: 50, lemak: 28 },
  { nama: 'Sate Ayam', porsi: '10 tusuk + lontong', kalori: 400, protein: 28, karbo: 45, lemak: 12 },
  { nama: 'Sate Padang', porsi: '1 porsi', kalori: 520, protein: 26, karbo: 50, lemak: 22 },
  { nama: 'Siomay Bandung', porsi: '1 porsi', kalori: 380, protein: 20, karbo: 45, lemak: 12 },
  { nama: 'Batagor', porsi: '1 porsi', kalori: 450, protein: 22, karbo: 48, lemak: 18 },
  { nama: 'Kupat Tahu', porsi: '1 porsi', kalori: 420, protein: 16, karbo: 52, lemak: 14 },
  { nama: 'Nasi Liwet', porsi: '1 piring', kalori: 520, protein: 14, karbo: 75, lemak: 16 },
  { nama: 'Sop Buntut', porsi: '1 mangkuk', kalori: 480, protein: 28, karbo: 20, lemak: 28 },
  { nama: 'Iga Bakar', porsi: '1 porsi', kalori: 650, protein: 32, karbo: 20, lemak: 38 },
  // Camilan
  { nama: 'Pisang Goreng', porsi: '2 buah', kalori: 280, protein: 3, karbo: 40, lemak: 12 },
  { nama: 'Cimol', porsi: '1 porsi', kalori: 320, protein: 4, karbo: 52, lemak: 10 },
  { nama: 'Cireng', porsi: '1 porsi', kalori: 300, protein: 4, karbo: 50, lemak: 10 },
  { nama: 'Seblak', porsi: '1 porsi', kalori: 420, protein: 10, karbo: 55, lemak: 16 },
  { nama: 'Martabak Manis', porsi: '1 potong', kalori: 350, protein: 8, karbo: 40, lemak: 18 },
  { nama: 'Martabak Telur', porsi: '1 potong', kalori: 320, protein: 10, karbo: 28, lemak: 18 },
  { nama: 'Pempek', porsi: '1 porsi', kalori: 380, protein: 16, karbo: 50, lemak: 12 },
  { nama: 'Roti Bakar', porsi: '1 porsi', kalori: 420, protein: 10, karbo: 55, lemak: 14 },
  // Minuman
  { nama: 'Air Putih', porsi: '1 gelas', kalori: 0, protein: 0, karbo: 0, lemak: 0 },
  { nama: 'Es Teh Manis', porsi: '1 gelas', kalori: 120, protein: 0, karbo: 30, lemak: 0 },
  { nama: 'Teh Tawar', porsi: '1 gelas', kalori: 2, protein: 0, karbo: 0, lemak: 0 },
  { nama: 'Kopi Hitam', porsi: '1 gelas', kalori: 5, protein: 0, karbo: 0, lemak: 0 },
  { nama: 'Kopi Susu Gula Aren', porsi: '1 gelas', kalori: 180, protein: 3, karbo: 30, lemak: 5 },
  { nama: 'Susu Coklat', porsi: '1 gelas', kalori: 180, protein: 8, karbo: 24, lemak: 6 },
  { nama: 'Jus Alpukat', porsi: '1 gelas', kalori: 250, protein: 3, karbo: 28, lemak: 14 },
  { nama: 'Jus Jambu', porsi: '1 gelas', kalori: 140, protein: 1, karbo: 32, lemak: 0 },
];

export default function FoodSearch({ onClose, onAdd }) {
  const [q, setQ] = useState('');
  const [selected, setSelected] = useState(null);
  const [jumlah, setJumlah] = useState(1);
  const [porsi, setPorsi] = useState('default');

  const list = useMemo(() => populer.filter(i => i.nama.toLowerCase().includes(q.toLowerCase())), [q]);

  const handleAdd = () => {
    if (!selected) return;
    const mult = Number(jumlah) || 1;
    onAdd({
      ...selected,
      porsi: selected.porsi + (porsi === 'besar' ? ' (porsi besar)' : porsi === 'kecil' ? ' (porsi kecil)' : ''),
      kalori: Math.round(selected.kalori * mult * (porsi === 'besar' ? 1.6 : porsi === 'kecil' ? 0.7 : 1)),
      protein: Math.round(selected.protein * mult * (porsi === 'besar' ? 1.6 : porsi === 'kecil' ? 0.7 : 1)),
      karbo: Math.round(selected.karbo * mult * (porsi === 'besar' ? 1.6 : porsi === 'kecil' ? 0.7 : 1)),
      lemak: Math.round(selected.lemak * mult * (porsi === 'besar' ? 1.6 : porsi === 'kecil' ? 0.7 : 1)),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 p-0 sm:items-center sm:p-6">
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.25 }} className="w-full max-w-[420px] rounded-t-2xl bg-white p-4 shadow-xl sm:rounded-2xl">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">Cari Makanan</h3>
          <button onClick={onClose} className="rounded-full p-2 text-slate-700 hover:bg-slate-100"><X className="h-5 w-5"/></button>
        </div>

        <div className="mb-3 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
          <Search className="h-4 w-4 text-slate-500" />
          <input value={q} onChange={(e)=>setQ(e.target.value)} className="w-full bg-transparent outline-none" placeholder="Cari makanan/minuman khas Indonesia" />
        </div>

        <div className="grid max-h-[50vh] gap-3 overflow-y-auto pb-2">
          {list.map((i, idx) => (
            <motion.button
              key={idx}
              onClick={()=>setSelected(i)}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: idx * 0.02 }}
              className={`flex items-center gap-3 rounded-xl p-3 text-left shadow-[0_6px_30px_rgba(0,0,0,0.06)] ring-1 ${selected?.nama===i.nama? 'bg-[#F6FAEF] ring-[#AAD15F]/40' : 'bg-white ring-slate-200/70'}`}
            >
              <div className="h-14 w-14 rounded-lg bg-slate-100" />
              <div className="flex-1">
                <div className="text-sm font-semibold text-slate-900">{i.nama}</div>
                <div className="text-xs text-slate-600">{i.porsi}</div>
              </div>
              <div className="text-sm font-semibold text-slate-900">≈ {i.kalori} kkal</div>
            </motion.button>
          ))}
          {list.length===0 && (
            <div className="rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-600">Tidak ditemukan. Coba kata kunci lain.</div>
          )}
        </div>

        {selected && (
          <div className="mt-4 rounded-xl border border-slate-200 bg-[#F6FAEF] p-3">
            <div className="mb-2 grid grid-cols-[4rem,1fr] items-center gap-3">
              <div className="relative h-16 w-16 overflow-hidden rounded-lg">
                <Spline scene="https://prod.spline.design/dx2k5x7Sqx7o2d0i/scene.splinecode" style={{ width: '100%', height: '100%' }} />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent to-white/60" />
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-900">{selected.nama}</div>
                <div className="text-xs text-slate-600">{selected.porsi}</div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <button onClick={()=>setPorsi('kecil')} className={`rounded-lg px-2 py-2 ${porsi==='kecil'?'bg-[#AAD15F] text-white':'bg-white ring-1 ring-slate-200'}`}>Porsi Kecil</button>
              <button onClick={()=>setPorsi('default')} className={`rounded-lg px-2 py-2 ${porsi==='default'?'bg-[#AAD15F] text-white':'bg-white ring-1 ring-slate-200'}`}>Porsi Umum</button>
              <button onClick={()=>setPorsi('besar')} className={`rounded-lg px-2 py-2 ${porsi==='besar'?'bg-[#AAD15F] text-white':'bg-white ring-1 ring-slate-200'}`}>Porsi Besar</button>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <div className="text-sm text-slate-600">Jumlah Porsi</div>
              <input type="number" min={1} value={jumlah} onChange={(e)=>setJumlah(e.target.value)} className="w-20 rounded-lg border border-slate-200 bg-white px-2 py-1 text-right" />
            </div>
            <button onClick={handleAdd} className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#AAD15F] px-4 py-3 text-white">
              <Plus className="h-4 w-4"/> Tambahkan ke Mangkuk
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
