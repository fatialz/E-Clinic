import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Filter, 
  MoreVertical, 
  Phone, 
  Calendar, 
  UserPlus,
  ArrowUpDown,
  X,
  CheckCircle2,
  Trash2,
  Edit3
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { patientService, Patient } from '../../services/patientService';
import { useToast } from '../../components/ui/ToastProvider';

export default function PatientList() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Aktif' | 'Non-Aktif'>('All');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newPatient, setNewPatient] = useState({
    name: '',
    age: '',
    gender: 'Laki-laki',
    phone: ''
  });

  const fetchPatients = () => {
    setPatients(patientService.getPatients());
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatient.name || !newPatient.age || !newPatient.phone) {
      toast("Harap isi semua data pasien", "error");
      return;
    }

    if (isEditing && editingId) {
      patientService.updatePatient(editingId, {
        name: newPatient.name,
        age: parseInt(newPatient.age),
        gender: newPatient.gender,
        phone: newPatient.phone
      });
      toast("Data pasien berhasil diperbarui!", "success");
    } else {
      patientService.addPatient({
        name: newPatient.name,
        age: parseInt(newPatient.age),
        gender: newPatient.gender,
        phone: newPatient.phone
      });
      toast("Pasien berhasil ditambahkan!", "success");
    }

    handleCloseModal();
    fetchPatients();
  };

  const handleEdit = (p: Patient) => {
    setNewPatient({
      name: p.name,
      age: p.age.toString(),
      gender: p.gender,
      phone: p.phone
    });
    setEditingId(p.id);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setNewPatient({ name: '', age: '', gender: 'Laki-laki', phone: '' });
    setIsEditing(false);
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setEditingId(null);
    setNewPatient({ name: '', age: '', gender: 'Laki-laki', phone: '' });
  };

  const handleDeletePatient = (id: string) => {
    patientService.deletePatient(id);
    toast("Data pasien berhasil dihapus", "info");
    fetchPatients();
  };

  const filteredPatients = patients.filter(p => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.phone.includes(searchTerm) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10 px-4">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Users size={32} className="text-blue-600" />
            Database Pasien
          </h1>
          <p className="text-slate-500 mt-1 uppercase text-[10px] font-black tracking-widest">Kelola dan lihat riwayat seluruh pasien klinik.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleAddNew}
            className="px-8 py-4 bg-slate-900 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-slate-200 hover:bg-blue-600 transition-all flex items-center gap-3 active:scale-95"
          >
            <UserPlus size={18} />
            Tambah Pasien Baru
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
          <input
            type="text"
            placeholder="Cari nama, ID, atau nomor telepon..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-16 pr-6 py-5 bg-slate-50 border-none rounded-[1.5rem] text-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all font-medium"
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-auto">
            <Filter size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="appearance-none w-full md:w-64 pl-16 pr-10 py-5 bg-white border border-slate-100 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest text-slate-600 hover:border-blue-200 hover:text-blue-600 transition-all cursor-pointer outline-none focus:ring-2 focus:ring-blue-100"
            >
              <option value="All">Semua Status</option>
              <option value="Aktif">Pasien Aktif</option>
              <option value="Non-Aktif">Pasien Non-Aktif</option>
            </select>
            <ArrowUpDown size={14} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Patients Table */}
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Identitas Pasien</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Informasi Kontak</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Terakhir Berkunjung</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status Akun</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <AnimatePresence mode="popLayout">
                {filteredPatients.map((p, i) => (
                  <motion.tr
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.03 }}
                    key={p.id}
                    className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                  >
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-lg shadow-lg shadow-blue-100 group-hover:scale-110 transition-transform">
                          {p.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{p.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{p.age} Tahun • {p.gender}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-3 text-slate-600 font-bold text-xs">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                           <Phone size={14} />
                        </div>
                        {p.phone}
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-3 text-slate-600 font-bold text-xs">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                           <Calendar size={14} />
                        </div>
                        {p.lastVisit}
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                        p.status === 'Aktif' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex items-center justify-center gap-2">
                         <button 
                          onClick={() => handleEdit(p)}
                          className="relative z-10 p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm active:scale-95 cursor-pointer"
                          title="Ubah Data"
                         >
                           <Edit3 size={16} />
                         </button>
                         <button 
                          onClick={() => handleDeletePatient(p.id)}
                          className="relative z-10 p-3 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-sm active:scale-95 border border-rose-100 cursor-pointer"
                          title="Hapus Pasien"
                         >
                           <Trash2 size={16} />
                         </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          {filteredPatients.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
               <div className="w-20 h-20 rounded-[2rem] bg-slate-50 flex items-center justify-center mb-4">
                  <Search size={32} />
               </div>
               <p className="text-xs font-black uppercase tracking-widest">Tidak ada pasien ditemukan</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Patient Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseModal}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl relative overflow-hidden"
            >
              <div className="p-10">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
                    {isEditing ? 'Ubah Data Pasien' : 'Registrasi Pasien'}
                  </h2>
                  <button onClick={handleCloseModal} className="p-3 hover:bg-slate-100 rounded-2xl transition-colors">
                    <X size={20} className="text-slate-400" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Nama Lengkap</label>
                    <input
                      required
                      value={newPatient.name}
                      onChange={e => setNewPatient({ ...newPatient, name: e.target.value })}
                      className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-100 transition-all font-bold"
                      placeholder="Contoh: Ahmad Subardjo"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Usia (Tahun)</label>
                      <input
                        required
                        type="number"
                        value={newPatient.age}
                        onChange={e => setNewPatient({ ...newPatient, age: e.target.value })}
                        className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-100 transition-all font-bold"
                        placeholder="25"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Jenis Kelamin</label>
                      <select
                        value={newPatient.gender}
                        onChange={e => setNewPatient({ ...newPatient, gender: e.target.value })}
                        className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-100 transition-all font-bold appearance-none cursor-pointer"
                      >
                        <option>Laki-laki</option>
                        <option>Perempuan</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Nomor Telepon / WhatsApp</label>
                    <input
                      required
                      value={newPatient.phone}
                      onChange={e => setNewPatient({ ...newPatient, phone: e.target.value })}
                      className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-100 transition-all font-bold"
                      placeholder="0812xxxx"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-5 bg-blue-600 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-slate-900 transition-all active:scale-95 flex items-center justify-center gap-3"
                  >
                    <CheckCircle2 size={18} />
                    {isEditing ? 'Perbarui Data Pasien' : 'Simpan Data Pasien'}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

