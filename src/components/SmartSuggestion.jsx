import { motion } from 'framer-motion';

export default function SmartSuggestion({ profile, proteinNow }) {
  if (!profile) return null;
  const berat = profile.berat || 60;
  // Simple heuristic: protein target varies by goal
  const multiplier = profile?.tujuan?.key === 'bulk' ? 1.8 : profile?.tujuan?.key === 'cut' ? 1.6 : 1.7;
  const targetProtein = Math.round(berat * multiplier);
  const percent = Math.min(100, Math.round((proteinNow / targetProtein) * 100));

  const title = profile?.tujuan?.key === 'bulk'
    ? 'Fokus Massa Otot'
    : profile?.tujuan?.key === 'cut'
      ? 'Fokus Defisit Sehat'
      : 'Fokus Pemeliharaan';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="rounded-2xl bg-white p-4 shadow-[0_6px_30px_rgba(0,0,0,0.06)] ring-1 ring-slate-200/70"
    >
      <div className="mb-1 text-sm font-semibold text-slate-900">Saran Pintar · {title}</div>
      <p className="mb-3 text-xs text-slate-600">
        Disarankan konsumsi protein sekitar <span className="font-semibold text-slate-900">{targetProtein} g/hari</span>. Kamu sudah mencapai <span className="font-semibold text-slate-900">{proteinNow} g</span> ({percent}%).
      </p>
      <div className="h-2 w-full rounded-full bg-slate-100">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
          className="h-2 rounded-full"
          style={{ backgroundColor: '#AAD15F' }}
        />
      </div>
    </motion.div>
  );
}
