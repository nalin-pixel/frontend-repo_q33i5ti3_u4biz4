import { useEffect, useMemo, useState } from 'react';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import FoodSearch from './components/FoodSearch';
import StatsHistory from './components/StatsHistory';
import SmartSuggestion from './components/SmartSuggestion';

const LS_PROFILE = 'twelve_profile';
const LS_HARI = 'twelve_hariIni';
const LS_HISTORY = 'twelve_history';

function sampleWeekFromHistory(history, targetKalori) {
  // Compose last 7 days; if empty, start with zeros
  const hari = ['Sen','Sel','Rab','Kam','Jum','Sab','Min'];
  if (!history || history.length === 0) {
    return hari.map((h) => ({ hari: h, kalori: 0 }));
  }
  // Use last 7 entries or pad
  const last7 = history.slice(-7);
  const padded = Array(Math.max(0, 7 - last7.length)).fill({ tanggal: '', total: 0 });
  const merged = [...padded, ...last7];
  return merged.map((d, i) => ({ hari: hari[i], kalori: d.total || 0 }));
}

export default function App() {
  const [profile, setProfile] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [activeTab, setActiveTab] = useState('sarapan');
  const [hariIni, setHariIni] = useState([]);
  const [history, setHistory] = useState([]);

  // Load from localStorage on first mount
  useEffect(() => {
    try {
      const p = localStorage.getItem(LS_PROFILE);
      if (p) setProfile(JSON.parse(p));
      const h = localStorage.getItem(LS_HARI);
      if (h) setHariIni(JSON.parse(h));
      const hist = localStorage.getItem(LS_HISTORY);
      if (hist) setHistory(JSON.parse(hist));
    } catch {}
  }, []);

  // Persist profile and foods
  useEffect(() => {
    if (profile) {
      localStorage.setItem(LS_PROFILE, JSON.stringify(profile));
    }
  }, [profile]);

  useEffect(() => {
    localStorage.setItem(LS_HARI, JSON.stringify(hariIni));
  }, [hariIni]);

  useEffect(() => {
    localStorage.setItem(LS_HISTORY, JSON.stringify(history));
  }, [history]);

  // Roll over to history once per day when app opens next day
  useEffect(() => {
    // Simple rollover using a date key
    const todayKey = new Date().toDateString();
    const lastKey = localStorage.getItem('twelve_last_open');
    if (lastKey && lastKey !== todayKey && hariIni.length > 0) {
      const total = hariIni.reduce((s, i) => s + i.kalori, 0);
      setHistory(prev => [...prev, { tanggal: lastKey, items: hariIni, total }]);
      setHariIni([]);
    }
    localStorage.setItem('twelve_last_open', todayKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleComplete = (data) => {
    setProfile(data);
  };

  const handleAddFood = () => setShowSearch(true);

  const addFood = (item) => {
    setHariIni((prev) => [...prev, { ...item, waktu: activeTab }]);
  };

  const totalMakro = useMemo(()=> {
    const protein = hariIni.reduce((s,i)=>s+i.protein,0);
    const karbo = hariIni.reduce((s,i)=>s+i.karbo,0);
    const lemak = hariIni.reduce((s,i)=>s+i.lemak,0);
    return {
      protein,
      karbo,
      lemak,
      targetKalori: profile?.targetKalori || 2000,
      history: (history || []).slice(-2).map((h,i)=> ({
        tanggal: i===0? 'Kemarin' : '2 Hari Lalu',
        items: h.items || [],
        total: h.total || 0,
      })),
    };
  }, [hariIni, profile, history]);

  if (!profile) {
    return <Onboarding onComplete={handleComplete} />;
  }

  const weekly = sampleWeekFromHistory(history, profile.targetKalori);

  return (
    <div className="font-sans text-slate-900 bg-white">
      <Dashboard profile={profile} hariIni={hariIni} onAddFood={handleAddFood} activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="mx-auto max-w-[420px] px-4 pb-8 space-y-4">
        <SmartSuggestion profile={profile} proteinNow={totalMakro.protein} />
        <StatsHistory weekly={weekly} totalMakro={totalMakro} />
      </div>
      {showSearch && (
        <FoodSearch onClose={()=>setShowSearch(false)} onAdd={addFood} />
      )}
    </div>
  );
}
