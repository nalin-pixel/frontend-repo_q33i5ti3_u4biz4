import { useMemo, useState } from 'react';
import { Plus, Utensils, Coffee, Sandwich } from 'lucide-react';

function RingProgress({ value, target }) {
  const percent = Math.min(100, Math.round((value / target) * 100)) || 0;
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="relative h-32 w-32">
      <svg className="h-32 w-32 -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={radius} stroke="#E2F7EC" strokeWidth="12" fill="none" />
        <circle cx="60" cy="60" r={radius} stroke="#10B981" strokeWidth="12" strokeLinecap="round" fill="none" strokeDasharray={circumference} strokeDashoffset={offset} />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <p className="text-xs text-emerald-800/70">Kalori</p>
          <p className="text-xl font-semibold text-emerald-900">{value}</p>
          <p className="text-[10px] text-emerald-700/70">dari {target} kkal</p>
        </div>
      </div>
    </div>
  );
}

function MakroBar({ label, value, total, color }) {
  const percent = Math.min(100, Math.round((value / total) * 100)) || 0;
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs text-emerald-900/80">
        <span>{label}</span>
        <span>{value} g</span>
      </div>
      <div className="h-2 w-full rounded-full bg-emerald-100">
        <div className="h-2 rounded-full" style={{ width: `${percent}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

function MealTab({ title, items }) {
  const total = useMemo(() => items.reduce((s, i) => s + i.kalori, 0), [items]);
  return (
    <div>
      <div className="mb-2 text-sm font-medium text-emerald-900">{title} · {total} kkal</div>
      <div className="space-y-2">
        {items.length === 0 && (
          <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-xs text-emerald-700">Belum ada catatan. Tambahkan makananmu.</div>
        )}
        {items.map((it, idx) => (
          <div key={idx} className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm">
            <img src={it.gambar} alt={it.nama} className="h-10 w-10 rounded-md object-cover" />
            <div className="flex-1">
              <div className="text-sm font-medium text-emerald-900">{it.nama}</div>
              <div className="text-xs text-emerald-700/80">{it.porsi}</div>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold text-emerald-900">{it.kalori} kkal</div>
              <div className="text-[10px] text-emerald-700/70">P{it.protein}·K{it.karbo}·L{it.lemak}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Dashboard({ profile, hariIni, onAddFood, activeTab, setActiveTab }) {
  const totalKal = hariIni.reduce((s, i) => s + i.kalori, 0);
  const makro = hariIni.reduce((acc, i) => ({
    protein: acc.protein + i.protein,
    karbo: acc.karbo + i.karbo,
    lemak: acc.lemak + i.lemak,
  }), { protein: 0, karbo: 0, lemak: 0 });

  const tabNames = [
    { key: 'sarapan', label: 'Sarapan', icon: Coffee },
    { key: 'siang', label: 'Makan Siang', icon: Sandwich },
    { key: 'malam', label: 'Makan Malam', icon: Utensils },
    { key: 'camilan', label: 'Camilan', icon: Plus },
  ];

  const grouped = {
    sarapan: hariIni.filter(i => i.waktu === 'sarapan'),
    siang: hariIni.filter(i => i.waktu === 'siang'),
    malam: hariIni.filter(i => i.waktu === 'malam'),
    camilan: hariIni.filter(i => i.waktu === 'camilan'),
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-emerald-100 text-slate-800">
      <div className="mx-auto max-w-[420px] px-4 pb-28 pt-6">
        <div className="mb-4">
          <p className="text-sm text-emerald-800/80">Halo,</p>
          <h1 className="text-2xl font-semibold text-emerald-900">{profile?.nama || 'Kamu'}</h1>
        </div>

        <div className="mb-4 flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm">
          <RingProgress value={totalKal} target={profile?.targetKalori || 2000} />
          <div className="flex-1">
            <div className="mb-2 text-sm text-emerald-800/80">Target Harian</div>
            <div className="grid gap-2">
              <MakroBar label="Protein" value={makro.protein} total={Math.round((profile?.targetKalori || 2000) * 0.3 / 4)} color="#059669" />
              <MakroBar label="Karbohidrat" value={makro.karbo} total={Math.round((profile?.targetKalori || 2000) * 0.5 / 4)} color="#34D399" />
              <MakroBar label="Lemak" value={makro.lemak} total={Math.round((profile?.targetKalori || 2000) * 0.2 / 9)} color="#A7F3D0" />
            </div>
          </div>
        </div>

        <div className="mb-3 grid grid-cols-4 gap-2">
          {tabNames.map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key)} className={`flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-medium ${activeTab===t.key ? 'bg-emerald-600 text-white' : 'bg-white text-emerald-800'} shadow-sm`}>
              <t.icon className="h-4 w-4" /> {t.label}
            </button>
          ))}
        </div>

        <div className="rounded-2xl p-2">
          {activeTab === 'sarapan' && <MealTab title="Sarapan" items={grouped.sarapan} />}
          {activeTab === 'siang' && <MealTab title="Makan Siang" items={grouped.siang} />}
          {activeTab === 'malam' && <MealTab title="Makan Malam" items={grouped.malam} />}
          {activeTab === 'camilan' && <MealTab title="Camilan" items={grouped.camilan} />}
        </div>
      </div>

      <div className="fixed bottom-4 left-0 right-0">
        <div className="mx-auto max-w-[420px] px-4">
          <button onClick={onAddFood} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-4 text-white shadow-lg">
            <Plus className="h-5 w-5" /> Tambah Makanan
          </button>
        </div>
      </div>
    </div>
  );
}
