import React, { useState, useEffect } from 'react';
import { 
  Pill, 
  Search, 
  Package, 
  ClipboardList, 
  Plus, 
  AlertTriangle,
  ChevronRight,
  Filter,
  CheckCircle2,
  X,
  TrendingUp,
  ArrowUpRight,
  Trash2,
  History,
  MoreVertical,
  Minus,
  FileText,
  User,
  Clock,
  ExternalLink,
  Edit3
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useToast } from '../../components/ui/ToastProvider';
import { pharmacyService, Medicine, Prescription } from '../../services/pharmacyService';

export default function Pharmacy() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('inventory');
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRxModalOpen, setIsRxModalOpen] = useState(false);
  const [selectedMed, setSelectedMed] = useState<Medicine | null>(null);
  const [editingRx, setEditingRx] = useState<Prescription | null>(null);
  const [newStockValue, setNewStockValue] = useState<number>(0);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newMedForm, setNewMedForm] = useState({
    name: '',
    category: 'Obat Bebas',
    stock: 0,
    unit: 'Tablet',
    price: 0,
    expiryDate: ''
  });

  const [rxFormData, setRxFormData] = useState({
    patientName: '',
    doctorName: '',
    medicines: ''
  });

  useEffect(() => {
    setMedicines(pharmacyService.getMedicines());
    setPrescriptions(pharmacyService.getPrescriptions());
  }, []);

  const handleAddMedicine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMedForm.name || newMedForm.stock < 0) {
      toast("Data obat tidak valid", "error");
      return;
    }

    const updated = pharmacyService.addMedicine(newMedForm);
    setMedicines(updated);
    toast(`Obat ${newMedForm.name} berhasil ditambahkan`, "success");
    setIsAddModalOpen(false);
    setNewMedForm({
      name: '',
      category: 'Obat Bebas',
      stock: 0,
      unit: 'Tablet',
      price: 0,
      expiryDate: ''
    });
  };

  const handleUpdateStock = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedMed) {
      const updated = pharmacyService.updateStock(selectedMed.id, newStockValue);
      setMedicines(updated);
      toast(`Stok ${selectedMed.name} diperbarui`, "success");
      setIsModalOpen(false);
    }
  };

  const updateRxStatus = (id: string, status: Prescription['status']) => {
    const updated = pharmacyService.updatePrescriptionStatus(id, status);
    setPrescriptions(updated);
    toast(`Status resep ${id} diperbarui menjadi ${status}`, "info");
  };

  const handleRxSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingRx) {
      const updated = pharmacyService.updatePrescription(editingRx.id, rxFormData);
      setPrescriptions(updated);
      toast("Data resep berhasil diperbarui", "success");
    } else {
      const updated = pharmacyService.addPrescription(rxFormData);
      setPrescriptions(updated);
      toast("Resep baru berhasil didaftarkan", "success");
    }
    setIsRxModalOpen(false);
    setEditingRx(null);
    setRxFormData({ patientName: '', doctorName: '', medicines: '' });
  };

  const openAddRx = () => {
    setEditingRx(null);
    setRxFormData({ patientName: '', doctorName: '', medicines: '' });
    setIsRxModalOpen(true);
  };

  const openEditRx = (rx: Prescription) => {
    setEditingRx(rx);
    setRxFormData({
      patientName: rx.patientName,
      doctorName: rx.doctorName,
      medicines: rx.medicines
    });
    setIsRxModalOpen(true);
  };

  const handleRxDelete = (id: string) => {
    const updated = pharmacyService.deletePrescription(id);
    setPrescriptions(updated);
    toast(`Resep ${id} berhasil dihapus`, "info");
  };

  const openStockModal = (med: Medicine) => {
    setSelectedMed(med);
    setNewStockValue(med.stock);
    setIsModalOpen(true);
  };

  const filteredMedicines = medicines.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPrescriptions = prescriptions.filter(p =>
    p.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lowStockCount = medicines.filter(m => m.status !== 'In Stock').length;

  return (
    <div className="space-y-12 max-w-7xl mx-auto pb-20 px-4 mt-8">
      {/* Dynamic Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-slate-200 pb-10">
        <div className="space-y-4">
           <div className="flex items-center gap-3">
              <div className="px-3 py-1 bg-blue-600 text-white rounded-full text-[9px] font-black uppercase tracking-[0.2em] italic shadow-lg shadow-blue-100">
                 Pharmacy Operations
              </div>
              <div className="h-[2px] w-12 bg-slate-100 italic"></div>
           </div>
           <h1 className="text-6xl font-black text-slate-900 uppercase tracking-tighter leading-none">
             Smart <br/>
             <span className="text-blue-600">Dispensing.</span>
           </h1>
           <p className="text-sm text-slate-500 font-medium max-w-md leading-relaxed">
             Sistem manajemen inventaris obat terpadu. Pantau stok secara real-time, kelola resep pasien, dan optimalkan layanan kefarmasian.
           </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
           {activeTab === 'inventory' ? (
             <button 
              onClick={() => setIsAddModalOpen(true)}
              className="px-10 py-5 bg-slate-900 text-white rounded-[2rem] text-[10px] font-black uppercase tracking-widest shadow-2xl hover:bg-blue-600 transition-all flex items-center gap-3 active:scale-95 group"
             >
               <Plus size={20} className="group-hover:rotate-90 transition-transform" />
               Add Medication
             </button>
           ) : (
             <button 
              onClick={openAddRx}
              className="px-10 py-5 bg-slate-900 text-white rounded-[2rem] text-[10px] font-black uppercase tracking-widest shadow-2xl hover:bg-blue-600 transition-all flex items-center gap-3 active:scale-95 group"
             >
               <FileText size={20} className="group-hover:scale-110 transition-transform" />
               New Prescription
             </button>
           )}
        </div>
      </div>

      {/* Bento Grid Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-2 bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden group shadow-2xl">
           <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/20 rounded-full blur-[120px] -mr-40 -mt-40 group-hover:bg-blue-500/40 transition-colors duration-700"></div>
           <div className="relative z-10 flex flex-col h-full justify-between gap-12">
              <div className="flex items-center justify-between">
                 <div className="p-4 bg-white/10 backdrop-blur-xl rounded-2xl">
                    <TrendingUp size={24} className="text-blue-400" />
                 </div>
                 <ArrowUpRight size={20} className="text-white/20" />
              </div>
              <div>
                 <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-3 italic">Dispensing Efficiency</p>
                 <div className="flex items-end gap-4">
                    <p className="text-6xl font-black uppercase tracking-tighter">98.2%</p>
                    <span className="text-emerald-400 text-xs font-bold mb-2 flex items-center gap-1">
                       <CheckCircle2 size={14} /> Optimized
                    </span>
                 </div>
              </div>
           </div>
        </div>

        <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-xl flex flex-col justify-between group hover:border-blue-200 transition-all">
           <div className="p-4 bg-slate-900 text-white rounded-2xl w-fit group-hover:scale-110 transition-transform">
              <Package size={24} />
           </div>
           <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Inventory Items</p>
              <p className="text-4xl font-black text-slate-900">{medicines.length} <span className="text-xs font-bold text-slate-300 italic">SKU</span></p>
           </div>
        </div>

        <div className={`rounded-[3rem] p-10 border shadow-xl flex flex-col justify-between group transition-all ${lowStockCount > 0 ? 'bg-amber-50 border-amber-100' : 'bg-white border-slate-100 hover:border-blue-200'}`}>
           <div className={`p-4 rounded-2xl w-fit group-hover:scale-110 transition-transform ${lowStockCount > 0 ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-900'}`}>
              <AlertTriangle size={24} />
           </div>
           <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Restock Priority</p>
              <p className={`text-4xl font-black ${lowStockCount > 0 ? 'text-amber-600' : 'text-slate-900'}`}>{lowStockCount} <span className="text-xs font-bold text-slate-300 italic">LIMIT</span></p>
           </div>
        </div>
      </div>

      {/* Control Area */}
      <div className="space-y-8">
        <div className="flex items-center justify-between px-6">
           <div className="flex items-center gap-6">
              <button 
                onClick={() => setActiveTab('inventory')}
                className={`text-sm font-black uppercase tracking-[0.2em] transition-all relative pb-2 ${activeTab === 'inventory' ? 'text-slate-900 italic underline decoration-blue-600 decoration-4 underline-offset-8' : 'text-slate-300'}`}
              >
                Stock Management
              </button>
              <button 
                onClick={() => setActiveTab('history')}
                className={`text-sm font-black uppercase tracking-[0.2em] transition-all relative pb-2 ${activeTab === 'history' ? 'text-slate-900 italic underline decoration-blue-600 decoration-4 underline-offset-8' : 'text-slate-300'}`}
              >
                Resep Pasien
              </button>
           </div>
           <div className="flex items-center gap-4 text-[10px] font-black text-slate-300 uppercase italic">
              <History size={14} /> Real-time Monitoring
           </div>
        </div>

        <div className="bg-white rounded-[4rem] border border-slate-100 shadow-2xl overflow-hidden">
          <div className="p-10 border-b border-slate-50 flex flex-col md:flex-row items-center gap-8">
            <div className="relative flex-1 w-full group">
               <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={24} />
              <input 
                type="text" 
                placeholder={activeTab === 'inventory' ? "Search medication by name, category..." : "Search by patient name or ID..."} 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 pl-20 pr-10 py-6 rounded-[2.5rem] text-sm font-black outline-none border-2 border-transparent focus:border-blue-100 focus:bg-white transition-all shadow-inner uppercase tracking-wider"
               />
            </div>
            <button className="flex items-center gap-3 px-10 py-6 bg-slate-900 text-white rounded-[2.5rem] text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all active:scale-95 shadow-xl">
               <Filter size={18} />
               Apply Filters
            </button>
          </div>

          <div className="overflow-x-auto">
            {activeTab === 'inventory' ? (
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-12 py-8 text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] italic">Medication Details</th>
                    <th className="px-12 py-8 text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] italic text-center">Category</th>
                    <th className="px-12 py-8 text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] italic text-center">In-Stock</th>
                    <th className="px-12 py-8 text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] italic text-center">Status</th>
                    <th className="px-12 py-8 text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] italic text-right">Operation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  <AnimatePresence mode="popLayout">
                    {filteredMedicines.map((med, i) => (
                      <motion.tr 
                        layout
                        key={med.id}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                        className="hover:bg-slate-50/80 transition-all group"
                      >
                        <td className="px-12 py-10">
                            <div className="flex items-center gap-6">
                              <div className="w-16 h-16 rounded-[1.5rem] bg-slate-900 text-white flex items-center justify-center font-black group-hover:rotate-6 group-hover:scale-110 transition-transform shadow-xl shadow-slate-200">
                                  <Pill size={24} />
                              </div>
                              <div>
                                  <p className="text-lg font-black text-slate-900 uppercase tracking-tighter mb-1 group-hover:text-blue-600 transition-colors">{med.name}</p>
                                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
                                    <History size={10} /> {med.id} • EXP: {med.expiryDate}
                                  </p>
                              </div>
                            </div>
                        </td>
                        <td className="px-12 py-10 text-center">
                            <span className="px-5 py-2 bg-slate-100 rounded-full text-[9px] font-black uppercase tracking-widest text-slate-600 italic">
                              {med.category}
                            </span>
                        </td>
                        <td className="px-12 py-10 text-center">
                            <div className="flex flex-col items-center">
                              <span className="text-xl font-black text-slate-900">{med.stock}</span>
                              <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{med.unit}</span>
                            </div>
                        </td>
                        <td className="px-12 py-10 text-center">
                            <button 
                              onClick={() => openStockModal(med)}
                              className={`px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.15em] shadow-lg transition-all active:scale-90 cursor-pointer overflow-hidden relative group/status ${
                              med.status === 'In Stock' ? 'bg-emerald-500 text-white shadow-emerald-100' :
                              med.status === 'Low Stock' ? 'bg-amber-500 text-white shadow-amber-100' : 
                              'bg-rose-500 text-white shadow-rose-100'
                            }`}>
                              <span className="relative z-10">{med.status}</span>
                              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/status:translate-y-0 transition-transform duration-300 flex items-center justify-center">
                                <Plus size={14} />
                              </div>
                            </button>
                        </td>
                        <td className="px-12 py-10 text-right">
                            <div className="flex items-center justify-end gap-3">
                              <button 
                                onClick={() => openStockModal(med)}
                                className="px-6 py-3 bg-slate-900 text-white rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all active:scale-95 flex items-center gap-2"
                              >
                                  <ArrowUpRight size={14} /> Update
                              </button>
                              <button 
                                onClick={() => {
                                  const updated = pharmacyService.deleteMedicine(med.id);
                                  setMedicines(updated);
                                  toast(`Obat ${med.name} berhasil dihapus`, "info");
                                }}
                                className="p-3 bg-rose-50 text-rose-400 hover:text-white hover:bg-rose-500 rounded-2xl transition-all active:scale-95"
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
            ) : (
              <div className="divide-y divide-slate-50">
                {filteredPrescriptions.map((rx, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={rx.id} 
                    className="p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8 hover:bg-slate-50/50 transition-all group"
                  >
                    <div className="flex items-start gap-6">
                      <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-[2rem] flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner">
                        <FileText size={24} />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <p className="text-xl font-black text-slate-900 uppercase tracking-tighter italic">{rx.patientName}</p>
                          <span className="px-3 py-1 bg-slate-100 rounded text-[8px] font-black uppercase tracking-widest text-slate-400">{rx.id}</span>
                        </div>
                        <p className="text-sm font-bold text-slate-400 flex items-center gap-2">
                          <User size={14} className="text-blue-500" /> Prescribed by {rx.doctorName}
                        </p>
                        <p className="text-xs font-black text-slate-900 bg-emerald-50 text-emerald-600 w-fit px-4 py-2 rounded-xl mt-3 tracking-wide">
                          {rx.medicines}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-6">
                      <div className="text-right">
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1 italic">Order Time</p>
                        <p className="text-xs font-black text-slate-900 flex items-center justify-end gap-2">
                           <Clock size={12} className="text-blue-500" /> {rx.date}
                        </p>
                      </div>

                      <div className="flex items-stretch bg-slate-50 rounded-3xl p-2 gap-2">
                         <button 
                           onClick={() => updateRxStatus(rx.id, 'Pending')}
                           className={`px-4 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all ${rx.status === 'Pending' ? 'bg-amber-500 text-white shadow-lg' : 'text-slate-400 hover:text-slate-900'}`}
                         >
                            Pending
                         </button>
                         <button 
                           onClick={() => updateRxStatus(rx.id, 'Prepared')}
                           className={`px-4 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all ${rx.status === 'Prepared' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-900'}`}
                         >
                            Prepared
                         </button>
                         <button 
                           onClick={() => updateRxStatus(rx.id, 'Completed')}
                           className={`px-4 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all ${rx.status === 'Completed' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-400 hover:text-slate-900'}`}
                         >
                            Taken
                         </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => openEditRx(rx)}
                          className="p-4 bg-slate-100 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all active:scale-95"
                        >
                          <Edit3 size={18} />
                        </button>
                        <button 
                          onClick={() => handleRxDelete(rx.id)}
                          className="p-4 bg-rose-50 text-rose-400 hover:text-white hover:bg-rose-500 rounded-2xl transition-all active:scale-95"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
                {filteredPrescriptions.length === 0 && (
                  <div className="p-20 text-center space-y-4">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-300 italic">
                       <ClipboardList size={32} />
                    </div>
                    <p className="text-sm font-black text-slate-400 uppercase tracking-widest italic">No active prescriptions found</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Prescription Modal */}
      <AnimatePresence>
        {isRxModalOpen && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setIsRxModalOpen(false)}
               className="absolute inset-0 bg-slate-900/80 backdrop-blur-md"
             />
             <motion.div 
               initial={{ scale: 0.9, opacity: 0, y: 30 }}
               animate={{ scale: 1, opacity: 1, y: 0 }}
               exit={{ scale: 0.9, opacity: 0, y: 30 }}
               className="bg-white w-full max-w-2xl rounded-[4rem] overflow-hidden shadow-2xl relative"
             >
                <div className="grid grid-cols-1 md:grid-cols-5">
                   <div className="bg-slate-900 p-12 md:col-span-2 text-white flex flex-col justify-between">
                      <div>
                         <div className="w-16 h-16 bg-blue-600 rounded-[1.5rem] flex items-center justify-center mb-10">
                            <FileText size={32} />
                         </div>
                         <h3 className="text-3xl font-black uppercase tracking-tight leading-[0.9] mb-4">
                            {editingRx ? 'Edit' : 'New'} <br/> Prescription.
                         </h3>
                         <p className="text-[10px] text-white/40 font-black uppercase tracking-widest leading-loose">
                            Catat data resep pasien untuk pemrosesan obat di bagian farmasi.
                         </p>
                      </div>
                   </div>

                   <div className="p-14 md:col-span-3 space-y-8 bg-white overflow-y-auto max-h-[85vh]">
                      <div className="flex justify-between items-center">
                         <h4 className="text-xl font-black text-slate-900 uppercase tracking-tighter italic">Order Details</h4>
                         <button onClick={() => setIsRxModalOpen(false)} className="p-3 bg-slate-50 text-slate-400 rounded-2xl"><X size={20}/></button>
                      </div>

                      <form onSubmit={handleRxSubmit} className="space-y-6">
                         <div className="space-y-2">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Patient Name</label>
                            <input 
                              required
                              type="text" 
                              value={rxFormData.patientName}
                              onChange={e => setRxFormData({...rxFormData, patientName: e.target.value})}
                              placeholder="Full name of patient"
                              className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-black outline-none focus:ring-2 focus:ring-blue-100"
                            />
                         </div>

                         <div className="space-y-2">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Doctor Name</label>
                            <input 
                              required
                              type="text" 
                              value={rxFormData.doctorName}
                              onChange={e => setRxFormData({...rxFormData, doctorName: e.target.value})}
                              placeholder="Prescribing physician"
                              className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-black outline-none focus:ring-2 focus:ring-blue-100"
                            />
                         </div>

                         <div className="space-y-2">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Medicines & Instructions</label>
                            <textarea 
                              required
                              value={rxFormData.medicines}
                              onChange={e => setRxFormData({...rxFormData, medicines: e.target.value})}
                              placeholder="e.g. Paracetamol 500mg (10), Amoxicillin (15)"
                              rows={4}
                              className="w-full bg-slate-50 border-none rounded-3xl px-6 py-4 text-sm font-black outline-none focus:ring-2 focus:ring-blue-100 resize-none"
                            />
                         </div>

                         <button 
                           type="submit"
                           className="w-full py-5 bg-blue-600 text-white rounded-[2rem] text-[10px] font-black uppercase tracking-widest shadow-2xl hover:bg-slate-900 transition-all active:scale-95 flex items-center justify-center gap-3 mt-4"
                         >
                            <CheckCircle2 size={18} />
                            {editingRx ? 'Update Prescription' : 'Finalize Request'}
                         </button>
                      </form>
                   </div>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Medication Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setIsAddModalOpen(false)}
               className="absolute inset-0 bg-slate-900/80 backdrop-blur-md"
             />
             <motion.div 
               initial={{ scale: 0.9, opacity: 0, y: 30 }}
               animate={{ scale: 1, opacity: 1, y: 0 }}
               exit={{ scale: 0.9, opacity: 0, y: 30 }}
               className="bg-white w-full max-w-2xl rounded-[4rem] overflow-hidden shadow-2xl relative"
             >
                <div className="grid grid-cols-1 md:grid-cols-5">
                   <div className="bg-blue-600 p-12 md:col-span-2 text-white flex flex-col justify-between">
                      <div>
                         <div className="w-16 h-16 bg-white/20 rounded-[1.5rem] flex items-center justify-center mb-10">
                            <Plus size={32} />
                         </div>
                         <h3 className="text-3xl font-black uppercase tracking-tight leading-[0.9] mb-4">
                            New <br/> Item.
                         </h3>
                         <p className="text-[10px] text-white/60 font-black uppercase tracking-widest leading-loose">
                            Daftarkan obat baru ke dalam sistem inventaris klinik.
                         </p>
                      </div>
                   </div>

                   <div className="p-14 md:col-span-3 space-y-8 bg-white max-h-[85vh] overflow-y-auto">
                      <div className="flex justify-between items-center">
                         <h4 className="text-xl font-black text-slate-900 uppercase tracking-tighter italic">Registration</h4>
                         <button onClick={() => setIsAddModalOpen(false)} className="p-3 bg-slate-50 text-slate-400 rounded-2xl"><X size={20}/></button>
                      </div>

                      <form onSubmit={handleAddMedicine} className="space-y-6">
                         <div className="space-y-2">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Medication Name</label>
                            <input 
                              required
                              type="text" 
                              value={newMedForm.name}
                              onChange={e => setNewMedForm({...newMedForm, name: e.target.value})}
                              placeholder="e.g. Paracetamol 500mg"
                              className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-black outline-none focus:ring-2 focus:ring-blue-100"
                            />
                         </div>

                         <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                               <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Category</label>
                               <select 
                                 value={newMedForm.category}
                                 onChange={e => setNewMedForm({...newMedForm, category: e.target.value})}
                                 className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-[10px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-blue-100 italic"
                               >
                                  <option>Obat Bebas</option>
                                  <option>Obat Keras</option>
                                  <option>Antibiotik</option>
                                  <option>Vitamin</option>
                                  <option>Alat Medis</option>
                               </select>
                            </div>
                            <div className="space-y-2">
                               <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Init Stock</label>
                               <input 
                                 required
                                 type="number" 
                                 value={newMedForm.stock}
                                 onChange={e => setNewMedForm({...newMedForm, stock: parseInt(e.target.value) || 0})}
                                 className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-black outline-none focus:ring-2 focus:ring-blue-100"
                               />
                            </div>
                         </div>

                         <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                               <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Unit Type</label>
                               <input 
                                 required
                                 type="text" 
                                 value={newMedForm.unit}
                                 onChange={e => setNewMedForm({...newMedForm, unit: e.target.value})}
                                 placeholder="Tablet / Bottle"
                                 className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-black outline-none focus:ring-2 focus:ring-blue-100"
                               />
                            </div>
                            <div className="space-y-2">
                               <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Base Price</label>
                               <input 
                                 required
                                 type="number" 
                                 value={newMedForm.price}
                                 onChange={e => setNewMedForm({...newMedForm, price: parseInt(e.target.value) || 0})}
                                 className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-black outline-none focus:ring-2 focus:ring-blue-100"
                               />
                            </div>
                         </div>

                         <div className="space-y-2">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Expiry Date</label>
                            <input 
                              required
                              type="date" 
                              value={newMedForm.expiryDate}
                              onChange={e => setNewMedForm({...newMedForm, expiryDate: e.target.value})}
                              className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-black outline-none focus:ring-2 focus:ring-blue-100"
                            />
                         </div>

                         <button 
                           type="submit"
                           className="w-full py-5 bg-slate-900 text-white rounded-[2rem] text-[10px] font-black uppercase tracking-widest shadow-2xl hover:bg-blue-600 transition-all active:scale-95 flex items-center justify-center gap-3 mt-4"
                         >
                            <CheckCircle2 size={18} />
                            Save Medication
                         </button>
                      </form>
                   </div>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Stock Update Modal */}
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
               className="bg-white w-full max-w-xl rounded-[4rem] overflow-hidden shadow-2xl relative"
             >
                <div className="grid grid-cols-1 md:grid-cols-5">
                   <div className="bg-slate-900 p-12 md:col-span-2 text-white flex flex-col justify-between">
                      <div>
                         <div className="w-16 h-16 bg-blue-600 rounded-[1.5rem] flex items-center justify-center mb-10 shadow-2xl shadow-blue-500/20">
                            <TrendingUp size={32} />
                         </div>
                         <h3 className="text-3xl font-black uppercase tracking-tight leading-[0.9] mb-4">
                            Stock <br/> Control.
                         </h3>
                         <p className="text-[10px] text-white/40 font-black uppercase tracking-widest leading-loose">
                            Current balance: {selectedMed?.stock} {selectedMed?.unit}
                         </p>
                      </div>
                      <div className="pt-20">
                         <div className="flex items-center gap-2 text-[9px] font-black text-blue-400 uppercase tracking-widest italic">
                            <CheckCircle2 size={14} /> Verified Adjustment
                         </div>
                      </div>
                   </div>

                   <div className="p-14 md:col-span-3 space-y-10 bg-white">
                      <div className="flex justify-between items-center">
                         <div>
                            <h4 className="text-xl font-black text-slate-900 uppercase tracking-tighter">{selectedMed?.name}</h4>
                            <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] mt-1 italic">SKU: {selectedMed?.id}</p>
                         </div>
                         <button 
                           onClick={() => setIsModalOpen(false)}
                           className="p-3 bg-slate-50 text-slate-400 hover:text-rose-500 rounded-2xl transition-all"
                         >
                           <X size={20} />
                         </button>
                      </div>

                      <form onSubmit={handleUpdateStock} className="space-y-10">
                         <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] italic">Adjust Inventory Quantity</label>
                            <div className="flex items-center justify-between p-6 bg-slate-50 rounded-[2.5rem]">
                               <button 
                                type="button"
                                onClick={() => setNewStockValue(prev => Math.max(0, prev - 1))}
                                className="w-14 h-14 bg-white text-slate-900 rounded-2xl flex items-center justify-center shadow-md active:scale-90 transition-all hover:bg-slate-900 hover:text-white"
                               >
                                  <Minus size={20} />
                               </button>
                               <input 
                                type="number" 
                                value={newStockValue}
                                onChange={e => setNewStockValue(parseInt(e.target.value) || 0)}
                                className="bg-transparent border-none text-4xl font-black text-slate-900 w-24 text-center focus:ring-0 outline-none"
                               />
                               <button 
                                type="button"
                                onClick={() => setNewStockValue(prev => prev + 1)}
                                className="w-14 h-14 bg-white text-slate-900 rounded-2xl flex items-center justify-center shadow-md active:scale-90 transition-all hover:bg-slate-900 hover:text-white"
                               >
                                  <Plus size={20} />
                               </button>
                            </div>
                         </div>

                         <div className="pt-4">
                            <button 
                              type="submit"
                              className="w-full py-6 bg-blue-600 text-white rounded-[2rem] text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-blue-100 hover:bg-slate-900 transition-all active:scale-95 flex items-center justify-center gap-3"
                            >
                              <CheckCircle2 size={18} />
                              Confirm Adjustment
                            </button>
                            <p className="text-[9px] text-center text-slate-300 font-bold uppercase tracking-widest mt-6 italic">
                               Updated stock will trigger automated alerts if below limit
                            </p>
                         </div>
                      </form>
                   </div>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
