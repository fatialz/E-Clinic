import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Calendar, 
  Activity, 
  ClipboardList, 
  FileText, 
  Clock, 
  ChevronRight,
  TrendingUp,
  Search,
  User,
  AlertCircle,
  CheckCircle2,
  Stethoscope
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { appointmentService, Appointment } from '../../services/appointmentService';
import { recordService, MedicalRecord } from '../../services/recordService';
import { patientService, Patient } from '../../services/patientService';

export default function DoctorDashboard() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const todayDate = format(new Date(), 'yyyy-MM-dd');
  const todayDisplay = format(new Date(), 'EEEE, d MMMM yyyy');

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);

  useEffect(() => {
    const fetchData = () => {
      const allAppts = appointmentService.getAppointmentsByDate(todayDate);
      setAppointments(allAppts);

      const allRecords = recordService.getRecords();
      setRecords(allRecords);

      const allPatients = patientService.getPatients();
      setPatients(allPatients);
    };

    fetchData();
    // Refresh data every 30 seconds or on some triggers if needed
  }, [todayDate]);

  const stats = [
    { 
      label: 'Pasien Hari Ini', 
      value: appointments.length.toString(), 
      trend: '+15% dari rata-rata', 
      icon: Users, 
      color: 'text-blue-600', 
      bgColor: 'bg-blue-50' 
    },
    { 
      label: 'Antrian Aktif', 
      value: appointments.filter(a => a.status === 'Menunggu' || a.status === 'Diperiksa').length.toString(), 
      trend: 'Status Real-time', 
      icon: Activity, 
      color: 'text-amber-600', 
      bgColor: 'bg-amber-50' 
    },
    { 
      label: 'Rekam Medis Pending', 
      value: records.filter(r => r.status !== 'Final').length.toString(), 
      trend: 'Perlu diselesaikan', 
      icon: ClipboardList, 
      color: 'text-rose-600', 
      bgColor: 'bg-rose-50' 
    },
    { 
      label: 'Total Selesai', 
      value: appointments.filter(a => a.status === 'Selesai').length.toString(), 
      trend: 'Hari ini', 
      icon: CheckCircle2, 
      color: 'text-emerald-600', 
      bgColor: 'bg-emerald-50' 
    },
  ];

  const pendingRecordsData = records
    .filter(r => r.status !== 'Final')
    .slice(0, 3)
    .map(r => ({
      id: r.id,
      patient: r.patient,
      date: r.date,
      type: 'Rawat Jalan',
      severity: r.diagnosis ? 'Medium' : 'High'
    }));

  const patientSummaries = patients
    .slice(0, 3)
    .map(p => ({
      name: p.name,
      condition: 'Pemeriksaan Rutin', // This could be more dynamic if records were linked better
      lastVisit: format(new Date(p.lastVisit), 'd MMM yyyy'),
      note: p.status === 'Aktif' ? 'Pasien aktif dalam pemantauan' : 'Pasien tidak aktif'
    }));

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-10">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-medical-600 to-blue-700 p-8 md:p-12 text-white shadow-2xl">
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="p-2 bg-white/20 backdrop-blur-md rounded-xl">
                <Stethoscope size={24} />
              </span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Doctor Portal</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
              Halo, dr. {profile?.full_name?.split(' ')[1] || 'Dokter'}
            </h1>
            <p className="text-white/80 text-lg font-medium max-w-xl">
              Selamat datang kembali. Anda memiliki <span className="text-white font-black underline decoration-blue-400 underline-offset-4">{appointments.filter(a => a.status === 'Menunggu').length} janji temu</span> pagi ini yang sedang menunggu.
            </p>
          </motion.div>
        </div>
        
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32 animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl -mb-32"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex items-center gap-5 hover:border-blue-300 hover:shadow-lg transition-all"
          >
            <div className={`p-4 rounded-2xl ${stat.bgColor} ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">{stat.label}</p>
              <p className="text-2xl font-black text-slate-800 leading-none">{stat.value}</p>
              <p className="text-[9px] text-slate-400 font-bold uppercase mt-2">{stat.trend}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          {/* Today's Appointments */}
          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-white">
              <div>
                <h3 className="text-xl font-black text-slate-800">Janji Temu Hari Ini</h3>
                <p className="text-xs text-slate-500 font-medium mt-1">{todayDisplay}</p>
              </div>
              <button 
                onClick={() => navigate('/app/schedule')}
                className="p-3 bg-slate-50 rounded-xl text-slate-400 hover:text-blue-600 transition-colors"
              >
                <Search size={20} />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50">
                  <tr>
                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Waktu</th>
                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Pasien</th>
                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Alasan</th>
                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {appointments.length > 0 ? appointments.map((apt) => (
                    <tr 
                      key={apt.id} 
                      className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                      onClick={() => navigate('/app/medical-records')}
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2 text-slate-800">
                          <Clock size={14} className="text-blue-500" />
                          <span className="text-sm font-black">{apt.time}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="text-sm font-black text-slate-800">{apt.patient}</span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase">{apt.type}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-sm text-slate-600 font-medium">{apt.reason || 'Pemeriksaan rutin'}</span>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                          apt.status === 'Selesai' ? 'bg-emerald-100 text-emerald-700' :
                          apt.status === 'Diperiksa' ? 'bg-blue-100 text-blue-700 animate-pulse' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {apt.status}
                        </span>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={4} className="px-8 py-10 text-center text-slate-400 font-medium">
                        Tidak ada janji temu hari ini.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="p-6 bg-slate-50/50 border-t border-slate-100 text-center">
              <button 
                onClick={() => navigate('/app/schedule')}
                className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-700 inline-flex items-center gap-2"
              >
                Lihat Jadwal Lengkap <ChevronRight size={14} />
              </button>
            </div>
          </div>

          {/* Pending Medical Records */}
          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-8">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black text-slate-800 flex items-center gap-3">
                <AlertCircle className="text-rose-500" size={24} />
                Rekam Medis Tertunda
              </h3>
              <span className="bg-rose-100 text-rose-600 text-[10px] font-black px-3 py-1 rounded-full uppercase">Perlu Perhatian</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {pendingRecordsData.length > 0 ? pendingRecordsData.map((record) => (
                <div key={record.id} className="p-6 rounded-3xl border border-slate-100 bg-slate-50 hover:border-blue-200 hover:bg-white hover:shadow-md transition-all group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-white rounded-xl text-slate-400 group-hover:text-blue-500 transition-colors">
                      <FileText size={20} />
                    </div>
                    <span className={`text-[8px] font-black uppercase px-2 py-1 rounded ${
                      record.severity === 'High' ? 'bg-rose-100 text-rose-600' :
                      record.severity === 'Medium' ? 'bg-amber-100 text-amber-600' :
                      'bg-blue-100 text-blue-600'
                    }`}>
                      {record.severity} Priority
                    </span>
                  </div>
                  <h4 className="text-sm font-black text-slate-800 mb-1">{record.patient}</h4>
                  <p className="text-[10px] text-slate-500 font-bold uppercase mb-4">{record.type} • {record.date}</p>
                  <button 
                    onClick={() => navigate('/app/medical-records')}
                    className="w-full py-3 bg-white border border-slate-200 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all"
                  >
                    Lengkapi Data
                  </button>
                </div>
              )) : (
                <div className="col-span-3 text-center py-6 text-slate-400 font-medium">
                  Semua rekam medis telah ditandatangani.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Space */}
        <div className="space-y-8">
          {/* Patient Summary Quick View */}
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl">
            <h3 className="text-xl font-black tracking-tight mb-8 flex items-center gap-2">
              <Users size={20} className="text-blue-400" />
              Ringkasan Pasien
            </h3>
            <div className="space-y-6">
              {patientSummaries.length > 0 ? patientSummaries.map((ps, i) => (
                <div key={i} className="group cursor-pointer" onClick={() => navigate('/app/patients')}>
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-sm font-black">{ps.name}</p>
                    <span className="text-[8px] font-black uppercase text-blue-400">{ps.lastVisit}</span>
                  </div>
                  <p className="text-[10px] text-white/50 font-bold uppercase tracking-tight mb-2">{ps.condition}</p>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-[10px] italic text-white/70 leading-relaxed group-hover:bg-white/10 transition-colors">
                    "{ps.note}"
                  </div>
                </div>
              )) : (
                <p className="text-xs text-white/40 italic">Tidak ada data pasien tersedia.</p>
              )}
            </div>
            <button 
              onClick={() => navigate('/app/patients')}
              className="w-full mt-8 py-4 bg-white/10 hover:bg-white/15 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
            >
              Cari Semua Pasien
            </button>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm">
            <h3 className="text-lg font-black text-slate-800 mb-6 tracking-tight">Tindakan Cepat</h3>
            <div className="space-y-3">
              {[
                { label: 'Input Pemeriksaan Baru', icon: Stethoscope, path: '/app/medical-records', color: 'text-blue-600', bg: 'bg-blue-50' },
                { label: 'Lihat Jadwal Operasi', icon: Calendar, path: '/app/schedule', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                { label: 'Eksport Laporan Harian', icon: FileText, path: '/app/reports', color: 'text-amber-600', bg: 'bg-amber-50' },
                { label: 'Data Pasien Kritis', icon: Users, path: '/app/patients', color: 'text-rose-600', bg: 'bg-rose-50' },
              ].map((action, i) => (
                <button
                  key={i}
                  onClick={() => navigate(action.path)}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl border border-slate-50 hover:border-slate-200 hover:shadow-md transition-all group"
                >
                  <div className={`p-3 rounded-xl ${action.bg} ${action.color} group-hover:scale-110 transition-transform`}>
                    <action.icon size={18} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-tight text-slate-600">{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tips/Info */}
          <div className="p-8 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-[2.5rem] border border-blue-100 flex items-start gap-4">
            <div className="p-3 bg-white rounded-2xl text-blue-500 shadow-sm">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-xs font-black text-slate-800 mb-1">Efisiensi Klinik</p>
              <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                Rata-rata waktu pemeriksaan anda meningkat 12% minggu ini. Pertahankan kualitas pelayanan!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

