import React, { useState } from 'react';
import { motion } from 'motion/react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Calendar, 
  Activity, 
  TrendingUp, 
  UserPlus,
  Stethoscope,
  User,
  ClipboardList,
  FileText,
  Shield,
  Pill,
  AlertCircle,
  Package,
  History,
  Settings,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export default function Dashboard() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const role = profile?.role || 'PHARMACIST';
  const today = format(new Date(), 'EEEE, d MMMM yyyy');

  const initialPatients = [
    { id: '1', name: 'Budi Santoso', age: 45, time: '09:00', status: 'Menunggu', medicines: 'Paracetamol 500mg, Ambroxol Syr' },
    { id: '2', name: 'Siti Aminah', age: 32, time: '09:30', status: 'Selesai', medicines: 'Vit. B Complex, Folavit' },
    { id: '3', name: 'Andi Wijaya', age: 28, time: '10:15', status: 'Periksa', medicines: 'Ibuprofen 400mg' },
    { id: '4', name: 'Lia Lestari', age: 35, time: '11:00', status: 'Menunggu', medicines: 'Cetirizine 10mg' },
    { id: '5', name: 'Hendra Pratama', age: 50, time: '11:30', status: 'Menunggu', medicines: 'Metformin 500mg' },
  ];

  const [patients, setPatients] = useState(initialPatients);

  const handleMarkDone = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPatients(prev => prev.map(p => p.id === id ? { ...p, status: 'Selesai' } : p));
  };

  const getStats = () => {
    if (role === 'ADMIN') {
      return [
        { label: 'Total Pasien', value: '1,284', trend: '+12%', icon: Users, color: 'text-blue-600', bgColor: 'bg-blue-50' },
        { label: 'Pendapatan Klinik', value: 'Rp 45.2jt', trend: '+8%', icon: TrendingUp, color: 'text-emerald-600', bgColor: 'bg-emerald-50' },
        { label: 'Admin Aktif', value: '2', trend: 'Stabil', icon: Shield, color: 'text-amber-600', bgColor: 'bg-amber-50' },
        { label: 'Staff Medis', value: '12', trend: '+1', icon: Stethoscope, color: 'text-purple-600', bgColor: 'bg-purple-50' },
      ];
    }
    if (role === 'DOCTOR') {
      const doneCount = patients.filter(p => p.status === 'Selesai').length;
      return [
        { label: 'Pasien Hari Ini', value: patients.length.toString(), trend: `Selesai: ${doneCount}`, icon: Users, color: 'text-blue-600', bgColor: 'bg-blue-50' },
        { label: 'Jadwal Berikutnya', value: '10:30', trend: 'Andi Wijaya', icon: Calendar, color: 'text-emerald-600', bgColor: 'bg-emerald-50' },
        { label: 'Laporan Pending', value: '3', trend: 'Rekam Medis', icon: ClipboardList, color: 'text-amber-600', bgColor: 'bg-amber-50' },
        { label: 'Rata-rata Periksa', value: '15m', trend: 'Hari Ini', icon: Activity, color: 'text-purple-600', bgColor: 'bg-purple-50' },
      ];
    }
    return [
      { label: 'Inventaris Obat', value: '124', trend: 'Jenis', icon: Pill, color: 'text-blue-600', bgColor: 'bg-blue-50' },
      { label: 'Resep Masuk', value: '8', trend: 'Hari Ini', icon: ClipboardList, color: 'text-emerald-600', bgColor: 'bg-emerald-50' },
      { label: 'Stok Menipis', value: '12', trend: 'Segera Order', icon: AlertCircle, color: 'text-amber-600', bgColor: 'bg-amber-50' },
      { label: 'Obat Terjual', value: '45', trend: 'Item', icon: Activity, color: 'text-purple-600', bgColor: 'bg-purple-50' },
    ];
  };

  const getQuickActions = () => {
    switch (role) {
      case 'ADMIN':
        return [
          { label: 'Data Dokter', icon: Stethoscope, path: '/app/doctors', color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Data Pasien', icon: Users, path: '/app/patients', color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Jadwal Praktek', icon: Calendar, path: '/app/schedule', color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Pemeriksaan', icon: Activity, path: '/app/medical-records', color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Rekam Medis', icon: History, path: '/app/history', color: 'text-rose-600', bg: 'bg-rose-50' },
          { label: 'Laporan', icon: FileText, path: '/app/reports', color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'User Mgt', icon: Settings, path: '/app/users', color: 'text-slate-600', bg: 'bg-slate-100' },
        ];
      case 'DOCTOR':
        return [
          { label: 'Jadwal Praktek', icon: Calendar, path: '/app/schedule', color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Pemeriksaan', icon: Activity, path: '/app/medical-records', color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Rekam Medis', icon: History, path: '/app/history', color: 'text-rose-600', bg: 'bg-rose-50' },
          { label: 'Laporan', icon: FileText, path: '/app/reports', color: 'text-purple-600', bg: 'bg-purple-50' },
        ];
      case 'PHARMACIST':
        return [
          { label: 'Data Pasien', icon: Users, path: '/app/patients', color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Data Obat', icon: Pill, path: '/app/pharmacy', color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Stok Obat', icon: Package, path: '/app/pharmacy', color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Resep Pasien', icon: ClipboardList, path: '/app/pharmacy', color: 'text-amber-600', bg: 'bg-amber-50' },
        ];
      default:
        return [];
    }
  };

  const getDashboardContent = () => {
    switch (role) {
      case 'ADMIN':
        return {
          title: 'Panel Administrasi Pusat',
          subtitle: 'Pantau seluruh operasional klinik dari satu tempat.',
          color: 'from-blue-600 to-indigo-700'
        };
      case 'DOCTOR':
        return {
          title: 'Ruang Kerja Dokter',
          subtitle: 'Kelola jadwal pemeriksaan dan rekam medis pasien hari ini.',
          color: 'from-medical-600 to-blue-700'
        };
      case 'PHARMACIST':
        return {
          title: 'Manajemen Farmasi & Apotek',
          subtitle: 'Kelola inventaris obat dan verifikasi resep pasien.',
          color: 'from-emerald-600 to-teal-700'
        };
      default:
        return null;
    }
  };

  const content = getDashboardContent();
  const stats = getStats();
  const quickActions = getQuickActions();
  if (!content) return null;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-10">
      {/* Welcome Section */}
      <div className={`relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br ${content.color} p-8 md:p-12 text-white shadow-2xl transition-all duration-500`}>
        <div className="relative z-10 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block py-1 px-3 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
              e-Clinic OS v1.0
            </span>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 leading-tight">
              {content.title}, <br /> {profile?.full_name?.split(' ')[0]}
            </h1>
            <p className="text-white/80 text-lg font-medium italic">
              "{content.subtitle}"
            </p>
          </motion.div>
        </div>
        
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-2xl -ml-20 -mb-20"></div>
      </div>

      {/* Quick Access Menu */}
      <div className="space-y-4">
         <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
           <ChevronRight size={12} className="text-blue-600" />
           Akses Fitur Utama
         </h4>
         <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {quickActions.map((action, i) => (
               <motion.button
                key={i}
                whileHover={{ y: -4 }}
                onClick={() => navigate(action.path)}
                className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center gap-3 hover:border-blue-300 hover:shadow-lg transition-all group"
               >
                  <div className={`p-3 rounded-xl ${action.bg} ${action.color} group-hover:scale-110 transition-transform`}>
                     <action.icon size={20} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-tight text-slate-600 text-center">{action.label}</span>
               </motion.button>
            ))}
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
           {/* Patients Table */}
           <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[500px]">
             <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
               <div>
                 <h3 className="text-lg font-black text-slate-800">Pasien Hari Ini</h3>
                 <p className="text-xs text-slate-500 font-medium">{today}</p>
               </div>
               <button onClick={() => navigate('/app/medical-records')} className="text-[10px] font-black uppercase text-blue-600 hover:underline">Lihat Semua Antrian</button>
             </div>
             <div className="overflow-auto flex-1">
               <table className="w-full text-left">
                  <thead className="sticky top-0 bg-slate-50 z-10 shadow-sm">
                    <tr>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Waktu</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Pasien</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Obat yang Diterima</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {patients.map((p) => (
                      <tr 
                        key={p.id} 
                        onClick={() => navigate(`/app/medical-records?id=${p.id}`)}
                        className="hover:bg-slate-50 transition-colors group cursor-pointer"
                      >
                        <td className="px-6 py-5">
                           <span className="text-sm font-black text-slate-800 tracking-tighter">{p.time}</span>
                        </td>
                        <td className="px-6 py-5">
                           <div className="flex flex-col">
                             <span className="text-sm font-black text-slate-800">{p.name}</span>
                             <span className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">{p.age} Tahun</span>
                           </div>
                        </td>
                        <td className="px-6 py-5 text-sm text-slate-600 font-medium">
                          {p.medicines}
                        </td>
                        <td className="px-6 py-5 text-center">
                          <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest inline-block min-w-[80px] ${
                            p.status === 'Selesai' ? 'bg-emerald-100 text-emerald-700' :
                            p.status === 'Periksa' ? 'bg-blue-100 text-blue-700 animate-pulse' :
                            'bg-amber-100 text-amber-700'
                          }`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-right">
                          {p.status !== 'Selesai' ? (
                            <button 
                              onClick={(e) => handleMarkDone(p.id, e)}
                              className="bg-emerald-500 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all opacity-0 group-hover:opacity-100 shadow-lg shadow-emerald-100 transform active:scale-95"
                            >
                              Selesai
                            </button>
                          ) : (
                            <div className="flex items-center justify-end text-emerald-500 gap-1 opacity-60">
                              <Shield size={14} />
                              <span className="text-[10px] font-black uppercase">Tuntas</span>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
               </table>
             </div>
           </div>

           {/* Stats Section */}
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -5 }}
                  className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex items-center gap-6 group hover:border-blue-200 transition-all"
                >
                  <div className={`p-4 rounded-2xl ${stat.bgColor} ${stat.color} group-hover:scale-110 transition-transform`}>
                    <stat.icon size={26} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                    <p className="text-3xl font-black text-slate-800 tracking-tight">{stat.value}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 opacity-60">{stat.trend}</p>
                  </div>
                </motion.div>
              ))}
           </div>
        </div>

        <div className="space-y-8">
           {/* Schedule Panel */}
           <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group">
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                   <div className="p-3 bg-blue-500/20 rounded-2xl text-blue-400">
                      <Calendar size={20} />
                   </div>
                   <h3 className="text-xl font-black tracking-tight">Jadwal Praktek</h3>
                </div>
                
                <div className="space-y-4">
                   <div className="p-5 bg-white/10 rounded-[1.5rem] border border-white/10 backdrop-blur-sm group-hover:bg-white/15 transition-all">
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Sesi Pagi</p>
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-glow shadow-emerald-500/50"></span>
                      </div>
                      <p className="text-lg font-black">{format(new Date(), 'EEEE')}: 08h - 12h</p>
                      <p className="text-[10px] text-white/40 mt-2 font-bold uppercase italic tracking-tighter tracking-widest">Status: Sedang Berlangsung</p>
                   </div>
                   <div className="p-5 bg-white/5 rounded-[1.5rem] border border-white/5 opacity-60">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Sesi Sore</p>
                      <p className="text-lg font-black opacity-40">16:00 - 20:00</p>
                      <p className="text-[10px] text-white/20 mt-2 font-bold uppercase">Mulai dalam 4 jam</p>
                   </div>
                </div>
                
                <button 
                  onClick={() => navigate('/app/schedule')}
                  className="w-full mt-8 py-5 bg-blue-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-blue-500/10 active:scale-95"
                >
                  Konfigurasi Harian
                </button>
              </div>
              
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl -mr-16 -mt-16 animate-pulse"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-500/20 rounded-full blur-2xl -ml-12 -mb-12"></div>
           </div>

           <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
              <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
                <div className="p-2 bg-amber-50 rounded-lg text-amber-500">
                  <AlertCircle size={18} />
                </div>
                Pemberitahuan
              </h3>
              <div className="space-y-4">
                 <div className="pl-4 border-l-4 border-blue-500 py-3 bg-blue-50/30 rounded-r-xl">
                    <p className="text-xs font-black text-slate-800">Review Laporan Bulanan</p>
                    <p className="text-[9px] text-slate-400 font-bold uppercase mt-1">Sisa Waktu: 24 Jam</p>
                 </div>
                 <div className="pl-4 border-l-4 border-emerald-500 py-3 bg-emerald-50/30 rounded-r-xl">
                    <p className="text-xs font-black text-slate-800">Seminar Medis CDK</p>
                    <p className="text-[9px] text-slate-400 font-bold uppercase mt-1">Hari Ini • 14:00 WITA</p>
                 </div>
                 <div className="pl-4 border-l-4 border-rose-500 py-3 bg-rose-50/30 rounded-r-xl">
                    <p className="text-xs font-black text-slate-800">Update Stok Apotek</p>
                    <p className="text-[9px] text-slate-400 font-bold uppercase mt-1">5 Item Menipis</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
