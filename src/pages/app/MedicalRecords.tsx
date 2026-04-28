import { motion, AnimatePresence } from 'motion/react';
import { 
  ClipboardList, 
  Search, 
  FileText, 
  Eye, 
  User, 
  Calendar,
  Filter,
  Trash2
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { recordService, MedicalRecord } from '../../services/recordService';
import { useToast } from '../../components/ui/ToastProvider';

export default function MedicalRecords() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('Semua Riwayat');
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchRecords = () => {
    setRecords(recordService.getRecords());
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleDelete = (id: string) => {
    recordService.deleteRecord(id, () => {
      fetchRecords();
      toast("Riwayat rekam medis berhasil dihapus", "info");
    });
  };

  const [selectedRecord, setSelectedRecord] = useState<any>(null);

  const filteredRecords = records.filter(r => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      r.patient.toLowerCase().includes(searchLower) || 
      r.id.toLowerCase().includes(searchLower) || 
      r.diagnosis.toLowerCase().includes(searchLower);

    if (!matchesSearch) return false;

    if (activeTab === 'Semua Riwayat') return true;
    if (activeTab === 'Pemeriksaan') return true;
    if (activeTab === 'Hasil Lab') return r.details.lab && r.details.lab !== 'Tidak ada pemeriksaan lab.';
    if (activeTab === 'Resep Obat') return r.details.prescription && r.details.prescription !== 'Tidak ada resep obat.';
    return true;
  });

  const RecordDetailModal = ({ record, onClose }: { record: any, onClose: () => void }) => (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl"
      >
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50">
           <div className="flex items-center gap-4">
              <div className="p-4 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-100">
                <FileText size={24} />
              </div>
              <div>
                 <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Full Patient Report</h2>
                 <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Rekam Medis Digital • {record.id}</p>
              </div>
           </div>
           <button onClick={onClose} className="w-12 h-12 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-rose-500 transition-all flex items-center justify-center font-bold">X</button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8">
           <div className="grid md:grid-cols-2 gap-8 bg-blue-50/50 p-6 rounded-3xl border border-blue-100">
              <div className="space-y-4">
                 <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest leading-none">Biodata Pasien</p>
                 <div className="space-y-2">
                    <p className="text-lg font-black text-slate-800 uppercase tracking-tight">{record.patient}</p>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Pemeriksa: {record.doctor}</p>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Tanggal: {record.date}</p>
                 </div>
              </div>
              <div className="space-y-4">
                 <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest leading-none">Status Resume</p>
                 <div className="flex flex-wrap gap-2">
                    <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-[10px] font-black uppercase tracking-widest">Final Report</span>
                    <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-widest">Terverifikasi</span>
                 </div>
              </div>
           </div>

           <div className="space-y-6">
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                 <div className="w-2 h-8 bg-blue-500 rounded-full"></div>
                 Summary SOAP
              </h3>

              <div className="grid gap-6">
                 <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-2 hover:bg-white hover:shadow-xl transition-all group">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-blue-500 transition-colors">Subjective (S)</p>
                    <p className="text-sm font-medium text-slate-700 italic">" {record.details.s} "</p>
                 </div>
                 <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-2 hover:bg-white hover:shadow-xl transition-all group">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-blue-500 transition-colors">Objective (O)</p>
                    <p className="text-sm font-medium text-slate-700 italic">" {record.details.o} "</p>
                 </div>
                 <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100 space-y-2 hover:bg-white hover:shadow-xl transition-all group">
                    <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Assessment (A)</p>
                    <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{record.details.a}</p>
                 </div>
                 <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-2 hover:bg-white hover:shadow-xl transition-all group">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-blue-500 transition-colors">Plan (P)</p>
                    <p className="text-sm font-medium text-slate-700 italic">" {record.details.p} "</p>
                 </div>
              </div>
           </div>

           <div className="grid md:grid-cols-2 gap-8 pt-4">
              <div className="space-y-4">
                 <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                    <div className="p-1.5 bg-emerald-100 text-emerald-600 rounded-lg">L</div>
                    Laboratory Results
                 </h3>
                 <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100 text-sm font-bold text-emerald-800 italic uppercase tracking-tighter">
                    {record.details.lab}
                 </div>
              </div>
              <div className="space-y-4">
                 <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                    <div className="p-1.5 bg-amber-100 text-amber-600 rounded-lg">R</div>
                    Prescription Details (E-Resep)
                 </h3>
                 <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100 text-sm font-bold text-amber-800 italic uppercase tracking-tighter">
                    {record.details.prescription}
                 </div>
              </div>
           </div>
        </div>

        <div className="p-8 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
           <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Authorized by {record.doctor} • SIM Klinik V.2</p>
        </div>
      </motion.div>
    </div>
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <AnimatePresence>
        {selectedRecord && (
          <RecordDetailModal 
            record={selectedRecord} 
            onClose={() => setSelectedRecord(null)} 
          />
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
            <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-200 text-white">
              <ClipboardList size={24} />
            </div>
            Arsip Rekam Medis
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1 uppercase tracking-widest leading-loose">Database riwayat kesehatan pasien yang tersimpan secara digital.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto no-scrollbar">
        {['Semua Riwayat', 'Pemeriksaan', 'Hasil Lab', 'Resep Obat'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-8 py-4 text-[10px] font-black uppercase tracking-widest transition-all relative shrink-0 ${
              activeTab === tab ? 'text-blue-600 scale-105' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full shadow-[0_-4px_10px_rgba(37,99,235,0.4)]" />
            )}
          </button>
        ))}
      </div>

      <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
          <input
            type="text"
            placeholder="Cari berdasarkan nama pasien, ID Pasien, atau diagnosa..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-[1.5rem] text-sm font-bold outline-none focus:ring-4 focus:ring-blue-100 focus:bg-white focus:border-blue-300 transition-all placeholder:text-slate-300"
          />
        </div>
        <button className="flex items-center gap-3 px-8 py-4 bg-slate-50 border border-slate-100 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-100 transition-all transform active:scale-95 shadow-sm">
          <Filter size={18} />
          Filter Lanjutan
        </button>
      </div>

      <div className="grid gap-6">
        {filteredRecords.map((record, i) => (
          <motion.div
            key={record.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-2xl hover:border-blue-300 transition-all group flex flex-col md:flex-row md:items-center gap-8 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
            
            <div className={`w-20 h-20 rounded-[1.8rem] flex flex-col items-center justify-center shrink-0 shadow-xl relative z-10 transition-colors ${
              activeTab === 'Hasil Lab' ? 'bg-emerald-600 shadow-emerald-100' : 
              activeTab === 'Resep Obat' ? 'bg-amber-500 shadow-amber-100' : 'bg-blue-600 shadow-blue-100'
            } text-white`}>
               <span className="text-[10px] font-black uppercase tracking-widest opacity-60">ID</span>
               <span className="text-2xl font-black truncate max-w-full px-2">{record.id}</span>
            </div>

            <div className="flex-1 space-y-4 relative z-10">
              <div className="flex flex-wrap items-center gap-4">
                <h4 className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{record.patient}</h4>
                <div className="flex gap-2">
                   <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-700 shadow-sm">FINAL</span>
                   <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-slate-100 text-slate-600 shadow-sm border border-slate-200">VERIFIED</span>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-y-3 gap-x-8 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <span className="flex items-center gap-2 group-hover:text-slate-600 transition-colors">
                  <User size={14} className="text-blue-500" />
                  Pemeriksa: <span className="text-slate-900">{record.doctor}</span>
                </span>
                <span className="flex items-center gap-2 group-hover:text-slate-600 transition-colors">
                  <Calendar size={14} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
                  Tanggal: <span className="text-slate-900">{record.date}</span>
                </span>
                <span className={`px-3 py-1 flex items-center gap-2 rounded-lg border transition-all ${
                  activeTab === 'Semua Riwayat' || activeTab === 'Pemeriksaan' 
                    ? 'bg-blue-50 border-blue-100 text-blue-600'
                    : 'bg-slate-50 border-slate-100 text-slate-600'
                }`}>
                   Diagnosa: <span className="font-black truncate max-w-[150px]">{record.diagnosis}</span>
                </span>
              </div>

              {/* Tab Specific Content or Global History View */}
              {(activeTab === 'Hasil Lab' || (activeTab === 'Semua Riwayat' && record.details.lab && record.details.lab !== 'Tidak ada pemeriksaan lab.')) && (
                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl">
                   <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mb-1 italic">Hasil Laboratorium:</p>
                   <p className="text-xs font-bold text-emerald-900 uppercase">"{record.details.lab}"</p>
                </div>
              )}

              {(activeTab === 'Resep Obat' || (activeTab === 'Semua Riwayat' && record.details.prescription && record.details.prescription !== 'Tidak ada resep obat.')) && (
                <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl">
                   <p className="text-[9px] font-black text-amber-500 uppercase tracking-widest mb-1 italic">Rincian E-Resep Obat:</p>
                   <p className="text-xs font-black text-amber-900 uppercase">"{record.details.prescription}"</p>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-6 md:pt-0 md:pl-10 border-t md:border-t-0 md:border-l border-slate-50 shrink-0 relative z-10">
              <button 
                onClick={() => setSelectedRecord(record)}
                className={`w-full sm:w-auto px-10 py-5 ${
                  activeTab === 'Hasil Lab' ? 'bg-emerald-600' :
                  activeTab === 'Resep Obat' ? 'bg-amber-500' :
                  'bg-slate-900'
                } text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all flex items-center justify-center gap-3 active:scale-95 group/btn shadow-xl`}
              >
                <Eye size={16} className="group-hover/btn:animate-pulse" />
                Detail Report
              </button>
              <button 
                onClick={() => handleDelete(record.id)}
                className="w-full sm:w-auto p-5 bg-rose-50 text-rose-500 rounded-[1.5rem] hover:bg-rose-600 hover:text-white transition-all flex items-center justify-center active:scale-95 border border-rose-100 shadow-sm"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </motion.div>
        ))}
        {filteredRecords.length === 0 && (
          <div className="py-20 text-center text-slate-300 font-black uppercase tracking-[0.2em] bg-slate-50 rounded-[3rem] border-4 border-dashed border-slate-100">
             Tidak Ada Data Ditemukan
          </div>
        )}
      </div>
    </div>
  );
}
