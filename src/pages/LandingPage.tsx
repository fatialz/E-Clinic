import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ArrowRight, 
  CheckCircle2, 
  Stethoscope, 
  Activity, 
  ShieldCheck, 
  Clock, 
  LayoutDashboard 
} from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Clock,
      title: 'Antrian Real-time',
      description: 'Pantau status pasien dan antrian dokter secara langsung tanpa hambatan.',
    },
    {
      icon: ShieldCheck,
      title: 'Data Aman',
      description: 'Seluruh rekam medis tersimpan secara digital dengan standar keamanan tinggi.',
    },
    {
      icon: LayoutDashboard,
      title: 'Laporan Otomatis',
      description: 'Export laporan kunjungan dan pemeriksaan hanya dengan satu klik.',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 medical-gradient rounded-xl flex items-center justify-center text-white shadow-lg shadow-medical-200">
              <Stethoscope size={24} />
            </div>
            <span className="font-bold text-2xl tracking-tight text-medical-900">E-Clinic</span>
          </div>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-2.5 bg-medical-500 text-white rounded-full font-semibold hover:bg-medical-600 transition-all shadow-lg shadow-medical-100 active:scale-95"
          >
            Masuk ke Aplikasi
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-medical-50 text-medical-600 rounded-full text-sm font-bold mb-6">
              <Activity size={16} />
              <span>Digital Health Solution</span>
            </div>
            <h1 className="text-6xl lg:text-7xl font-bold text-slate-900 leading-[1.1] mb-6">
              Manajemen Klinik <span className="text-medical-500">Lebih Cerdas.</span>
            </h1>
            <p className="text-xl text-slate-500 mb-10 leading-relaxed max-w-lg">
              Optimalkan operasional klinik Anda dengan sistem rekap digital terintegrasi. 
              Mulai dari pendaftaran pasien hingga manajemen rekam medis.
            </p>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/login')}
                className="group px-8 py-4 bg-medical-500 text-white rounded-2xl font-bold text-lg flex items-center gap-2 hover:bg-medical-600 transition-all shadow-xl shadow-medical-100 active:scale-95"
              >
                Mulai Sekarang
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-8 py-4 bg-slate-50 text-slate-600 rounded-2xl font-bold text-lg hover:bg-slate-100 transition-all">
                Pelajari Fitur
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-square medical-gradient rounded-3xl overflow-hidden relative shadow-2xl">
              <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]"></div>
              {/* Mock Dashboard UI */}
              <div className="absolute inset-10 bg-white rounded-2xl shadow-2xl p-6 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="flex items-center justify-between mb-8">
                  <div className="h-4 w-32 bg-slate-100 rounded-full"></div>
                  <div className="h-8 w-8 bg-medical-50 rounded-full"></div>
                </div>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-4 items-center">
                      <div className="h-10 w-10 bg-slate-50 rounded-lg"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-3 w-full bg-slate-50 rounded-full"></div>
                        <div className="h-3 w-2/3 bg-slate-50 rounded-full"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Floating Stats */}
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-4 animate-bounce-slow">
              <div className="h-12 w-12 bg-green-50 text-green-500 rounded-xl flex items-center justify-center">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-500">Pasien Terlayani</p>
                <p className="text-2xl font-bold text-slate-900">1,250+</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Fitur Unggulan E-Clinic</h2>
            <p className="text-lg text-slate-500">Solusi lengkap untuk digitalisasi manajemen klinik modern.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all"
              >
                <div className="w-14 h-14 bg-medical-50 text-medical-500 rounded-2xl flex items-center justify-center mb-6">
                  <feature.icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 medical-gradient rounded-lg flex items-center justify-center text-white">
              <Stethoscope size={18} />
            </div>
            <span className="font-bold text-xl tracking-tight text-medical-900">E-Clinic</span>
          </div>
          <p className="text-slate-500 text-sm">© 2026 E-Clinic Management System. All rights reserved.</p>
          <div className="flex items-center gap-6 text-sm font-medium text-slate-600">
            <a href="#" className="hover:text-medical-500 transition-colors">Syarat & Ketentuan</a>
            <a href="#" className="hover:text-medical-500 transition-colors">Kebijakan Privasi</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
