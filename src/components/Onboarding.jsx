import { useState } from 'react';
import { ChevronRight } from 'lucide-react';

const aktivitasOptions = [
  { key: 'sedentary', label: 'Sangat minim (jarang olahraga)', factor: 1.2 },
  { key: 'light', label: 'Ringan (1-3x/minggu)', factor: 1.375 },
  { key: 'moderate', label: 'Sedang (3-5x/minggu)', factor: 1.55 },
  { key: 'active', label: 'Aktif (6-7x/minggu)', factor: 1.725 },
  { key: 'athlete', label: 'Sangat aktif (latihan berat)', factor: 1.9 },
];

const tujuanOptions = [
  { key: 'cut', label: 'Menurunkan berat badan', delta: -300 },
  { key: 'maintain', label: 'Menjaga berat', delta: 0 },
  { key: 'bulk', label: 'Menambah massa otot', delta: 300 },
];

function hitungBMR({ jenisKelamin, berat, tinggi, usia }) {
  if (jenisKelamin === 'pria') {
    return 10 * berat + 6.25 * tinggi - 5 * usia + 5;
  }
  return 10 * berat + 6.25 * tinggi - 5 * usia - 161;
}

export default function Onboarding({ onComplete }) {
  const [nama, setNama] = useState('');
  const [jenisKelamin, setJenisKelamin] = useState('pria');
  const [usia, setUsia] = useState('');
  const [tinggi, setTinggi] = useState('');
  const [berat, setBerat] = useState('');
  const [aktivitas, setAktivitas] = useState(aktivitasOptions[1]);
  const [tujuan, setTujuan] = useState(tujuanOptions[1]);

  const valid = nama && usia && tinggi && berat;

  const handleSubmit = (e) => {
    e.preventDefault();
    const bmr = hitungBMR({ jenisKelamin, berat: Number(berat), tinggi: Number(tinggi), usia: Number(usia) });
    const tdee = Math.round(bmr * (aktivitas?.factor || 1.375));
    const target = Math.max(1200, Math.round(tdee + (tujuan?.delta || 0)));
    onComplete({
      nama,
      jenisKelamin,
      usia: Number(usia),
      tinggi: Number(tinggi),
      berat: Number(berat),
      aktivitas,
      tujuan,
      bmr: Math.round(bmr),
      tdee,
      targetKalori: target,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-emerald-100 text-slate-800">
      <div className="mx-auto max-w-[420px] px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-emerald-900">Selamat Datang di GiziNusantara</h1>
          <p className="mt-1 text-sm text-emerald-800/80">Pelacak kebutuhan dan asupan kalori harian khas Indonesia.</p>
        </div>

        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold text-emerald-900">Kuisioner Awal</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm">Nama</label>
              <input value={nama} onChange={(e)=>setNama(e.target.value)} className="w-full rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-400" placeholder="Nama panggilan" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-sm">Jenis Kelamin</label>
                <select value={jenisKelamin} onChange={(e)=>setJenisKelamin(e.target.value)} className="w-full rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2">
                  <option value="pria">Pria</option>
                  <option value="wanita">Wanita</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm">Usia</label>
                <input type="number" min={10} max={100} value={usia} onChange={(e)=>setUsia(e.target.value)} className="w-full rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2" placeholder="tahun" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-sm">Tinggi Badan</label>
                <input type="number" value={tinggi} onChange={(e)=>setTinggi(e.target.value)} className="w-full rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2" placeholder="cm" />
              </div>
              <div>
                <label className="mb-1 block text-sm">Berat Badan</label>
                <input type="number" value={berat} onChange={(e)=>setBerat(e.target.value)} className="w-full rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2" placeholder="kg" />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm">Tingkat Aktivitas</label>
              <select value={aktivitas.key} onChange={(e)=>setAktivitas(aktivitasOptions.find(a=>a.key===e.target.value))} className="w-full rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2">
                {aktivitasOptions.map(opt=> (
                  <option key={opt.key} value={opt.key}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm">Tujuan</label>
              <select value={tujuan.key} onChange={(e)=>setTujuan(tujuanOptions.find(t=>t.key===e.target.value))} className="w-full rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2">
                {tujuanOptions.map(opt=> (
                  <option key={opt.key} value={opt.key}>{opt.label}</option>
                ))}
              </select>
            </div>

            <button disabled={!valid} className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300">
              Lanjutkan <ChevronRight className="h-4 w-4" />
            </button>
          </form>
        </div>

        <p className="mt-4 text-center text-xs text-emerald-900/70">Data kamu dipakai untuk menghitung BMR dan TDEE guna menentukan target kalori harian.</p>
      </div>
    </div>
  );
}
