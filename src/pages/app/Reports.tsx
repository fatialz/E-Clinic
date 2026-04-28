import { useState, useMemo } from 'react';
import { 
  FileText, 
  Calendar, 
  Users, 
  Activity, 
  TrendingUp, 
  PieChart as PieIcon,
  BarChart3,
  Edit2,
  ChevronRight,
  CheckCircle2,
  Settings2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useToast } from '../../components/ui/ToastProvider';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Cell,
  PieChart,
  Pie,
  LineChart,
  Line
} from 'recharts';

export default function Reports() {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('April');
  const [selectedYear, setSelectedYear] = useState('2026');

  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  const years = ['2023', '2024', '2025', '2026'];

  // Base Data Template
  const generateMonthlyData = (month: string) => {
    // Generate slightly different data based on month string to simulate realism
    const seed = month.length;
    return {
      dailyVisits: [
        { name: 'Sen', visits: 40 + seed, patients: 35 + seed },
        { name: 'Sel', visits: 50 + seed, patients: 42 + seed },
        { name: 'Rab', visits: 45 - seed, patients: 38 - seed },
        { name: 'Kam', visits: 55 + seed * 2, patients: 48 + seed },
        { name: 'Jum', visits: 52, patients: 45 },
        { name: 'Sab', visits: 30 - seed, patients: 25 },
        { name: 'Min', visits: 12 + seed, patients: 10 },
      ],
      diagnoses: [
        { name: 'Influenza', value: 100 + seed * 5, color: '#3b82f6' },
        { name: 'Hipertensi', value: 80 + seed, color: '#10b981' },
        { name: 'Gastritis', value: 60 - seed, color: '#f59e0b' },
        { name: 'Asma', value: 25 + seed, color: '#ef4444' },
        { name: 'Lainnya', value: 40, color: '#6366f1' },
      ],
      metrics: {
        totalVisits: 300 + seed * 10,
        completedExams: 250 + seed * 8,
        avgPrescription: 140000 + seed * 1000,
        satisfaction: 4.7 + (seed % 3) * 0.1
      }
    };
  };

  // Editable Statistics Data
  const [statsData, setStatsData] = useState(generateMonthlyData('April'));

  // Effect to update data when month changes (simulated)
  useMemo(() => {
    setStatsData(generateMonthlyData(selectedMonth));
  }, [selectedMonth, selectedYear]);

  const totalPatients = useMemo(() => statsData.dailyVisits.reduce((acc, curr) => acc + curr.patients, 0), [statsData]);

  const updateVisit = (index: number, value: string) => {
    const val = parseInt(value) || 0;
    const newVisits = [...statsData.dailyVisits];
    newVisits[index] = { ...newVisits[index], visits: val, patients: Math.floor(val * 0.85) };
    setStatsData({ ...statsData, dailyVisits: newVisits });
  };

  const updateDiagnosis = (index: number, value: string) => {
    const val = parseInt(value) || 0;
    const newDiagnoses = [...statsData.diagnoses];
    newDiagnoses[index] = { ...newDiagnoses[index], value: val };
    setStatsData({ ...statsData, diagnoses: newDiagnoses });
  };

  const DataEditorModal = () => (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-end">
      <motion.div 
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col"
      >
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-slate-900 rounded-2xl text-white">
                <Settings2 size={20} />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Kustomisasi Data</h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Sesuaikan Angka untuk Realisme</p>
              </div>
           </div>
           <button 
            onClick={() => {
              setIsEditing(false);
              toast("Data telah disimpan.", "info");
            }} 
            className="text-slate-400 hover:text-rose-500 transition-colors uppercase text-[10px] font-black"
           >
              Simpan
           </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-10">
           {/* Daily Visits Editor */}
           <div className="space-y-6">
              <h4 className="text-xs font-black text-blue-600 uppercase tracking-[0.2em] flex items-center gap-2">
                <BarChart3 size={14} /> Kunjungan Harian (Minggu Ini)
              </h4>
              <div className="grid grid-cols-1 gap-3">
                 {statsData.dailyVisits.map((d, i) => (
                    <div key={d.name} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                       <span className="text-sm font-bold text-slate-700">{d.name}</span>
                       <div className="flex items-center gap-3">
                          <input 
                            type="number"
                            value={d.visits}
                            onChange={(e) => updateVisit(i, e.target.value)}
                            className="w-20 p-2 text-right bg-white border border-slate-200 rounded-xl text-sm font-black focus:border-blue-400 outline-none"
                          />
                          <span className="text-[10px] font-black text-slate-400 uppercase">Pasien</span>
                       </div>
                    </div>
                 ))}
              </div>
           </div>

           {/* Diagnosis Editor */}
           <div className="space-y-6">
              <h4 className="text-xs font-black text-emerald-600 uppercase tracking-[0.2em] flex items-center gap-2">
                <PieIcon size={14} /> Distribusi Diagnosa (Top 5)
              </h4>
              <div className="grid grid-cols-1 gap-3">
                 {statsData.diagnoses.map((d, i) => (
                    <div key={d.name} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                       <span className="text-sm font-bold text-slate-700">{d.name}</span>
                       <div className="flex items-center gap-3">
                          <input 
                            type="number"
                            value={d.value}
                            onChange={(e) => updateDiagnosis(i, e.target.value)}
                            className="w-20 p-2 text-right bg-white border border-slate-200 rounded-xl text-sm font-black focus:border-emerald-400 outline-none"
                          />
                          <span className="text-[10px] font-black text-slate-400 uppercase">Kasus</span>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>

        <div className="p-8 bg-slate-50 border-t border-slate-100">
           <button 
            onClick={() => {
              setIsEditing(false);
              toast("Statistik data berhasil diperbarui!", "success");
            }}
            className="w-full py-5 bg-slate-900 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-200 hover:bg-blue-600 transition-all flex items-center justify-center gap-3"
           >
              <CheckCircle2 size={16} />
              Selesai & Update Grafik
           </button>
        </div>
      </motion.div>
    </div>
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-10">
      <AnimatePresence>
        {isEditing && <DataEditorModal />}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3 uppercase tracking-tight">
            <div className="p-3 bg-blue-600 rounded-[1.2rem] text-white shadow-xl shadow-blue-100 italic">
              <BarChart3 size={24} />
            </div>
            Laporan Statistik
          </h1>
          <div className="flex items-center gap-3 mt-3">
            <div className="relative group">
              <select 
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="appearance-none bg-white border border-slate-200 px-4 py-2 pr-10 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-700 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all cursor-pointer shadow-sm"
              >
                {months.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <ChevronRight size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 rotate-90 pointer-events-none" />
            </div>
            <div className="relative group">
              <select 
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="appearance-none bg-white border border-slate-200 px-4 py-2 pr-10 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-700 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all cursor-pointer shadow-sm"
              >
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
              <ChevronRight size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 rotate-90 pointer-events-none" />
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-blue-100">
               <Calendar size={12} />
               <span>Periode Aktif</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
           <button 
            onClick={() => setIsEditing(true)}
            className="px-6 py-3.5 bg-white border-2 border-slate-900 text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-slate-100 hover:bg-slate-50 transition-all flex items-center gap-2 active:scale-95"
           >
             <Edit2 size={16} />
             Edit Data Grafik
           </button>
        </div>
      </div>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Kunjungan Pasien', value: totalPatients, trend: '+12%', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Diagnosis Selesai', value: statsData.diagnoses.reduce((a, b) => a + b.value, 0), trend: '+8%', icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'E-Resep Aktif', value: '142', trend: '+15%', icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Rata-rata Skor', value: '4.9/5', trend: 'Puas', icon: PieIcon, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        ].map((m, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group`}
          >
            <div className={`absolute top-0 right-0 w-24 h-24 ${m.bg} opacity-20 rounded-bl-[4rem] group-hover:scale-125 transition-transform`}></div>
            <div className="flex items-center justify-between mb-4 relative z-10">
               <div className={`p-2.5 ${m.bg} ${m.color} rounded-xl`}>
                 <m.icon size={18} />
               </div>
               <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{m.trend}</span>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{m.label}</p>
            <p className="text-3xl font-black text-slate-900 tracking-tighter">{m.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Visit Chart */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-100/50"
        >
          <div className="flex items-center justify-between mb-10">
             <div>
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Kunjungan Mingguan</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Statistik Harian vs Minggu Lalu</p>
             </div>
             <div className="flex gap-2">
                <div className="flex items-center gap-1.5">
                   <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                   <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Minggu Ini</span>
                </div>
             </div>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statsData.dailyVisits} barGap={8}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 900, fill: '#64748b' }}
                  dy={10}
                />
                <YAxis hide />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '12px' }}
                />
                <Bar 
                  dataKey="visits" 
                  fill="#2563eb" 
                  radius={[8, 8, 8, 8]} 
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Diagnosis Distribution */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-100/50"
        >
           <div className="flex items-center justify-between mb-10">
             <div>
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Top Diagnosa</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Distribusi Penyakit Terbanyak</p>
             </div>
             <PieIcon size={20} className="text-emerald-500" />
          </div>

          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="h-[300px] w-full md:w-1/2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statsData.diagnoses}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {statsData.diagnoses.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full md:w-1/2 space-y-4">
               {statsData.diagnoses.map((d, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-white transition-all group">
                     <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }}></div>
                        <span className="text-xs font-bold text-slate-700">{d.name}</span>
                     </div>
                     <span className="text-[10px] font-black text-slate-400">{d.value} KASUS</span>
                  </div>
               ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Insights */}
      <div className="bg-slate-900 rounded-[3rem] p-10 text-white flex flex-col md:flex-row items-center justify-between gap-10 overflow-hidden relative shadow-2xl shadow-blue-200/50">
         <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-600/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
         <div className="relative z-10 max-w-xl">
            <h3 className="text-3xl font-black italic mb-4">Insiden {selectedMonth} Terdeteksi</h3>
            <p className="text-slate-400 text-sm leading-relaxed font-medium">
               Berdasarkan data grafik harian periode <span className="text-blue-400 font-black">{selectedMonth} {selectedYear}</span>, terdapat lonjakan kunjungan rata-rata sebesar <span className="text-blue-400 font-black">28%</span> pada hari sibuk. Mayoritas diagnosa adalah <span className="text-blue-400 font-black">{statsData.diagnoses[0].name}</span> yang menunjukkan potensi tren kesehatan lokal di wilayah klinik.
            </p>
         </div>
      </div>
    </div>
  );
}
