import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { Stethoscope, Mail, Lock, Loader2, AlertCircle, Shield, Pill, ArrowRight, Activity, CheckCircle2 } from 'lucide-react';
import { supabase, getSupabase } from '../lib/supabase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabaseClient = getSupabase();

    try {
      // QUICK PATH for demo/dev
      const lowerEmail = email.toLowerCase();
      const isDemoEmail = lowerEmail.includes('admin') || 
                         lowerEmail.includes('doctor') || 
                         lowerEmail.includes('dokter') || 
                         lowerEmail.includes('apoteker') ||
                         lowerEmail.includes('pharma');

      if (!supabaseClient || isDemoEmail) {
        localStorage.setItem('demo_email', email);
        console.log('Using demo login path for:', email);
        window.location.href = '/app';
        return;
      }

      // Timeout for real supabase calls to prevent endless loading
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Koneksi lambat. Silakan gunakan akses Demo (Admin/Dokter/Apoteker)')), 6000)
      );

      const loginResult = await Promise.race([
        supabaseClient.auth.signInWithPassword({ email, password }),
        timeoutPromise
      ]) as any;

      if (loginResult.error) throw loginResult.error;
      
      navigate('/app');
    } catch (err: any) {
      setError(err.message || 'Gagal masuk. Periksa kembali email dan password.');
    } finally {
      setLoading(false);
    }
  };

  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [supportForm, setSupportForm] = useState({
    clinicName: '',
    contactName: '',
    email: '',
    phone: '',
    message: ''
  });
  const [supportLoading, setSupportLoading] = useState(false);
  const [supportSuccess, setSupportSuccess] = useState(false);

  const handleSupportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSupportLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setSupportLoading(false);
    setSupportSuccess(true);
  };

  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 100, damping: 30 });
  const mouseY = useSpring(y, { stiffness: 100, damping: 30 });

  const rotateX = useTransform(mouseY, [0, 600], [10, -10]);
  const rotateY = useTransform(mouseX, [0, 800], [-10, 10]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);
  };

  const handleMouseLeave = () => {
    x.set(400);
    y.set(300);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-6 overflow-hidden bg-white selection:bg-blue-100 selection:text-blue-900 group/login">
      {/* High-End Professional Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Interactive Focus Light - Refined for higher precision */}
        <div className="absolute inset-0 z-10 opacity-20 mix-blend-soft-light pointer-events-none bg-[radial-gradient(circle_at_var(--mouse-x,50%)_var(--mouse-y,50%),rgba(37,99,235,0.4)_0%,transparent_40%)] transition-opacity duration-300 group-hover/login:opacity-100" />
        
        {/* Static noise for texture depth */}
        <div className="absolute inset-0 z-20 pointer-events-none opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        
        {/* Deep Field Aurora Orbs */}
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 80, 0],
            rotate: [0, 45, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] -left-[10%] w-[100%] h-[100%] rounded-full bg-blue-50/50 blur-[160px]"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            x: [0, -80, 0],
            rotate: [0, -45, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear", delay: 5 }}
          className="absolute -bottom-[20%] -right-[10%] w-[90%] h-[90%] rounded-full bg-indigo-50/40 blur-[160px]"
        />

        {/* Engineering Grid - More subtle */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000003_1px,transparent_1px),linear-gradient(to_bottom,#00000003_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_100%,transparent_0%)]"></div>
      </div>

      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          perspective: 1000
        }}
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1.2, type: "spring", bounce: 0 }}
        className="max-w-md w-full bg-white/80 backdrop-blur-3xl rounded-[3rem] border border-white p-10 relative z-30 shadow-[0_32px_80px_-16px_rgba(0,0,0,0.1)] cursor-default"
      >
        <div className="relative text-center mb-10">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 12 }}
            className="w-14 h-14 medical-gradient rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-[0_12px_24px_-8px_rgba(37,99,235,0.4)]"
          >
            <Stethoscope size={28} />
          </motion.div>
          <div className="overflow-hidden">
            <motion.h2 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-black text-slate-900 tracking-tighter leading-none mb-3"
            >
              SELAMAT DATANG
            </motion.h2>
          </div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] opacity-60"
          >
            Management Core Environment v1.0
          </motion.p>
        </div>


        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 p-4 bg-red-50 text-red-600 rounded-2xl flex items-start gap-3 border border-red-100"
          >
            <AlertCircle className="shrink-0" size={20} />
            <p className="text-sm font-medium">{error}</p>
          </motion.div>
        )}


        <form onSubmit={handleLogin} className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-2"
          >
            <div className="flex items-center justify-between">
              <label className="text-sm font-black text-slate-700 ml-1 uppercase tracking-widest opacity-60">Email Klinik</label>
              <div className="h-px flex-1 bg-slate-100 mx-4 opacity-50"></div>
            </div>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-all duration-500 group-focus-within:scale-110" size={20} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50/30 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all text-slate-900 font-medium"
                placeholder="admin@clinic.com"
              />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-2"
          >
            <div className="flex items-center justify-between">
              <label className="text-sm font-black text-slate-700 ml-1 uppercase tracking-widest opacity-60">Password</label>
              <div className="h-px flex-1 bg-slate-100 mx-4 opacity-50"></div>
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-all duration-500 group-focus-within:scale-110" size={20} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50/30 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all text-slate-900 font-medium"
                placeholder="••••••••"
              />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-between text-[10px] px-1 font-black uppercase tracking-widest"
          >
            <label className="flex items-center gap-2 text-slate-500 cursor-pointer">
              <input type="checkbox" className="rounded-md border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4" />
              <span>Ingat Saya</span>
            </label>
            <a href="#" className="text-blue-600 hover:underline">Lupa Password?</a>
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-[0_20px_40px_-12px_rgba(37,99,235,0.3)] hover:bg-blue-700 hover:shadow-[0_24px_48px_-12px_rgba(37,99,235,0.4)] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>Memproses...</span>
              </>
            ) : (
              <>
                <span>Masuk Sekarang</span>
                <ArrowRight size={18} />
              </>
            )}
          </motion.button>
        </form>

        <p className="text-center mt-10 text-slate-500 text-[10px] font-black uppercase tracking-widest opacity-60">
          Belum memiliki akun? <button onClick={() => setIsSupportModalOpen(true)} className="text-blue-600 hover:underline font-black">Hubungi IT Support</button>
        </p>
      </motion.div>

      {/* IT Support Modal */}
      {isSupportModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="max-w-lg w-full bg-white rounded-3xl p-10 overflow-hidden relative"
          >
            {supportSuccess ? (
              <div className="text-center py-10">
                <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={40} />
                </div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase mb-4">Request Terkirim!</h3>
                <p className="text-slate-500 font-medium mb-8">Permintaan Anda telah kami terima. Tim IT kami akan menghubungi Anda melalui email dalam 1x24 jam.</p>
                <button 
                  onClick={() => {
                    setIsSupportModalOpen(false);
                    setSupportSuccess(false);
                  }}
                  className="px-8 py-3 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest"
                >
                   Kembali ke Login
                </button>
              </div>
            ) : (
              <>
                <div className="mb-8">
                  <h3 className="text-2xl font-black text-slate-900 tracking-tighter mb-2 uppercase">Request Akses Klinik</h3>
                  <p className="text-sm text-slate-500 font-medium">Lengkapi data di bawah ini untuk didaftarkan oleh tim IT kami.</p>
                </div>

                <form onSubmit={handleSupportSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nama Klinik</label>
                      <input 
                        required
                        type="text"
                        placeholder="E-Clinic Utama"
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-200 transition-all"
                        value={supportForm.clinicName}
                        onChange={e => setSupportForm({...supportForm, clinicName: e.target.value})}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nama Kontak</label>
                      <input 
                        required
                        type="text"
                        placeholder="Dr. Andi"
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-200 transition-all"
                        value={supportForm.contactName}
                        onChange={e => setSupportForm({...supportForm, contactName: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Bisnis</label>
                    <input 
                      required
                      type="email"
                      placeholder="andi@clinic.com"
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-200 transition-all"
                      value={supportForm.email}
                      onChange={e => setSupportForm({...supportForm, email: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nomor Telepon</label>
                    <input 
                      required
                      type="tel"
                      placeholder="0812XXXXXXXX"
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-200 transition-all"
                      value={supportForm.phone}
                      onChange={e => setSupportForm({...supportForm, phone: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Catatan Tambahan</label>
                    <textarea 
                      placeholder="Mohon daftarkan akun admin untuk klinik kami..."
                      rows={3}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-200 transition-all resize-none"
                      value={supportForm.message}
                      onChange={e => setSupportForm({...supportForm, message: e.target.value})}
                    />
                  </div>

                  <div className="pt-4 flex gap-3">
                    <button 
                      type="button"
                      onClick={() => setIsSupportModalOpen(false)}
                      className="flex-1 py-3 border border-slate-100 text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all"
                    >
                      Batal
                    </button>
                    <button 
                      type="submit"
                      disabled={supportLoading}
                      className="flex-[2] py-3 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-100 hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {supportLoading ? <Loader2 className="animate-spin" size={16} /> : 'Kirim Permintaan'}
                    </button>
                  </div>
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}
