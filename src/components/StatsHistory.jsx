import { useMemo } from 'react';

function Bar({ value, max, label }) {
  const h = Math.max(6, Math.round((value / max) * 80));
  return (
    <div className="flex flex-col items-center justify-end">
      <div className="mb-1 h-20 w-6 rounded-full bg-slate-100 p-1">
        <div className="h-full w-full rounded-full bg-[#AAD15F]" style={{ height: `${h}px` }} />
      </div>
      <div className="text-[10px] text-slate-500">{label}</div>
    </div>
  );
}

export default function StatsHistory({ weekly, totalMakro }) {
  const max = useMemo(() => Math.max(1000, ...weekly.map(d=>d.kalori)), [weekly]);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-white p-4 shadow-[0_6px_30px_rgba(0,0,0,0.06)] ring-1 ring-slate-200/70">
        <div className="mb-3 text-sm font-semibold text-slate-900">Kalori 7 Hari Terakhir</div>
        <div className="flex items-end justify-between gap-2">
          {weekly.map((d,i)=> (
            <Bar key={i} value={d.kalori} max={max} label={d.hari} />
          ))}
        </div>
        <p className="mt-3 text-xs text-slate-600">Kamu mencapai {Math.round((weekly.reduce((s,d)=>s+d.kalori,0)/(weekly.length*totalMakro.targetKalori))*100)}% target kalori minggu ini, pertahankan konsistensimu!</p>
      </div>

      <div className="rounded-2xl bg-white p-4 shadow-[0_6px_30px_rgba(0,0,0,0.06)] ring-1 ring-slate-200/70">
        <div className="mb-3 text-sm font-semibold text-slate-900">Makronutrisi</div>
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-[#F6FAEF] p-3 text-center">
            <div className="text-xs text-slate-600">Protein</div>
            <div className="text-lg font-semibold text-slate-900">{totalMakro.protein} g</div>
          </div>
          <div className="rounded-xl bg-[#F6FAEF] p-3 text-center">
            <div className="text-xs text-slate-600">Karbohidrat</div>
            <div className="text-lg font-semibold text-slate-900">{totalMakro.karbo} g</div>
          </div>
          <div className="rounded-xl bg-[#F6FAEF] p-3 text-center">
            <div className="text-xs text-slate-600">Lemak</div>
            <div className="text-lg font-semibold text-slate-900">{totalMakro.lemak} g</div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-4 shadow-[0_6px_30px_rgba(0,0,0,0.06)] ring-1 ring-slate-200/70">
        <div className="mb-2 text-sm font-semibold text-slate-900">Riwayat Makan</div>
        <div className="space-y-2">
          {totalMakro.history.map((h, idx) => (
            <div key={idx} className="flex items-center justify-between rounded-xl bg-[#F6FAEF] p-3 ring-1 ring-slate-200/70">
              <div>
                <div className="text-sm font-medium text-slate-900">{h.tanggal}</div>
                <div className="text-xs text-slate-600">{h.items.length} item</div>
              </div>
              <div className="text-sm font-semibold text-slate-900">{h.total} kkal</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
