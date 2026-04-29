import { LogOut, Bell, Search, User, X, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function Header() {
  const { signOut, profile } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, title: 'Antrian Pasien', message: 'Pasien Budi Santoso telah menunggu di poli umum.', time: '5m ago', type: 'info', icon: User },
    { id: 2, title: 'Peringatan Obat', message: 'Stok Paracetamol 500mg di apotek menipis.', time: '1h ago', type: 'warning', icon: AlertCircle },
    { id: 3, title: 'Jadwal Dokter', message: 'dr. Sarah memulai jam praktek lebih cepat hari ini.', time: '2h ago', type: 'success', icon: CheckCircle2 },
  ];

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if it fails, try to navigate
      navigate('/login');
    }
  };

  return (
    <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-10 shrink-0 z-50 shadow-sm">
      <div className="flex-1">
        <h2 className="text-[10px] font-black text-slate-800 uppercase tracking-[0.2em] hidden md:block italic">Klinik Management System <span className="text-blue-600">v1.2</span></h2>
      </div>

      <div className="flex items-center gap-8">
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={`relative group p-3 hover:bg-slate-50 rounded-2xl transition-all border ${showNotifications ? 'bg-blue-50 border-blue-100 text-blue-600' : 'bg-white border-transparent text-slate-400 hover:border-slate-100'}`}
          >
            <Bell size={20} className={showNotifications ? 'text-blue-600' : 'group-hover:text-blue-600'} />
            <span className="absolute top-3 right-3 w-2 h-2 bg-rose-500 rounded-full border-2 border-white shadow-sm"></span>
          </button>

          <AnimatePresence>
            {showNotifications && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)}></div>
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-4 w-96 bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden z-50 py-2"
                >
                  <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Notifikasi</h3>
                    <button onClick={() => setShowNotifications(false)} className="text-slate-300 hover:text-rose-500 transition-colors">
                      <X size={16} />
                    </button>
                  </div>
                  <div className="max-h-[400px] overflow-y-auto">
                    {notifications.map((n) => (
                      <div key={n.id} className="p-6 hover:bg-slate-50 transition-colors border-b border-slate-50 cursor-pointer group last:border-none">
                        <div className="flex gap-4">
                          <div className={`p-3 rounded-2xl shrink-0 ${
                            n.type === 'warning' ? 'bg-amber-50 text-amber-600' : 
                            n.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                          }`}>
                            <n.icon size={18} />
                          </div>
                          <div>
                            <p className="text-xs font-black text-slate-900 uppercase tracking-tight mb-1 group-hover:text-blue-600 transition-colors">{n.title}</p>
                            <p className="text-xs text-slate-500 font-medium leading-relaxed">{n.message}</p>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-2">{n.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-6 bg-slate-50 text-center">
                    <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:text-slate-900 transition-colors">Lihat Semua Notifikasi</button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
        
        <div className="h-8 w-px bg-slate-200"></div>

        <button 
          onClick={handleLogout}
          className="flex items-center gap-5 pl-2 group cursor-pointer border-none bg-transparent outline-none"
        >
          <div className="text-right hidden sm:block">
            <p className="text-xs font-black text-slate-900 leading-none group-hover:text-blue-600 transition-colors uppercase tracking-tight">{profile?.full_name}</p>
            <p className="text-[9px] text-slate-400 uppercase tracking-[0.2em] mt-1.5 font-black opacity-60 italic">{profile?.role}</p>
          </div>
          <div className="p-1 px-3 bg-slate-100 rounded-xl relative overflow-hidden group-hover:bg-blue-600 transition-all duration-500">
            <div className="relative z-10 flex items-center gap-2 py-2 text-[10px] text-slate-600 group-hover:text-white transition-all font-black uppercase tracking-widest">
              <span>Logout</span>
              <LogOut size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </button>
      </div>
    </header>
  );
}
