import { useMemo, useState } from 'react';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import FoodSearch from './components/FoodSearch';
import StatsHistory from './components/StatsHistory';

function sampleWeek(targetKalori) {
  const hari = ['Sen','Sel','Rab','Kam','Jum','Sab','Min'];
  return hari.map((h, i) => ({ hari: h, kalori: Math.round(targetKalori * (0.7 + Math.random()*0.6)) }));
}

export default function App() {
  const [profile, setProfile] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [activeTab, setActiveTab] = useState('sarapan');
  const [hariIni, setHariIni] = useState([]);

  const handleComplete = (data) => {
    setProfile(data);
  };

  const handleAddFood = () => setShowSearch(true);

  const addFood = (item) => {
    setHariIni(prev => [...prev, { ...item, waktu: activeTab }]);
  };

  const totalMakro = useMemo(()=> ({
    protein: hariIni.reduce((s,i)=>s+i.protein,0),
    karbo: hariIni.reduce((s,i)=>s+i.karbo,0),
    lemak: hariIni.reduce((s,i)=>s+i.lemak,0),
    targetKalori: profile?.targetKalori || 2000,
    history: [
      { tanggal: 'Kemarin', items: [], total: Math.round((profile?.targetKalori||2000)*0.9) },
      { tanggal: '2 hari lalu', items: [], total: Math.round((profile?.targetKalori||2000)*1.1) },
    ],
  }), [hariIni, profile]);

  if (!profile) {
    return <Onboarding onComplete={handleComplete} />;
  }

  return (
    <div className="font-sans text-slate-800">
      <Dashboard profile={profile} hariIni={hariIni} onAddFood={handleAddFood} activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="mx-auto max-w-[420px] px-4 pb-8">
        <StatsHistory weekly={sampleWeek(profile.targetKalori)} totalMakro={totalMakro} />
      </div>
      {showSearch && (
        <FoodSearch onClose={()=>setShowSearch(false)} onAdd={addFood} />
      )}
    </div>
  );
}
