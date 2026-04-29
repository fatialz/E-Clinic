import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'motion/react';
import { 
  ArrowRight, 
  CheckCircle2, 
  Stethoscope, 
  Activity, 
  ShieldCheck, 
  Clock, 
  LayoutDashboard,
  Zap,
  Globe,
  Database,
  Users,
  Smartphone,
  ChevronRight
} from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const cardRef = useRef<HTMLDivElement>(null);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 100 };
  const rotateX = useSpring(useTransform(mouseY, [0, 400], [10, -10]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [0, 800], [-10, 10]), springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(400); // Center value
    mouseY.set(200); // Center value
  };

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  const features = [
    {
      icon: Clock,
      title: 'Antrian Real-time',
      description: 'Pantau status pasien dan antrian dokter secara langsung dengan sinkronisasi milidetik.',
      color: 'blue'
    },
    {
      icon: ShieldCheck,
      title: 'Data Terenkripsi',
      description: 'Keamanan data tingkat bank dengan enkripsi end-to-end untuk seluruh rekam medis.',
      color: 'indigo'
    },
    {
      icon: LayoutDashboard,
      title: 'Analytics Lanjut',
      description: 'Wawasan mendalam tentang performa klinik Anda dengan dashboard analytics modern.',
      color: 'violet'
    },
    {
      icon: Users,
      title: 'Manajemen Staff',
      description: 'Kelola hak akses dan jadwal dokter dengan sistem otorisasi yang presisi.',
      color: 'emerald'
    },
    {
      icon: Globe,
      title: 'Akses Dimana Saja',
      description: 'Sistem berbasis cloud yang memungkinkan akses aman dari perangkat apapun.',
      color: 'sky'
    },
    {
      icon: Zap,
      title: 'Performa Kilat',
      description: 'Optimasi stack modern memastikan interface yang responsif dan tanpa lag.',
      color: 'amber'
    }
  ];

  const stats = [
    { label: 'Uptime', value: '99.99%', icon: Activity },
    { label: 'Terkoneksi', value: '500+', icon: Database },
    { label: 'Mobile Ready', value: '100%', icon: Smartphone },
  ];

  return (
    <div ref={containerRef} className="relative min-h-screen bg-white overflow-hidden selection:bg-blue-100 selection:text-blue-900">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div 
          style={{ y: backgroundY }}
          className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] rounded-full bg-blue-100/50 blur-[120px] mix-blend-multiply transition-colors"
        />
        <motion.div 
          style={{ y: backgroundY }}
          className="absolute bottom-[10%] -right-[10%] w-[50%] h-[50%] rounded-full bg-indigo-50/50 blur-[120px] mix-blend-multiply"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 px-6 pt-6">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="max-w-7xl mx-auto h-16 bg-white/70 backdrop-blur-xl border border-slate-200/50 rounded-2xl px-6 flex items-center justify-between shadow-sm"
        >
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-9 h-9 medical-gradient rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:rotate-12 transition-transform duration-300">
              <Stethoscope size={20} />
            </div>
            <span className="font-bold text-xl tracking-tighter text-slate-900">E-Clinic<span className="text-blue-600">.</span></span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-blue-600 transition-colors uppercase">Utama</button>
            <button onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-blue-600 transition-colors uppercase">Fitur</button>
          </div>

          <button
            onClick={() => navigate('/login')}
            className="px-5 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg active:scale-95"
          >
            Launch App
          </button>
        </motion.div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-44 pb-32 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-100 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-8 shadow-sm">
              <Activity size={14} className="animate-pulse" />
              <span>Sistem Klinik Masa Depan</span>
            </div>
            
            <div className="flex flex-col items-center justify-center">
              <h1 className="text-6xl md:text-8xl font-black text-slate-900 leading-[0.95] tracking-tighter mb-8 max-w-5xl mx-auto flex flex-col items-center">
                <motion.span 
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: { transition: { staggerChildren: 0.05 } }
                  }}
                  className="flex flex-wrap justify-center overflow-hidden"
                >
                  {"ELEVATE YOUR".split("").map((char, i) => (
                    <motion.span
                      key={i}
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0 }
                      }}
                      transition={{ duration: 0.1 }}
                      className={char === " " ? "mr-[0.2em]" : ""}
                    >
                      {char}
                    </motion.span>
                  ))}
                </motion.span>
                <motion.span 
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: { transition: { staggerChildren: 0.05, delayChildren: 0.8 } }
                  }}
                  className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 flex flex-wrap justify-center"
                >
                  {"HEALTH PRACTICE.".split("").map((char, i) => (
                    <motion.span
                      key={i}
                      variants={{
                        hidden: { opacity: 0, scale: 0.8 },
                        visible: { opacity: 1, scale: 1 }
                      }}
                      transition={{ duration: 0.1 }}
                      className={char === " " ? "mr-[0.2em]" : ""}
                    >
                      {char}
                    </motion.span>
                  ))}
                </motion.span>
              </h1>
            </div>
            
            <p className="text-xl text-slate-500 mb-12 leading-relaxed max-w-2xl mx-auto font-medium">
              Manajemen klinik modern yang presisi. Dibangun dengan standar industri 
              untuk memberikan pengalaman terbaik bagi pasien dan praktisi medis.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/login')}
                className="group px-10 py-5 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-blue-700 transition-all shadow-2xl shadow-blue-200"
              >
                Mulai Sekarang
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </motion.button>
              
              <button 
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-10 py-5 bg-white text-slate-900 border border-slate-200 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm"
              >
                Jelajahi Fitur
              </button>
            </div>

            {/* Floating Tech Labels */}
            <div className="mt-16 flex flex-wrap justify-center gap-4 text-slate-400 font-bold text-[10px] uppercase tracking-widest opacity-60">
              <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 rounded-full border border-slate-100">Clean Code</span>
              <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 rounded-full border border-slate-100">Secure Data</span>
              <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 rounded-full border border-slate-100">Cloud Sync</span>
              <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 rounded-full border border-slate-100">Scalable</span>
            </div>
          </motion.div>

          {/* Abstract Device Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="mt-24 relative max-w-5xl mx-auto px-4"
          >
            <motion.div 
               ref={cardRef}
               onMouseMove={handleMouseMove}
               onMouseLeave={handleMouseLeave}
               style={{ rotateX, rotateY, perspective: 1000 }}
               className="relative group cursor-crosshair"
            >
              <div className="absolute inset-0 bg-blue-400/10 blur-[100px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
              <div className="relative bg-white rounded-[2.5rem] p-4 border border-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden">
                <div className="bg-slate-50 rounded-[1.8rem] overflow-hidden border border-slate-100 aspect-[16/9] flex items-center justify-center relative">
                  {/* Digital Dashboard Preview */}
                  <div className="absolute inset-0 p-8 grid grid-cols-12 gap-6 bg-slate-50">
                    <div className="col-span-12 h-16 bg-white rounded-2xl flex items-center px-6 justify-between border border-slate-100 mb-2">
                       <div className="flex items-center gap-4">
                          <div className="w-8 h-8 medical-gradient rounded-lg"></div>
                          <div className="h-3 w-40 bg-slate-100 rounded-full"></div>
                       </div>
                       <div className="flex gap-2">
                          <div className="w-8 h-8 bg-slate-100 rounded-full"></div>
                          <div className="w-8 h-8 bg-slate-100 rounded-full"></div>
                       </div>
                    </div>
                    <div className="col-span-4 space-y-4">
                      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm text-left">
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-4">Doctor Availability</p>
                        <div className="space-y-4">
                          {[
                            { name: 'Dr. Sarah', special: 'Gigi', time: '08:00 - 14:00' },
                            { name: 'Dr. John', special: 'Umum', time: '14:00 - 20:00' }
                          ].map((d, i) => (
                            <div key={i} className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-blue-50 rounded-xl"></div>
                              <div>
                                <p className="text-[10px] font-bold text-slate-900">{d.name}</p>
                                <p className="text-[7px] text-slate-400 font-medium">{d.special} • {d.time}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="col-span-8 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-blue-600 rounded-3xl p-6 text-white overflow-hidden relative group/card text-left">
                          <div className="relative z-10">
                            <p className="text-[8px] font-black uppercase tracking-widest opacity-60">Total Appointments</p>
                            <p className="text-3xl font-black mt-2">124</p>
                          </div>
                          <Activity className="absolute -bottom-4 -right-4 w-24 h-24 text-white/10 rotate-12" />
                        </div>
                        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm text-left">
                           <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Revenue Status</p>
                           <div className="mt-4 h-12 flex items-end gap-1">
                              {[30, 60, 45, 90, 65, 80].map((h, i) => (
                                <div key={i} className="flex-1 bg-blue-100 rounded-t-lg transition-all group-hover:bg-blue-500" style={{ height: `${h}%` }}></div>
                              ))}
                           </div>
                        </div>
                      </div>
                      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm text-left">
                         <div className="flex items-center justify-between mb-4">
                            <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Patient Queue</span>
                            <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center">
                               <Users size={12} className="text-slate-400" />
                            </div>
                         </div>
                         <div className="space-y-2">
                           {[1, 2].map(i => (
                             <div key={i} className="h-10 bg-slate-50 rounded-xl border border-slate-100 flex items-center px-4 justify-between">
                                <div className="h-2 w-24 bg-slate-200 rounded-full"></div>
                                <div className="w-4 h-4 bg-blue-100 rounded-full"></div>
                             </div>
                           ))}
                         </div>
                      </div>
                    </div>
                  </div>
                  {/* Floating Notification */}
                  <motion.div 
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-10 right-10 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-100"
                  >
                    <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
                      <CheckCircle2 size={24} />
                    </div>
                    <div className="text-left">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Status Done</p>
                      <p className="text-sm font-bold text-slate-900 mt-1">Antrian Terverifikasi</p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="relative z-10 border-y border-slate-100 bg-slate-50/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100 py-12">
          {stats.map((stat, i) => (
            <div key={i} className="flex flex-col items-center justify-center px-10">
              <div className="text-blue-600 mb-2">
                <stat.icon size={24} />
              </div>
              <p className="text-3xl font-black text-slate-900 tracking-tighter">{stat.value}</p>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="relative z-10 py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tighter">SISTEM INTEGRASI TOTAL.</h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              Lupakan kerumitan administrasi manual. Platform kami menghadirkan efisiensi di setiap titik layanan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -8, backgroundColor: "rgba(255,255,255,1)", borderColor: "rgba(37,99,235,0.2)" }}
                transition={{ type: "spring", stiffness: 300 }}
                className="group p-8 rounded-[2rem] border border-slate-100 bg-slate-50/50 hover:shadow-[0_20px_40px_rgba(0,0,0,0.03)] transition-all duration-500"
              >
                <div className="mb-6 relative">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-slate-900 group-hover:text-blue-600 border border-slate-100 group-hover:border-blue-100 transition-all duration-300">
                    <feature.icon size={28} />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4 tracking-tight flex items-center gap-2">
                  {feature.title}
                  <ChevronRight size={16} className="text-blue-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed font-medium">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-20 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 items-center gap-12 text-center md:text-left">
            <div className="space-y-8">
              <div className="flex items-center justify-center md:justify-start gap-3">
                <div className="w-10 h-10 medical-gradient rounded-xl flex items-center justify-center text-white shadow-lg">
                  <Stethoscope size={20} />
                </div>
                <span className="font-bold text-2xl tracking-tighter text-slate-900">E-Clinic<span className="text-blue-600">.</span></span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed max-w-sm mx-auto md:mx-0">
                Pioneer digital healthcare di Indonesia. Menghubungkan teknologi dengan kemanusiaan.
              </p>
            </div>
            
            <div className="flex flex-col items-center md:items-end gap-4">
               <div className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-4">
                  <span>© 2026 E-Clinic OS</span>
                  <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                  <span className="text-slate-300">TRUSTED MEDICAL SYSTEM</span>
               </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

