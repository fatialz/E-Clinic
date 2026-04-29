import { useState } from 'react';
import { 
  Activity, 
  User, 
  Clock, 
  Search, 
  Play, 
  CheckCircle2, 
  AlertCircle, 
  ClipboardList,
  Thermometer,
  Stethoscope,
  Pill,
  Save,
  ArrowLeft,
  FlaskConical,
  Droplets,
  Heart,
  Wind
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { format } from 'date-fns';
import { recordService } from '../../services/recordService';
import { useToast } from '../../components/ui/ToastProvider';

export default function Examination() {
  const [searchParams] = useSearchParams();
  const patientIdFromUrl = searchParams.get('id');
  const navigate = useNavigate();
  const { toast } = useToast();

  const [activeQueue, setActiveQueue] = useState([
    { id: '1', patient: 'Budi Santoso', age: 45, time: '09:00', category: 'Poli Umum', status: 'Urgent', complaint: 'Batuk & Flu' },
    { id: '3', patient: 'Andi Wijaya', age: 28, time: '10:15', category: 'Poli Umum', status: 'Menunggu', complaint: 'Sakit Kepala' },
    { id: '4', patient: 'Lia Lestari', age: 35, time: '11:00', category: 'Poli Umum', status: 'Menunggu', complaint: 'Nyeri Sendi' },
  ]);

  const [selectedPatient, setSelectedPatient] = useState<any>(
    patientIdFromUrl ? activeQueue.find(p => p.id === patientIdFromUrl) || null : null
  );

  const [examData, setExamData] = useState({
    subjective: '',
    objective: '',
    assessment: '',
    plan: '',
    labResults: '',
    prescription: '',
  });

  const [showLabInput, setShowLabInput] = useState(false);
  const [showPrescriptionInput, setShowPrescriptionInput] = useState(false);

  const handleStartExam = (patient: any) => {
    setSelectedPatient(patient);
    setExamData({
      subjective: `Keluhan: ${patient.complaint || ''}\n`,
      objective: 'Tensi: / mmHg\nNadi: x/mnt\nSuhu: °C\nRR: x/mnt',
      assessment: '',
      plan: '',
      labResults: '',
      prescription: '',
    });
  };

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSave = () => {
    const newRecord = {
      id: Math.random().toString(36).substr(2, 6).toUpperCase(),
      patient: selectedPatient.patient,
      date: format(new Date(), 'd MMM yyyy'),
      diagnosis: examData.assessment || 'Observasi Umum',
      doctor: 'dr. Sarah',
      status: 'Final',
      details: {
        s: examData.subjective,
        o: examData.objective,
        a: examData.assessment,
        p: examData.plan,
        lab: examData.labResults || 'Tidak ada pemeriksaan lab.',
        prescription: examData.prescription || 'Tidak ada resep obat.'
      }
    };

    recordService.saveRecord(newRecord);
    toast("Pemeriksaan berhasil disimpan!", "success");
    setShowSuccessModal(true);
  };

  const SuccessModal = () => (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[200] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white w-full max-w-md rounded-[3rem] p-10 text-center shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-blue-500 via-emerald-500 to-blue-500"></div>
        <div className="w-24 h-24 bg-emerald-100 rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-emerald-600 shadow-xl shadow-emerald-50">
           <CheckCircle2 size={48} />
        </div>
        <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-4">Berhasil Disimpan!</h2>
        <p className="text-sm text-slate-500 font-medium leading-relaxed mb-8">
          Rekam medis untuk <span className="text-blue-600 font-black">"{selectedPatient.patient}"</span> telah berhasil diarsipkan dan resep telah diteruskan ke bagian farmasi.
        </p>
        <button 
          onClick={() => {
            setShowSuccessModal(false);
            setSelectedPatient(null);
            navigate('/app/records');
          }}
          className="w-full py-5 bg-blue-600 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:bg-black transition-all active:scale-95"
        >
          Lihat Riwayat Sekarang
        </button>
      </motion.div>
    </div>
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <AnimatePresence>
        {showSuccessModal && <SuccessModal />}
      </AnimatePresence>
      <AnimatePresence mode="wait">
        {!selectedPatient ? (
          <motion.div 
            key="queue-list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                  <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-200">
                    <Activity size={24} />
                  </div>
                  Pemeriksaan Pasien Aktif
                </h1>
                <p className="text-xs text-slate-500 font-medium mt-1">Kelola antrian aktif dan lakukan input diagnosa pemeriksaan hari ini.</p>
              </div>
              <div className="flex items-center gap-3">
                 <div className="bg-amber-50 text-amber-700 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-amber-100 flex items-center gap-2 shadow-sm">
                    <AlertCircle size={14} />
                    {activeQueue.length} Antrian Menunggu
                 </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Queue List */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 flex items-center gap-4 shadow-sm focus-within:border-blue-400 transition-all">
                  <Search className="text-slate-400" size={20} />
                  <input 
                    type="text" 
                    placeholder="Cari nomor antrian atau nama pasien..." 
                    className="bg-transparent border-none outline-none text-sm w-full font-medium"
                  />
                </div>

                <div className="space-y-4">
                  {activeQueue.length > 0 ? activeQueue.map((item, i) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm hover:border-blue-300 hover:shadow-xl transition-all group flex flex-col md:flex-row items-center justify-between gap-6"
                    >
                      <div className="flex items-center gap-6 w-full md:w-auto">
                        <div className="w-16 h-16 bg-blue-50 rounded-[1.5rem] flex flex-col items-center justify-center border border-blue-100 group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white transition-all overflow-hidden relative">
                          <span className="text-[10px] font-black uppercase opacity-60">Antrian</span>
                          <span className="text-xl font-black">{item.id}</span>
                          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 animate-pulse"></div>
                        </div>
                        <div>
                          <h4 className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{item.patient}</h4>
                          <div className="flex flex-wrap items-center gap-4 text-[10px] text-slate-400 mt-2 font-black uppercase tracking-widest">
                             <span className="flex items-center gap-1.5"><Clock size={12} className="text-blue-500" /> {item.time}</span>
                             <span className="flex items-center gap-1.5"><User size={12} className="text-slate-400" /> {item.age} Tahun</span>
                             <span className="px-2 py-0.5 bg-slate-100 rounded-md text-slate-600 border border-slate-200">{item.category}</span>
                          </div>
                          <p className="mt-3 text-xs text-slate-500 font-medium bg-slate-50 p-2 rounded-lg italic">" {item.complaint} "</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                        <span className={`text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest ${
                          item.status === 'Urgent' ? 'bg-rose-100 text-rose-600 shadow-lg shadow-rose-100' : 'bg-amber-100 text-amber-600'
                        }`}>
                          {item.status}
                        </span>
                        <button 
                          onClick={() => handleStartExam(item)}
                          className="flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-blue-200 active:scale-95 group/btn"
                        >
                          <Play size={14} fill="currentColor" />
                          Mulai Periksa
                        </button>
                      </div>
                    </motion.div>
                  )) : (
                    <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] p-12 text-center text-slate-400">
                       <Activity size={48} className="mx-auto mb-4 opacity-20" />
                       <p className="font-bold">Tidak ada antrian aktif saat ini.</p>
                       <p className="text-xs uppercase tracking-widest font-black mt-2">Menunggu Pasien Baru...</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Sidebar Queue Info */}
              <div className="space-y-6">
                <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-125 transition-transform duration-700"></div>
                   <div className="relative z-10">
                      <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6 text-blue-400">
                        <ClipboardList size={24} />
                      </div>
                      <h4 className="text-xl font-black mb-2 tracking-tight">Prosedur SOAP</h4>
                      <p className="text-xs text-slate-400 leading-relaxed mb-6 font-medium italic">"Pastikan alur Subjective, Objective, Assessment, dan Plan (SOAP) diisi secara lengkap untuk akurasi rekam medis."</p>
                      
                      <div className="space-y-3">
                         {['Subjective (Keluhan)', 'Objective (Fisik)', 'Assessment (Diagnosa)', 'Plan (Tindakan)'].map((text, idx) => (
                           <div key={idx} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest bg-white/5 p-3 rounded-xl border border-white/5">
                              <CheckCircle2 size={12} className="text-emerald-400" />
                              {text}
                           </div>
                         ))}
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="exam-form"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            {/* Exam Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl">
              <div className="flex items-center gap-6">
                <button 
                  onClick={() => setSelectedPatient(null)}
                  className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-all shadow-sm"
                >
                  <ArrowLeft size={20} />
                </button>
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                   <div className="w-20 h-20 bg-blue-600 rounded-[1.5rem] flex flex-col items-center justify-center text-white shadow-xl shadow-blue-100">
                      <span className="text-[10px] font-black uppercase opacity-60">ID Pasien</span>
                      <span className="text-2xl font-black">{selectedPatient.id}</span>
                   </div>
                   <div>
                     <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tight">{selectedPatient.patient}</h3>
                     <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-slate-400 mt-2">
                        <span className="flex items-center gap-1.5"><User size={14} className="text-blue-500" /> {selectedPatient.age} THN</span>
                        <span className="flex items-center gap-1.5"><Clock size={14} className="text-slate-400" /> MASUK {selectedPatient.time}</span>
                        <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full border border-blue-100">{selectedPatient.category}</span>
                     </div>
                   </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
              </div>
            </div>

            {/* Main Form Area */}
            <div className="grid lg:grid-cols-3 gap-8">
               <div className="lg:col-span-2 space-y-8">
                  {/* SOAP Sections */}
                  <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden p-8 space-y-8">
                     <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                              <User size={14} className="text-blue-500" />
                              Subjektif (S) - Keluhan & Anamnesa
                           </label>
                           <textarea 
                              className="w-full h-32 p-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] text-sm font-medium focus:bg-white focus:border-blue-400 outline-none transition-all resize-none"
                              value={examData.subjective}
                              onChange={(e) => setExamData({...examData, subjective: e.target.value})}
                              placeholder="Input keluhan pasien, riwayat penyakit, dll..."
                           />
                        </div>
                        <div className="space-y-4">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                              <Thermometer size={14} className="text-rose-500" />
                              Objektif (O) - Pemeriksaan Fisik / TTV
                           </label>
                           <textarea 
                              className="w-full h-32 p-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] text-sm font-medium focus:bg-white focus:border-blue-400 outline-none transition-all resize-none"
                              value={examData.objective}
                              onChange={(e) => setExamData({...examData, objective: e.target.value})}
                              placeholder="Tensi, Nadi, Suhu, RR, dll..."
                           />
                        </div>
                     </div>

                     <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                           <Stethoscope size={14} className="text-emerald-500" />
                           Asesmen (A) - Diagnosa & Kode ICD-10
                        </label>
                        <input 
                           className="w-full p-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] text-sm font-black focus:bg-white focus:border-blue-400 outline-none transition-all uppercase tracking-tight"
                           value={examData.assessment}
                           onChange={(e) => setExamData({...examData, assessment: e.target.value})}
                           placeholder="CONTOH: GASTRITIS AKUT (K29.7)"
                        />
                     </div>

                     <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                           <ClipboardList size={14} className="text-blue-500" />
                           Plan (P) - Tindakan & Edukasi
                        </label>
                        <textarea 
                           className="w-full h-32 p-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] text-sm font-medium focus:bg-white focus:border-blue-400 outline-none transition-all resize-none"
                           value={examData.plan}
                           onChange={(e) => setExamData({...examData, plan: e.target.value})}
                           placeholder="Input rencana tindakan, saran perawatan, dll..."
                        />
                     </div>

                     <div className="flex flex-col md:flex-row gap-4 pt-6 border-t border-slate-100">
                        <button 
                          onClick={() => setShowLabInput(!showLabInput)}
                          className={`flex-1 flex items-center justify-center gap-3 px-8 py-5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all shadow-xl active:scale-95 ${
                            showLabInput ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-emerald-600 text-white shadow-emerald-100 hover:bg-emerald-700'
                          }`}
                        >
                           <FlaskConical size={16} />
                           {showLabInput ? 'Lab Result AKTIF' : 'Input Hasil Lab'}
                        </button>
                        <button 
                          onClick={() => setShowPrescriptionInput(!showPrescriptionInput)}
                          className={`flex-1 flex items-center justify-center gap-3 px-8 py-5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all shadow-xl active:scale-95 ${
                            showPrescriptionInput ? 'bg-amber-100 text-amber-700 border border-amber-200' : 'bg-blue-600 text-white shadow-blue-100 hover:bg-blue-700'
                          }`}
                        >
                           <Pill size={16} />
                           {showPrescriptionInput ? 'Resep AKTIF' : 'Buat Resep Obat (E-Resep)'}
                        </button>
                     </div>
                  </div>

                  <AnimatePresence>
                    {showLabInput && (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-white rounded-[2.5rem] border border-emerald-200 shadow-xl overflow-hidden p-8 space-y-6"
                      >
                         <div className="flex items-center justify-between">
                           <h4 className="text-lg font-black text-slate-800 flex items-center gap-2 text-emerald-600">
                             <FlaskConical size={20} />
                             Laboratorium
                           </h4>
                           <button onClick={() => setShowLabInput(false)} className="text-[10px] font-black uppercase text-slate-400 hover:text-rose-500">Tutup</button>
                         </div>
                         <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Detail Pemeriksaan Penunjang (Lab/Rontgen)</label>
                            <textarea 
                              className="w-full h-32 p-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] text-sm font-medium focus:bg-white focus:border-emerald-400 outline-none transition-all resize-none"
                              value={examData.labResults}
                              onChange={(e) => setExamData({...examData, labResults: e.target.value})}
                              placeholder="Input hasil darah, urin, atau interpretasi rontgen..."
                            />
                         </div>
                      </motion.div>
                    )}

                    {showPrescriptionInput && (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-white rounded-[2.5rem] border border-amber-200 shadow-xl overflow-hidden p-8 space-y-6"
                      >
                         <div className="flex items-center justify-between">
                           <h4 className="text-lg font-black text-slate-800 flex items-center gap-2 text-amber-600">
                             <Pill size={20} />
                             E-Resep Obat
                           </h4>
                           <button onClick={() => setShowPrescriptionInput(false)} className="text-[10px] font-black uppercase text-slate-400 hover:text-rose-500">Tutup</button>
                         </div>
                         <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Daftar Obat & Aturan Pakai</label>
                            <textarea 
                              className="w-full h-32 p-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] text-sm font-black focus:bg-white focus:border-amber-400 outline-none transition-all resize-none uppercase"
                              value={examData.prescription}
                              onChange={(e) => setExamData({...examData, prescription: e.target.value})}
                              placeholder="CONTOH: PARACETAMOL 500MG 3X1 (K/P DEMAM)"
                            />
                         </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
               </div>

               <div className="space-y-8">
                  {/* Summary & Save */}
                  <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group">
                     <div className="relative z-10 space-y-8">
                        <div>
                          <h4 className="text-xl font-black mb-4 tracking-tight">Konfirmasi Simpan</h4>
                          <p className="text-xs text-white/50 leading-relaxed font-medium italic">"Data yang disimpan akan langsung terkirim ke Apotek (E-Resep) dan Administrasi (Billing)."</p>
                        </div>

                        <div className="p-6 bg-white/10 rounded-[1.5rem] border border-white/10 backdrop-blur-sm group-hover:bg-white/15 transition-all">
                           <div className="flex items-center justify-between mb-4">
                             <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Status Pemeriksaan</span>
                             <span className="w-3 h-3 bg-blue-500 rounded-full animate-pulse shadow-glow shadow-blue-500/50"></span>
                           </div>
                           <div className="space-y-2">
                             <div className="flex justify-between text-[10px] font-black uppercase tracking-widest opacity-60">
                                <span>Pasien</span>
                                <span>{selectedPatient.patient}</span>
                             </div>
                             <div className="flex justify-between text-[10px] font-black uppercase tracking-widest opacity-60">
                                <span>Waktu Selesai</span>
                                <span>{format(new Date(), 'HH:mm')} WITA</span>
                             </div>
                           </div>
                        </div>

                        <button 
                          onClick={handleSave}
                          className="w-full py-5 bg-blue-600 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-blue-600 transition-all shadow-xl shadow-blue-500/20 active:scale-95 flex items-center justify-center gap-3"
                        >
                           <Save size={16} />
                           Simpan & Selesai
                        </button>

                        <button 
                          onClick={() => setSelectedPatient(null)}
                          className="w-full py-5 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-rose-500 transition-colors"
                        >
                           Batalkan Pemeriksaan
                        </button>
                     </div>
                     <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl -mr-16 -mt-16 animate-pulse"></div>
                  </div>

                  <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
                     <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
                       <div className="p-2 bg-blue-50 rounded-lg text-blue-500">
                         <ClipboardList size={18} />
                       </div>
                       Info Medis Terkait
                     </h3>
                     <div className="space-y-4">
                        <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 italic text-[10px] font-black uppercase text-amber-700 tracking-widest">
                           Alergi Obat: Paracetamol, Amoxicillin
                        </div>
                        <div className="space-y-2">
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Riwayat Operasi</p>
                           <p className="text-xs font-bold text-slate-800">Apendiktomi (2019)</p>
                        </div>
                        <div className="space-y-2">
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Penyakit Kronis</p>
                           <p className="text-xs font-bold text-slate-800">-</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
