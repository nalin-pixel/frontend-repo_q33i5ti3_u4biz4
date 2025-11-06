import { useMemo, useState } from 'react';
import { Search, ChevronDown, Plus, X } from 'lucide-react';

const populer = [
  { nama: 'Nasi Putih', porsi: '1 piring - 150 gram (porsi dewasa)', kalori: 260, protein: 4, karbo: 57, lemak: 0, gambar: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800&auto=format&fit=crop' },
  { nama: 'Rendang', porsi: '1 potong (ukuran RM Padang)', kalori: 200, protein: 17, karbo: 3, lemak: 13, gambar: 'https://images.unsplash.com/photo-1633945274405-2f1028b1a272?q=80&w=800&auto=format&fit=crop' },
  { nama: 'Ayam Goreng', porsi: '1 potong paha', kalori: 250, protein: 22, karbo: 8, lemak: 14, gambar: 'https://images.unsplash.com/photo-1604908554007-0274a4be7bfb?q=80&w=800&auto=format&fit=crop' },
  { nama: 'Sayur Lodeh', porsi: '1 mangkuk kecil', kalori: 150, protein: 4, karbo: 10, lemak: 10, gambar: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?q=80&w=800&auto=format&fit=crop' },
  { nama: 'Tempe Goreng', porsi: '2 potong', kalori: 180, protein: 10, karbo: 12, lemak: 10, gambar: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=800&auto=format&fit=crop' },
  { nama: 'Sate Ayam', porsi: '10 tusuk + lontong', kalori: 400, protein: 28, karbo: 45, lemak: 12, gambar: 'https://images.unsplash.com/photo-1600326145359-2d3110b89b42?q=80&w=800&auto=format&fit=crop' },
  { nama: 'Bubur Ayam', porsi: '1 mangkuk', kalori: 300, protein: 12, karbo: 45, lemak: 8, gambar: 'https://images.unsplash.com/photo-1505577801800-8c337021c231?q=80&w=800&auto=format&fit=crop' },
  { nama: 'Nasi Uduk', porsi: '1 piring', kalori: 500, protein: 10, karbo: 65, lemak: 20, gambar: 'https://images.unsplash.com/photo-1576402187878-974f70c890a5?q=80&w=800&auto=format&fit=crop' },
  { nama: 'Mie Goreng', porsi: '1 piring', kalori: 420, protein: 12, karbo: 60, lemak: 14, gambar: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?q=80&w=800&auto=format&fit=crop' },
  { nama: 'Pisang Goreng', porsi: '2 buah', kalori: 280, protein: 3, karbo: 40, lemak: 12, gambar: 'https://images.unsplash.com/photo-1604908177520-c18fef3de2a3?q=80&w=800&auto=format&fit=crop' },
  { nama: 'Martabak', porsi: '1 potong', kalori: 350, protein: 8, karbo: 40, lemak: 18, gambar: 'https://images.unsplash.com/photo-1617195737495-7d7a8a798edc?q=80&w=800&auto=format&fit=crop' },
  { nama: 'Es Teh Manis', porsi: '1 gelas', kalori: 120, protein: 0, karbo: 30, lemak: 0, gambar: 'https://images.unsplash.com/photo-1541976590-713941681591?q=80&w=800&auto=format&fit=crop' },
  { nama: 'Susu Coklat', porsi: '1 gelas', kalori: 180, protein: 8, karbo: 24, lemak: 6, gambar: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=800&auto=format&fit=crop' },
  { nama: 'Kopi Susu', porsi: '1 gelas', kalori: 110, protein: 3, karbo: 12, lemak: 5, gambar: 'https://images.unsplash.com/photo-1498804103079-a6351b050096?q=80&w=800&auto=format&fit=crop' },
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
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-emerald-900/40 p-0 sm:items-center sm:p-6">
      <div className="w-full max-w-[420px] rounded-t-2xl bg-white p-4 shadow-xl sm:rounded-2xl">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-emerald-900">Cari Makanan</h3>
          <button onClick={onClose} className="rounded-full p-2 text-emerald-700 hover:bg-emerald-50"><X className="h-5 w-5"/></button>
        </div>

        <div className="mb-3 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2">
          <Search className="h-4 w-4 text-emerald-700" />
          <input value={q} onChange={(e)=>setQ(e.target.value)} className="w-full bg-transparent outline-none" placeholder="Cari makanan/minuman khas Indonesia" />
        </div>

        <div className="grid max-h-[50vh] gap-3 overflow-y-auto pb-2">
          {list.map((i, idx) => (
            <button key={idx} onClick={()=>setSelected(i)} className={`flex items-center gap-3 rounded-xl p-3 text-left shadow-sm ${selected?.nama===i.nama? 'bg-emerald-100' : 'bg-white'}`}>
              <img src={i.gambar} alt={i.nama} className="h-14 w-14 rounded-lg object-cover" />
              <div className="flex-1">
                <div className="text-sm font-semibold text-emerald-900">{i.nama}</div>
                <div className="text-xs text-emerald-700/80">{i.porsi}</div>
              </div>
              <div className="text-sm font-semibold text-emerald-900">≈ {i.kalori} kkal</div>
            </button>
          ))}
          {list.length===0 && (
            <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-sm text-emerald-700">Tidak ditemukan. Coba kata kunci lain.</div>
          )}
        </div>

        {selected && (
          <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50 p-3">
            <div className="mb-2 flex items-center gap-3">
              <img src={selected.gambar} alt={selected.nama} className="h-16 w-16 rounded-lg object-cover" />
              <div>
                <div className="text-sm font-semibold text-emerald-900">{selected.nama}</div>
                <div className="text-xs text-emerald-700/80">{selected.porsi}</div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <button onClick={()=>setPorsi('kecil')} className={`rounded-lg px-2 py-2 ${porsi==='kecil'?'bg-emerald-600 text-white':'bg-white'}`}>Porsi Kecil</button>
              <button onClick={()=>setPorsi('default')} className={`rounded-lg px-2 py-2 ${porsi==='default'?'bg-emerald-600 text-white':'bg-white'}`}>Porsi Umum</button>
              <button onClick={()=>setPorsi('besar')} className={`rounded-lg px-2 py-2 ${porsi==='besar'?'bg-emerald-600 text-white':'bg-white'}`}>Porsi Besar</button>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <div className="text-sm text-emerald-800/80">Jumlah Porsi</div>
              <input type="number" min={1} value={jumlah} onChange={(e)=>setJumlah(e.target.value)} className="w-20 rounded-lg border border-emerald-200 bg-white px-2 py-1 text-right" />
            </div>
            <button onClick={handleAdd} className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-white">
              <Plus className="h-4 w-4"/> Tambahkan ke Mangkuk
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
