import { useMemo } from 'react';
import { Plus, Utensils, Coffee, Sandwich } from 'lucide-react';
import { motion } from 'framer-motion';

function RingProgress({ value, target }) {
  const percent = Math.min(100, Math.round((value / target) * 100)) || 0;
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="relative h-32 w-32">
      <svg className="h-32 w-32 -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={radius} stroke="#EEF2F6" strokeWidth="12" fill="none" />
        <circle cx="60" cy="60" r={radius} stroke="#AAD15F" strokeWidth="12" strokeLinecap="round" fill="none" strokeDasharray={circumference} strokeDashoffset={offset} />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <p className="text-xs text-slate-500">Kalori</p>
          <p className="text-xl font-semibold text-slate-900">{value}</p>
          <p className="text-[10px] text-slate-500">dari {target} kkal</p>
        </div>
      </div>
    </div>
  );
}

function MakroBar({ label, value, total, color }) {
  const percent = Math.min(100, Math.round((value / total) * 100)) || 0;
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs text-slate-600">
        <span>{label}</span>
        <span>{value} g</span>
      </div>
      <div className="h-2 w-full rounded-full bg-slate-100">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
          className="h-2 rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  );
}

function MealTab({ title, items }) {
  const total = useMemo(() => items.reduce((s, i) => s + i.kalori, 0), [items]);
  return (
    <div>
      <div className="mb-2 text-sm font-medium text-slate-900">{title} · {total} kkal</div>
      <div className="space-y-2">
        {items.length === 0 && (
          <div className="rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-600">Belum ada catatan. Tambahkan makananmu.</div>
        )}
        {items.map((it, idx) => (
          <motion.div
            key={idx}
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.25, delay: idx * 0.03 }}
            className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-[0_6px_30px_rgba(0,0,0,0.06)] ring-1 ring-slate-200/70"
          >
            <div className="h-10 w-10 rounded-md bg-gradient-to-br from-slate-100 to-slate-200 shadow-inner" />
            <div className="flex-1">
              <div className="text-sm font-medium text-slate-900">{it.nama}</div>
              <div className="text-xs text-slate-600">{it.porsi}</div>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold text-slate-900">{it.kalori} kkal</div>
              <div className="text-[10px] text-slate-500">P{it.protein}·K{it.karbo}·L{it.lemak}</div>
            </div>
          </motion.div>
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
    <div className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-[420px] px-4 pb-28 pt-6">
        <div className="mb-4">
          <p className="text-sm text-slate-500">Halo,</p>
          <h1 className="text-2xl font-semibold text-slate-900">{profile?.nama || 'Kamu'}</h1>
        </div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="mb-4 flex items-center gap-4 rounded-2xl bg-white p-4 shadow-[0_6px_30px_rgba(0,0,0,0.06)] ring-1 ring-slate-200/70">
          <RingProgress value={totalKal} target={profile?.targetKalori || 2000} />
          <div className="flex-1">
            <div className="mb-2 text-sm text-slate-600">Target Harian</div>
            <div className="grid gap-2">
              <MakroBar label="Protein" value={makro.protein} total={Math.round((profile?.targetKalori || 2000) * 0.3 / 4)} color="#F64336" />
              <MakroBar label="Karbohidrat" value={makro.karbo} total={Math.round((profile?.targetKalori || 2000) * 0.5 / 4)} color="#1A96F0" />
              <MakroBar label="Lemak" value={makro.lemak} total={Math.round((profile?.targetKalori || 2000) * 0.2 / 9)} color="#FF981F" />
            </div>
          </div>
        </motion.div>

        <div className="mb-3 grid grid-cols-4 gap-2">
          {tabNames.map((t, i) => (
            <motion.button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: i * 0.03 }}
              className={`flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-medium shadow-[0_6px_30px_rgba(0,0,0,0.06)] ring-1 ${activeTab===t.key ? 'bg-[#AAD15F] text-white ring-transparent' : 'bg-white text-slate-900 ring-slate-200/70'}`}
            >
              <t.icon className="h-4 w-4" /> {t.label}
            </motion.button>
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
          <motion.button whileTap={{ scale: 0.98 }} onClick={onAddFood} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#AAD15F] px-4 py-4 text-white shadow-lg">
            <Plus className="h-5 w-5" /> Tambah Makanan
          </motion.button>
        </div>
      </div>
    </div>
  );
}
