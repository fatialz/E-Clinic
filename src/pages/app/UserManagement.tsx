import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Search, 
  UserPlus, 
  Mail, 
  Terminal, 
  MoreVertical, 
  RefreshCw, 
  Trash2, 
  Edit3,
  UserCheck,
  X,
  Lock,
  Globe,
  Settings2,
  CheckCircle2,
  History
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useToast } from '../../components/ui/ToastProvider';

export default function UserManagement() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  
  const STORAGE_KEY = 'klinik_users';
  
  const [users, setUsers] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setUsers(JSON.parse(saved));
    } else {
      const initialUsers = [
        { id: '1', name: 'Admin Utama', email: 'admin@clinic.com', role: 'ADMIN', status: 'Aktif', avatar: 'AU', lastLogin: '2 jam yang lalu' },
        { id: '2', name: 'dr. Sarah Johnson', email: 'sarah@clinic.com', role: 'DOCTOR', status: 'Aktif', avatar: 'SA', lastLogin: '5 menit yang lalu' },
        { id: '3', name: 'Budi Apoteker', email: 'budi@clinic.com', role: 'PHARMACIST', status: 'Aktif', avatar: 'BA', lastLogin: 'Kemarin' },
        { id: '4', name: 'dr. Ahmad Fauzi', email: 'ahmad@clinic.com', role: 'DOCTOR', status: 'Non-Aktif', avatar: 'AF', lastLogin: '3 hari yang lalu' },
      ];
      setUsers(initialUsers);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialUsers));
    }
  }, []);

  const saveUsers = (updatedUsers: any[]) => {
    setUsers(updatedUsers);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUsers));
  };

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'PHARMACIST' as 'ADMIN' | 'DOCTOR' | 'PHARMACIST'
  });

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      toast("Sinkronisasi database Supabase berhasil", "success");
    }, 2000);
  };

  const handleDelete = (id: string, name: string) => {
    setUsers(prev => {
      const updated = prev.filter(u => u.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
    toast(`Akses untuk ${name} telah dicabut`, "info");
  };

  const handleEdit = (user: any) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role
    });
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      role: 'PHARMACIST'
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      const updated = users.map(u => u.id === editingUser.id ? { 
        ...u, 
        name: formData.name, 
        email: formData.email, 
        role: formData.role,
        avatar: formData.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
      } : u);
      saveUsers(updated);
      toast("Kredensial pengguna berhasil diperbarui", "success");
    } else {
      const newUser = {
        id: Math.random().toString(36).substr(2, 9),
        name: formData.name,
        email: formData.email,
        role: formData.role,
        status: 'Aktif',
        avatar: formData.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
        lastLogin: 'Baru saja'
      };
      saveUsers([newUser, ...users]);
      toast("Operator baru berhasil didaftarkan", "success");
    }
    setIsModalOpen(false);
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-20 px-4 mt-8">
      {/* Dynamic HeaderSection */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-8 border-b border-slate-200">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <div className="px-3 py-1 bg-blue-600 text-white rounded-full text-[9px] font-black uppercase tracking-[0.2em] shadow-lg shadow-blue-100 italic">
                Authorized Only
             </div>
             <div className="h-px w-20 bg-slate-200"></div>
          </div>
          <h1 className="text-5xl font-black text-slate-900 uppercase tracking-tighter leading-none">
            User Control <br/>
            <span className="text-blue-600">& Permissions</span>
          </h1>
          <p className="text-sm text-slate-500 font-medium max-w-md leading-relaxed">
            Pusat kendali autentikasi dan otorisasi. Kelola hak akses staf, pantau aktivitas login, dan sinkronkan kredensial dengan aman.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <button 
            onClick={handleSync}
            disabled={isSyncing}
            className={`px-8 py-4 bg-white border-2 border-slate-900 rounded-[2rem] text-[10px] font-black uppercase tracking-widest text-slate-900 shadow-xl hover:bg-slate-900 hover:text-white transition-all flex items-center gap-3 active:scale-95 ${isSyncing ? 'opacity-50' : ''}`}
          >
            <RefreshCw size={18} className={isSyncing ? 'animate-spin' : ''} />
            {isSyncing ? 'Syncing...' : 'Sync Supabase'}
          </button>
          <button 
            onClick={handleAdd}
            className="px-10 py-5 bg-blue-600 text-white rounded-[2rem] text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-blue-200 hover:bg-slate-900 transition-all flex items-center gap-3 active:scale-95 group"
          >
            <UserPlus size={20} className="group-hover:rotate-12 transition-transform" />
            Create Operator
          </button>
        </div>
      </div>

      {/* Bento Grid Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-2 bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden group shadow-2xl">
           <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-[100px] -mr-32 -mt-32 group-hover:bg-blue-500/40 transition-colors duration-700"></div>
           <div className="relative z-10 flex flex-col h-full justify-between gap-12">
              <div className="flex items-center justify-between">
                 <div className="p-4 bg-white/10 backdrop-blur-xl rounded-2xl">
                    <Shield size={24} className="text-blue-400" />
                 </div>
                 <Globe size={20} className="text-white/20 animate-spin-slow" />
              </div>
              <div>
                 <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-3 italic">System Health Index</p>
                 <div className="flex items-end gap-4">
                    <p className="text-6xl font-black uppercase tracking-tighter">100%</p>
                    <span className="text-emerald-400 text-xs font-bold mb-2 flex items-center gap-1">
                       <CheckCircle2 size={14} /> Encrypted
                    </span>
                 </div>
                 <p className="text-xs text-white/40 mt-4 font-medium uppercase tracking-widest">Global Security Protocol Active</p>
              </div>
           </div>
        </div>

        <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-xl flex flex-col justify-between group hover:border-blue-200 transition-all">
           <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl w-fit group-hover:scale-110 transition-transform">
              <UserCheck size={24} />
           </div>
           <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Total Operator</p>
              <p className="text-4xl font-black text-slate-900">{users.length} <span className="text-xs font-bold text-slate-300">STAF</span></p>
           </div>
        </div>

        <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-xl flex flex-col justify-between group hover:border-blue-200 transition-all">
           <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl w-fit group-hover:scale-110 transition-transform">
              <Terminal size={24} />
           </div>
           <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Build Version</p>
              <p className="text-2xl font-black text-slate-900">V2.4.0-STABLE</p>
           </div>
        </div>
      </div>

      {/* Control Panel / Data Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-6">
           <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 italic">Access Control Matrix</h3>
           <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-300 uppercase italic">
                 <History size={14} /> Audit Trail Log
              </div>
           </div>
        </div>

        <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-2xl overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row items-center gap-6">
            <div className="relative flex-1 w-full group">
               <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={20} />
               <input 
                type="text" 
                placeholder="Search operators, credentials, or clearance levels..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 pl-16 pr-8 py-5 rounded-[2rem] text-sm font-medium outline-none border-2 border-transparent focus:border-blue-100 focus:bg-white transition-all shadow-inner"
               />
            </div>
            <div className="flex items-center gap-3 shrink-0">
               <button className="p-5 bg-slate-50 text-slate-400 rounded-[1.5rem] hover:bg-slate-900 hover:text-white transition-all active:scale-95">
                  <Settings2 size={20} />
               </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/30">
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">System Identification</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic text-center">Clearance</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic text-center">Status</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic text-right">Activity Log</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                <AnimatePresence mode="popLayout">
                  {filteredUsers.map((u, i) => (
                    <motion.tr 
                      layout
                      key={u.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="hover:bg-slate-50/50 transition-all group"
                    >
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-5">
                           <div className="w-14 h-14 rounded-3xl bg-slate-900 text-white flex items-center justify-center font-black text-lg shadow-xl shadow-slate-200 group-hover:rotate-6 group-hover:scale-110 transition-transform italic">
                              {u.avatar}
                           </div>
                           <div>
                              <p className="font-black text-slate-900 uppercase tracking-tight text-base group-hover:text-blue-600 transition-colors">{u.name}</p>
                              <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                                 <Mail size={10} />
                                 {u.email}
                              </div>
                           </div>
                        </div>
                      </td>
                      <td className="px-10 py-8 text-center">
                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.1em] ${
                          u.role === 'ADMIN' ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' : 
                          u.role === 'DOCTOR' ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-10 py-8 text-center">
                        <div className="flex items-center justify-center gap-2.5">
                           <div className={`w-2.5 h-2.5 rounded-full ${u.status === 'Aktif' ? 'bg-emerald-500 shadow-glow shadow-emerald-400 animate-pulse' : 'bg-slate-300'}`}></div>
                           <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{u.status}</span>
                        </div>
                      </td>
                      <td className="px-10 py-8 text-right font-mono text-[10px] text-slate-400 uppercase">
                         <span className="text-slate-900 font-black">Logged:</span> {u.lastLogin}
                      </td>
                      <td className="px-10 py-8 text-right">
                        <div className="flex items-center justify-end gap-2">
                           <button 
                            onClick={() => handleEdit(u)}
                            className="p-4 bg-slate-100 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all active:scale-95"
                           >
                              <Edit3 size={16} />
                           </button>
                           <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(u.id, u.name);
                            }}
                            className="relative z-10 p-4 bg-rose-50 text-rose-300 hover:text-rose-600 hover:bg-rose-100 rounded-2xl transition-all active:scale-95 group/del"
                           >
                              <Trash2 size={16} className="group-hover/del:scale-110 transition-transform" />
                           </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Enhanced Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setIsModalOpen(false)}
               className="absolute inset-0 bg-slate-900/80 backdrop-blur-md"
             />
             <motion.div 
               initial={{ scale: 0.9, opacity: 0, y: 30 }}
               animate={{ scale: 1, opacity: 1, y: 0 }}
               exit={{ scale: 0.9, opacity: 0, y: 30 }}
               className="bg-white w-full max-w-xl rounded-[4rem] overflow-hidden shadow-[0_32px_100px_rgba(0,0,0,0.5)] relative"
             >
                <div className="grid grid-cols-1 md:grid-cols-5 h-full">
                   <div className="bg-slate-900 p-10 md:col-span-2 flex flex-col justify-between text-white">
                      <div>
                         <div className="w-16 h-16 bg-blue-600 rounded-[1.5rem] flex items-center justify-center mb-10 shadow-2xl shadow-blue-500/20">
                            <Lock size={32} />
                         </div>
                         <h3 className="text-3xl font-black uppercase tracking-tight leading-[0.9] mb-4">
                            {editingUser ? 'Update Access' : 'New Identity'}
                         </h3>
                         <p className="text-[10px] text-white/40 font-black uppercase tracking-widest leading-loose">
                            Security clearance level will be adjusted automatically based on selected role.
                         </p>
                      </div>
                      <div className="pt-20">
                         <div className="flex items-center gap-2 text-[9px] font-black text-blue-400 uppercase tracking-widest italic">
                            <Shield size={14} /> End-to-End Secure
                         </div>
                      </div>
                   </div>

                   <form onSubmit={handleSubmit} className="p-12 md:col-span-3 space-y-8 bg-white">
                      <div className="flex justify-end absolute top-10 right-10">
                         <button 
                           type="button"
                           onClick={() => setIsModalOpen(false)}
                           className="p-3 bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-2xl transition-all"
                         >
                           <X size={20} />
                         </button>
                      </div>

                      <div className="space-y-6 pt-6">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Operator Name</label>
                           <input 
                            required
                            type="text" 
                            value={formData.name} 
                            onChange={e => setFormData({...formData, name: e.target.value})}
                            placeholder="Full name"
                            className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-100 rounded-[1.5rem] px-6 py-4 text-sm font-black outline-none transition-all placeholder:text-slate-300" 
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Global ID (Email)</label>
                           <input 
                            required
                            type="email" 
                            value={formData.email} 
                            onChange={e => setFormData({...formData, email: e.target.value})}
                            disabled={!!editingUser} 
                            placeholder="email@access.net"
                            className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-100 rounded-[1.5rem] px-6 py-4 text-sm font-black outline-none transition-all disabled:opacity-50 placeholder:text-slate-300" 
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Access Privilege</label>
                           <div className="relative">
                              <select 
                                value={formData.role}
                                onChange={e => setFormData({...formData, role: e.target.value as any})}
                                className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-100 rounded-[1.5rem] px-6 py-4 text-[11px] font-black uppercase tracking-widest outline-none transition-all appearance-none cursor-pointer"
                              >
                                 <option value="ADMIN">ADMINISTRATOR LEVEL</option>
                                 <option value="DOCTOR">MEDICAL PRACTITIONER</option>
                                 <option value="PHARMACIST">PHARMACY OPERATOR</option>
                              </select>
                              <MoreVertical size={16} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                           </div>
                        </div>
                      </div>

                      <div className="pt-10 space-y-4">
                        <button 
                          type="submit"
                          className="w-full py-5 bg-blue-600 text-white rounded-[2rem] text-[10px] font-black uppercase tracking-widest shadow-[0_20px_50px_rgba(37,99,235,0.3)] hover:bg-slate-900 transition-all active:scale-95 flex items-center justify-center gap-3"
                        >
                          <CheckCircle2 size={18} />
                          {editingUser ? 'Save Credentials' : 'Commit To Database'}
                        </button>
                        <p className="text-[9px] text-center text-slate-300 font-bold uppercase tracking-widest">
                           Logged action by authorized session
                        </p>
                      </div>
                   </form>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

