import React, { useState, useEffect } from 'react';
import { 
  Stethoscope, 
  Search, 
  UserPlus, 
  Filter, 
  Phone, 
  Clock,
  Plus,
  X,
  CheckCircle2,
  Trash2,
  Edit3,
  Camera,
  MapPin
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { doctorService, Doctor } from '../../services/doctorService';
import { useToast } from '../../components/ui/ToastProvider';

export default function DoctorsList() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Aktif' | 'Cuti' | 'Tidak Aktif'>('All');
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    schedule: '',
    room: '',
    phone: '',
    image: '',
    status: 'Aktif' as 'Aktif' | 'Cuti' | 'Tidak Aktif'
  });

  const fetchDoctors = () => {
    setDoctors(doctorService.getDoctors());
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setEditingId(null);
    setFormData({
      name: '',
      specialization: '',
      schedule: '',
      room: '',
      phone: '',
      image: '',
      status: 'Aktif'
    });
  };

  const handleEdit = (doc: Doctor) => {
    setFormData({
      name: doc.name,
      specialization: doc.specialization,
      schedule: doc.schedule,
      room: doc.room,
      phone: doc.phone,
      image: doc.image || '',
      status: doc.status
    });
    setEditingId(doc.id);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    doctorService.deleteDoctor(id);
    toast(`Data dokter ${name} berhasil dihapus`, "info");
    fetchDoctors();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.specialization) {
      toast("Harap lengkapi nama dan spesialisasi", "error");
      return;
    }

    if (isEditing && editingId) {
      doctorService.updateDoctor(editingId, formData);
      toast("Data dokter berhasil diperbarui!", "success");
    } else {
      doctorService.addDoctor(formData);
      toast("Dokter baru berhasil ditambahkan!", "success");
    }

    handleCloseModal();
    fetchDoctors();
  };

  const filteredDoctors = doctors.filter(doc => {
    const matchesSearch = 
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || doc.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10 px-4 mt-6">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-4 uppercase tracking-tighter">
            <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-xl shadow-blue-100">
               <Stethoscope size={32} />
            </div>
            Tenaga Medis
          </h1>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2 ml-16">
             Database Dokter Professional & Spesialis Klinik
          </p>
        </div>
        <button 
          onClick={() => {
            setIsEditing(false);
            setIsModalOpen(true);
          }}
          className="px-8 py-4 bg-slate-900 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-slate-200 hover:bg-blue-600 transition-all flex items-center gap-3 active:scale-95"
        >
          <UserPlus size={18} />
          Tambah Dokter Baru
        </button>
      </div>

      {/* Filter Area */}
      <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
          <input
            type="text"
            placeholder="Cari dokter berdasarkan nama atau spesialisasi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-16 pr-6 py-5 bg-slate-50 border-none rounded-[1.5rem] text-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all font-medium shadow-inner"
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-auto">
            <Filter size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="appearance-none w-full md:w-64 pl-16 pr-10 py-5 bg-white border border-slate-100 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest text-slate-600 hover:border-blue-200 hover:text-blue-600 transition-all cursor-pointer outline-none focus:ring-2 focus:ring-blue-100 shadow-sm"
            >
              <option value="All">Semua Status</option>
              <option value="Aktif">Dokter Aktif</option>
              <option value="Cuti">Sedang Cuti</option>
              <option value="Tidak Aktif">Tidak Aktif</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid Display */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredDoctors.map((doc, i) => (
            <motion.div
              layout
              key={doc.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: i * 0.05 }}
              className="group bg-white rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:border-blue-100 transition-all overflow-hidden flex flex-col"
            >
              <div className="relative h-40 bg-slate-100 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent"></div>
                {doc.image ? (
                  <img 
                    src={doc.image} 
                    alt={doc.name} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-100">
                    <Stethoscope size={64} strokeWidth={1} />
                  </div>
                )}
                <div className={`absolute top-6 right-6 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg ${
                  doc.status === 'Aktif' ? 'bg-emerald-500 text-white' : 
                  doc.status === 'Cuti' ? 'bg-amber-500 text-white' : 'bg-rose-500 text-white'
                }`}>
                  {doc.status}
                </div>
              </div>
              
              <div className="p-8 pt-0 flex-1 flex flex-col text-center relative z-10">
                <div className="mb-6">
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-1 group-hover:text-blue-600 transition-colors">
                    {doc.name}
                  </h3>
                  <div className="inline-block px-4 py-1 bg-blue-50 text-blue-600 rounded-full text-[9px] font-black uppercase tracking-widest">
                    {doc.specialization}
                  </div>
                </div>
                
                <div className="space-y-4 text-left p-6 bg-slate-50 rounded-3xl mb-8">
                  <div className="flex items-center gap-3 text-xs font-bold text-slate-600">
                    <MapPin size={14} className="text-blue-500" />
                    {doc.room}
                  </div>
                  <div className="flex items-center gap-3 text-xs font-bold text-slate-600">
                    <Clock size={14} className="text-blue-500" />
                    {doc.schedule}
                  </div>
                  <div className="flex items-center gap-3 text-xs font-bold text-slate-600">
                    <Phone size={14} className="text-blue-500" />
                    {doc.phone}
                  </div>
                </div>

                <div className="mt-auto grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => handleEdit(doc)}
                    className="py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-600 transition-all active:scale-95 shadow-xl shadow-slate-100"
                  >
                    <Edit3 size={14} />
                    Edit Data
                  </button>
                  <button 
                    onClick={() => handleDelete(doc.id, doc.name)}
                    className="py-4 bg-rose-50 text-rose-500 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-rose-600 hover:text-white transition-all active:scale-95 border border-rose-100"
                  >
                    <Trash2 size={14} />
                    Hapus
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Add Card Dummy */}
        <button 
          onClick={() => {
            setIsEditing(false);
            setIsModalOpen(true);
          }}
          className="border-2 border-dashed border-slate-200 rounded-[3rem] p-10 flex flex-col items-center justify-center text-slate-400 hover:border-blue-400 hover:text-blue-600 transition-all group min-h-[450px] bg-slate-50/30"
        >
          <div className="w-20 h-20 rounded-[2rem] bg-white shadow-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Plus size={40} />
          </div>
          <span className="font-black uppercase tracking-widest text-[10px]">Tambah Tenaga Medis</span>
        </button>
      </div>

      {/* Modal Add/Edit */}
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
              className="bg-white w-full max-w-2xl rounded-[3.5rem] shadow-2xl relative overflow-hidden flex flex-col md:flex-row"
            >
              <div className="w-full md:w-64 bg-slate-900 p-10 text-white flex flex-col justify-between">
                <div>
                  <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-6">
                    <Stethoscope size={32} />
                  </div>
                  <h2 className="text-2xl font-black uppercase tracking-tight leading-none mb-4">
                    {isEditing ? 'Ubah\nData\nDokter' : 'Registrasi\nDokter\nBaru'}
                  </h2>
                  <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest leading-relaxed">
                    Pastikan informasi yang dimasukkan valid untuk ketersediaan jadwal.
                  </p>
                </div>
                <div className="pt-10 hidden md:block">
                   <div className="flex items-center gap-2 text-blue-400 text-[10px] font-black uppercase tracking-widest">
                      <CheckCircle2 size={14} />
                      Verified System
                   </div>
                </div>
              </div>

              <div className="flex-1 p-10 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-8 md:hidden">
                   <h2 className="text-xl font-black uppercase">Form Dokter</h2>
                   <button onClick={handleCloseModal} className="p-2 bg-slate-100 rounded-xl"><X size={20}/></button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block flex items-center gap-2">
                       <Camera size={14} /> Foto Profil (URL)
                    </label>
                    <div className="flex gap-4 items-center">
                       <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center overflow-hidden shrink-0 border-2 border-slate-50">
                          {formData.image ? <img src={formData.image} className="w-full h-full object-cover" referrerPolicy="no-referrer" /> : <Stethoscope className="text-slate-300" />}
                       </div>
                       <input
                        type="url"
                        placeholder="https://images.unsplash.com/..."
                        value={formData.image}
                        onChange={e => setFormData({...formData, image: e.target.value})}
                        className="flex-1 px-6 py-4 bg-slate-50 border-none rounded-2xl text-xs font-bold focus:ring-2 focus:ring-blue-100 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Nama Lengkap & Gelar</label>
                      <input
                        required
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-xs font-bold focus:ring-2 focus:ring-blue-100 transition-all"
                        placeholder="dr. Contoh Dokter, Sp.X"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Spesialisasi</label>
                      <input
                        required
                        value={formData.specialization}
                        onChange={e => setFormData({...formData, specialization: e.target.value})}
                        className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-xs font-bold focus:ring-2 focus:ring-blue-100 transition-all"
                        placeholder="Spesialis ..."
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Jadwal Praktek</label>
                      <input
                        required
                        value={formData.schedule}
                        onChange={e => setFormData({...formData, schedule: e.target.value})}
                        className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-xs font-bold focus:ring-2 focus:ring-blue-100 transition-all"
                        placeholder="Senin - Jumat"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Ruangan / Poli</label>
                      <input
                        required
                        value={formData.room}
                        onChange={e => setFormData({...formData, room: e.target.value})}
                        className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-xs font-bold focus:ring-2 focus:ring-blue-100 transition-all"
                        placeholder="Poli ..."
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Nomor Telepon</label>
                      <input
                        required
                        value={formData.phone}
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                        className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-xs font-bold focus:ring-2 focus:ring-blue-100 transition-all"
                        placeholder="081xxx"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Status (Ketersediaan)</label>
                      <select
                        value={formData.status}
                        onChange={e => setFormData({...formData, status: e.target.value as any})}
                        className="w-full px-6 py-4 bg-slate-100 border-none rounded-2xl text-xs font-black uppercase tracking-widest focus:ring-2 focus:ring-blue-100 transition-all appearance-none cursor-pointer"
                      >
                        <option value="Aktif">Aktif / Praktek</option>
                        <option value="Cuti">Cuti / Libur</option>
                        <option value="Tidak Aktif">Tidak Aktif</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-4 flex gap-4">
                    <button 
                      type="submit"
                      className="flex-1 py-5 bg-blue-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-slate-900 transition-all active:scale-95 flex items-center justify-center gap-3"
                    >
                      <CheckCircle2 size={18} />
                      {isEditing ? 'Simpan Perubahan' : 'Daftarkan Dokter'}
                    </button>
                    <button 
                      type="button"
                      onClick={handleCloseModal}
                      className="hidden md:flex px-8 py-5 bg-slate-50 text-slate-500 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-rose-50 hover:text-rose-500 transition-all items-center justify-center"
                    >
                      Batal
                    </button>
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
