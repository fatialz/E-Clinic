import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  User, 
  Save, 
  Trash2, 
  Power, 
  X, 
  Edit2, 
  RefreshCw,
  GripVertical
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay } from 'date-fns';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence, Reorder } from 'motion/react';
import { useToast } from '../../components/ui/ToastProvider';

interface Appointment {
  id: string;
  patient: string;
  time: string;
  type: string;
  doctor: string;
}

export default function Schedule() {
  const { toast } = useToast();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isEditingPraktek, setIsEditingPraktek] = useState(false);
  
  // Appointment Management State
  const [appointmentsByDate, setAppointmentsByDate] = useState<Record<string, Appointment[]>>({
    [format(new Date(), 'yyyy-MM-dd')]: [
      { id: '1', patient: 'Budi Santoso', time: '09:00', type: 'General Checkup', doctor: 'dr. Sarah' },
      { id: '2', patient: 'Ani Wijaya', time: '10:30', type: 'Konsultasi Spesialis', doctor: 'dr. Sarah' },
      { id: '3', patient: 'Siti Aminah', time: '14:00', type: 'Follow up', doctor: 'dr. Sarah' },
    ]
  });

  const dateKey = format(selectedDate, 'yyyy-MM-dd');
  const activeAppointments = appointmentsByDate[dateKey] || [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [formData, setFormData] = useState({
    patient: '',
    time: '09:00',
    type: 'General Checkup',
    doctor: 'dr. Sarah'
  });

  const [practiceSchedule, setPracticeSchedule] = useState([
    { day: 'Senin', morning: '08:00 - 12:00', evening: '16:00 - 20:00', active: true },
    { day: 'Selasa', morning: '08:00 - 12:00', evening: '16:00 - 20:00', active: true },
    { day: 'Rabu', morning: '08:00 - 12:00', evening: '16:00 - 20:00', active: true },
    { day: 'Kamis', morning: '08:00 - 12:00', evening: '16:00 - 20:00', active: true },
    { day: 'Jumat', morning: '08:00 - 12:00', evening: 'Libur', active: true },
    { day: 'Sabtu', morning: '09:00 - 12:00', evening: 'Libur', active: false },
    { day: 'Minggu', morning: 'Libur', evening: 'Libur', active: false },
  ]);

  const days = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  });

  const toggleDayActive = (index: number) => {
    const newSchedule = [...practiceSchedule];
    newSchedule[index].active = !newSchedule[index].active;
    setPracticeSchedule(newSchedule);
  };

  const swapSessions = (index: number) => {
    const newSchedule = [...practiceSchedule];
    const temp = newSchedule[index].morning;
    newSchedule[index].morning = newSchedule[index].evening;
    newSchedule[index].evening = temp;
    setPracticeSchedule(newSchedule);
    toast(`Sesi ${newSchedule[index].day} telah ditukar`, "info");
  };

  const updatePracticeTime = (index: number, field: 'morning' | 'evening', value: string) => {
    const newSchedule = [...practiceSchedule];
    (newSchedule[index] as any)[field] = value;
    setPracticeSchedule(newSchedule);
  };

  const handleSaveSchedule = () => {
    setIsEditingPraktek(false);
    alert('Jadwal Praktek Real-time telah diperbarui!');
  };

  const openAddModal = () => {
    setEditingAppointment(null);
    setFormData({
      patient: '',
      time: '09:00',
      type: 'General Checkup',
      doctor: 'dr. Sarah'
    });
    setIsModalOpen(true);
  };

  const openEditModal = (apt: Appointment) => {
    setEditingAppointment(apt);
    setFormData({
      patient: apt.patient,
      time: apt.time,
      type: apt.type,
      doctor: apt.doctor
    });
    setIsModalOpen(true);
  };

  const handleSaveAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.patient) return;

    setAppointmentsByDate(prev => {
      const currentDayApts = prev[dateKey] || [];
      let updatedDayApts;

      if (editingAppointment) {
        updatedDayApts = currentDayApts.map(a => 
          a.id === editingAppointment.id ? { ...a, ...formData } : a
        );
      } else {
        const newApt: Appointment = {
          id: Math.random().toString(36).substr(2, 9),
          ...formData
        };
        updatedDayApts = [...currentDayApts, newApt].sort((a, b) => a.time.localeCompare(b.time));
      }

      return {
        ...prev,
        [dateKey]: updatedDayApts
      };
    });
    setIsModalOpen(false);
    toast(editingAppointment ? "Jadwal berhasil diperbarui!" : "Jadwal baru berhasil ditambahkan!", "success");
    setEditingAppointment(null);
  };

  const handleDeleteAppointment = (id: string) => {
    setAppointmentsByDate(prev => ({
      ...prev,
      [dateKey]: (prev[dateKey] || []).filter(a => a.id !== id)
    }));
  };

  const AppointmentModal = () => (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl"
      >
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-100">
                <CalendarIcon size={20} />
              </div>
              <div>
                 <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                    {editingAppointment ? 'Edit Janji Temu' : 'Tambah Janji Temu'}
                 </h2>
                 <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Input Data Kedatangan Pasien</p>
              </div>
           </div>
           <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-rose-500 transition-colors">
              <X size={24} />
           </button>
        </div>

        <form onSubmit={handleSaveAppointment} className="p-8 space-y-6">
           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Nama Pasien</label>
              <input 
                autoFocus
                className="w-full p-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] text-sm font-bold focus:bg-white focus:border-blue-400 outline-none transition-all uppercase placeholder:text-slate-200"
                placeholder="CONTOH: BUDI SANTOSO"
                value={formData.patient}
                onChange={e => setFormData({...formData, patient: e.target.value})}
                required
              />
           </div>

           <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Jam Kedatangan</label>
                <input 
                  type="time"
                  className="w-full p-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] text-sm font-bold focus:bg-white focus:border-blue-400 outline-none transition-all"
                  value={formData.time}
                  onChange={e => setFormData({...formData, time: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Kategori</label>
                <select 
                  className="w-full p-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] text-sm font-bold focus:bg-white focus:border-blue-400 outline-none transition-all appearance-none"
                  value={formData.type}
                  onChange={e => setFormData({...formData, type: e.target.value})}
                >
                   <option>General Checkup</option>
                   <option>Konsultasi Spesialis</option>
                   <option>Follow up</option>
                   <option>Urgent</option>
                </select>
              </div>
           </div>

           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Dokter Pemeriksa</label>
              <select 
                className="w-full p-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] text-sm font-bold focus:bg-white focus:border-blue-400 outline-none transition-all appearance-none"
                value={formData.doctor}
                onChange={e => setFormData({...formData, doctor: e.target.value})}
              >
                 <option>dr. Sarah</option>
                 <option>dr. Andi</option>
                 <option>dr. Herman</option>
              </select>
           </div>

           <button 
             type="submit"
             className="w-full py-5 bg-blue-600 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:bg-black transition-all flex items-center justify-center gap-2 active:scale-95"
           >
              <Save size={16} />
              Simpan Janji Temu
           </button>
        </form>
      </motion.div>
    </div>
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-10">
       <AnimatePresence>
         {isModalOpen && <AppointmentModal />}
       </AnimatePresence>

       <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
            <div className="p-3 bg-medical-500 rounded-2xl text-white shadow-lg shadow-medical-100">
              <CalendarIcon size={24} />
            </div>
            Manajemen Jadwal
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1 uppercase tracking-widest leading-loose">Atur jam praktek harian dan pantau janji temu pasien.</p>
        </div>
        <div className="flex gap-3">
           <button 
            onClick={() => setIsEditingPraktek(!isEditingPraktek)}
            className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all flex items-center gap-2 ${
              isEditingPraktek ? 'bg-amber-600 text-white border-amber-600' : 'bg-white text-slate-600 border-slate-200 hover:shadow-lg'
            }`}
           >
             <Clock size={16} />
             {isEditingPraktek ? 'Batal Edit' : 'Atur Jam Praktek'}
           </button>
           <button 
            onClick={openAddModal}
            className="px-6 py-3 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-black transition-all flex items-center gap-2 active:scale-95"
           >
             <Plus size={16} />
             Tambah Manual
           </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Left Side: Calendar & Practice Hours */}
        <div className="lg:col-span-5 space-y-8">
          <AnimatePresence mode="wait">
            {!isEditingPraktek ? (
              <motion.div 
                key="calendar"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-8"
              >
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">{format(currentDate, 'MMMM yyyy')}</h2>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}
                      className="p-2.5 hover:bg-slate-50 rounded-xl text-slate-500 transition-colors border border-slate-100"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button 
                      onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}
                      className="p-2.5 hover:bg-slate-50 rounded-xl text-slate-500 transition-colors border border-slate-100"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-2 mb-4">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                    <div key={day} className="text-center text-[10px] font-black text-slate-400 py-2 uppercase tracking-widest">{day}</div>
                  ))}
                  {days.map((day, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedDate(day)}
                      disabled={!isSameMonth(day, currentDate)}
                      className={cn(
                        "aspect-square flex flex-col items-center justify-center rounded-2xl text-xs transition-all relative group",
                        !isSameMonth(day, currentDate) ? "text-slate-200" : "text-slate-700 font-bold hover:bg-medical-50 hover:text-medical-600",
                        isSameDay(day, selectedDate) && "bg-medical-600 text-white hover:bg-medical-600 hover:text-white shadow-xl shadow-medical-100 transform scale-110 z-10",
                        isToday(day) && !isSameDay(day, selectedDate) && "text-medical-600 font-black ring-2 ring-medical-100"
                      )}
                    >
                      {format(day, 'd')}
                      {isSameMonth(day, currentDate) && Math.random() > 0.7 && (
                        <div className={cn(
                          "w-1 h-1 rounded-full absolute bottom-2",
                          isSameDay(day, selectedDate) ? "bg-white" : "bg-medical-400"
                        )}></div>
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="edit-praktek"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-white rounded-[2.5rem] border border-amber-200 shadow-xl p-8 space-y-6"
              >
                 <div>
                   <h2 className="text-xl font-black text-slate-900 tracking-tight">Konfigurasi Jam Praktek</h2>
                   <p className="text-xs text-slate-400 font-medium mt-1">Perubahan ini akan langsung terlihat secara real-time.</p>
                 </div>
                 
                 <Reorder.Group 
                   axis="y" 
                   values={practiceSchedule} 
                   onReorder={setPracticeSchedule}
                   className="space-y-3"
                 >
                   {practiceSchedule.map((s, idx) => (
                     <Reorder.Item 
                       key={s.day} 
                       value={s}
                       className={cn(
                         "flex items-center justify-between p-4 rounded-2xl border transition-all",
                         s.active ? "bg-white border-slate-200 shadow-sm" : "bg-slate-50 border-slate-100 opacity-60"
                       )}
                     >
                        <div className="flex items-center gap-4 flex-1">
                           <div className="flex items-center gap-2">
                             <div className="cursor-grab active:cursor-grabbing p-1 text-slate-300 hover:text-slate-500 transition-colors">
                               <GripVertical size={18} />
                             </div>
                             <button 
                              onClick={() => toggleDayActive(idx)}
                              className={cn(
                                "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none",
                                s.active ? "bg-blue-600" : "bg-slate-300"
                              )}
                             >
                               <span
                                 className={cn(
                                   "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                                   s.active ? "translate-x-6" : "translate-x-1"
                                 )}
                               />
                             </button>
                           </div>
                           
                           <div className="flex-1">
                               <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <p className={cn(
                                      "text-xs font-black uppercase tracking-tighter",
                                      s.active ? "text-slate-800" : "text-slate-400"
                                    )}>{s.day}</p>
                                    {!s.active && <span className="text-[8px] font-black text-rose-500 uppercase tracking-widest bg-rose-50 px-2 py-0.5 rounded-md">Off</span>}
                                  </div>
                                  {isEditingPraktek && s.active && (
                                    <button 
                                      onClick={() => swapSessions(idx)}
                                      className="p-1 px-3 bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white rounded-lg text-[8px] font-black uppercase tracking-widest transition-all flex items-center gap-1.5 border border-slate-100"
                                    >
                                      <RefreshCw size={10} /> Swap Sesi
                                    </button>
                                  )}
                               </div>
                              {isEditingPraktek && s.active ? (
                                <div className="grid grid-cols-2 gap-3 mt-1">
                                  <div className="space-y-1">
                                     <span className="text-[7px] font-black text-slate-400 uppercase tracking-[0.2em] block pl-1">Pagi</span>
                                     <input 
                                       value={s.morning}
                                       onChange={(e) => updatePracticeTime(idx, 'morning', e.target.value)}
                                       className="w-full text-[10px] text-slate-600 font-bold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-blue-400 focus:bg-white transition-all shadow-inner"
                                       placeholder="08:00 - 12:00"
                                     />
                                  </div>
                                  <div className="space-y-1">
                                     <span className="text-[7px] font-black text-slate-400 uppercase tracking-[0.2em] block pl-1">Sore</span>
                                     <input 
                                       value={s.evening}
                                       onChange={(e) => updatePracticeTime(idx, 'evening', e.target.value)}
                                       className="w-full text-[10px] text-slate-600 font-bold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-blue-400 focus:bg-white transition-all shadow-inner"
                                       placeholder="16:00 - 20:00"
                                     />
                                  </div>
                                </div>
                              ) : (
                                <p className="text-[10px] text-slate-500 font-bold bg-slate-100/50 w-fit px-3 py-1 rounded-lg border border-slate-100">
                                  {s.active ? `${s.morning} | ${s.evening}` : 'Tidak Ada Jadwal'}
                                </p>
                              )}
                           </div>
                        </div>
                     </Reorder.Item>
                   ))}
                 </Reorder.Group>

                 <button 
                  onClick={handleSaveSchedule}
                  className="w-full py-5 bg-blue-600 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-black transition-all flex items-center justify-center gap-2"
                 >
                    <Save size={16} />
                    Simpan Konfigurasi
                 </button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group">
             <div className="relative z-10">
                <h3 className="text-xl font-black mb-4">Ringkasan Sesi Hari Ini</h3>
                <div className="grid grid-cols-2 gap-4">
                   <div className="p-4 bg-white/10 rounded-2xl border border-white/10">
                      <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Total Janji</p>
                      <p className="text-2xl font-black">{activeAppointments.length}</p>
                   </div>
                   <div className="p-4 bg-white/10 rounded-2xl border border-white/10">
                      <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Status Open</p>
                      <p className="text-2xl font-black">Online</p>
                   </div>
                </div>
             </div>
             <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
          </div>
        </div>

        {/* Right Side: Appointments List */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-8 min-h-full flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Daftar Janji Temu</h3>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">{format(selectedDate, 'EEEE, d MMMM yyyy')}</p>
              </div>
              <div className="px-5 py-2.5 bg-blue-50 rounded-2xl text-blue-600 text-[10px] font-black uppercase tracking-widest border border-blue-100 shadow-sm">
                {activeAppointments.length} PASIEN TERJADWAL
              </div>
            </div>

            <div className="space-y-6 flex-1">
              {activeAppointments.map((apt, i) => (
                <motion.div 
                  key={apt.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="group relative pl-16 py-2"
                >
                  <div className="absolute left-6 top-0 bottom-0 w-px bg-slate-100 group-last:bottom-auto group-last:h-1/2"></div>
                  <div className="absolute left-[19px] top-8 w-4 h-4 rounded-full border-4 border-white bg-blue-600 shadow-lg shadow-blue-100 z-10 transition-transform group-hover:scale-125"></div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-6 bg-white rounded-[2rem] border border-slate-100 group-hover:border-blue-300 group-hover:shadow-2xl transition-all cursor-pointer group-hover:-translate-x-2">
                    <div className="flex items-center gap-6">
                      <div className="flex flex-col items-center justify-center min-w-[70px] h-16 bg-slate-50 rounded-2xl transition-all group-hover:bg-blue-600 group-hover:text-white">
                        <Clock size={18} className="text-slate-400 group-hover:text-white/50 mb-1" />
                        <span className="text-sm font-black tracking-tight">{apt.time}</span>
                      </div>
                      <div>
                        <p className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{apt.patient}</p>
                        <div className="flex items-center gap-3 mt-1.5">
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                              <User size={12} className="text-blue-500" />
                              {apt.doctor}
                           </span>
                           <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{apt.type}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all transform translate-x-0 md:translate-x-4 md:group-hover:translate-x-0 relative z-30">
                       <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditModal(apt);
                        }}
                        className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all border border-slate-100 hover:border-blue-200 shadow-sm"
                       >
                          <Edit2 size={18} />
                       </button>
                       <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteAppointment(apt.id);
                        }}
                        className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-rose-50 hover:text-rose-600 transition-all border border-slate-100 hover:border-rose-200 shadow-sm"
                       >
                          <Trash2 size={18} />
                       </button>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {activeAppointments.length === 0 && (
                <div className="py-24 flex flex-col items-center justify-center text-slate-300">
                  <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-6 border-2 border-dashed border-slate-100">
                    <CalendarIcon size={32} className="opacity-20" />
                  </div>
                  <p className="font-black text-[10px] uppercase tracking-widest">Tidak ada jadwal untuk tanggal ini</p>
                </div>
              )}
            </div>
            
            <button 
              onClick={openAddModal}
              className="mt-12 w-full py-5 border-2 border-dashed border-slate-200 rounded-[2rem] text-[10px] font-black uppercase tracking-widest text-slate-400 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/30 transition-all"
            >
               Terima Janji Temu Walk-in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
