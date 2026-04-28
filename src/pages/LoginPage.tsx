import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Stethoscope, Mail, Lock, Loader2, AlertCircle, Shield, Pill } from 'lucide-react';
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
      if (!supabaseClient) {
        throw new Error('Supabase client not initialized');
      }

      // Timeout for real supabase calls to prevent endless loading
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Koneksi lambat. Silakan periksa koneksi internet Anda.')), 6000)
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

  return (
    <div className="min-h-screen bg-medical-50 flex items-center justify-center p-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10 relative overflow-hidden"
      >
        {/* Background Accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-medical-50 rounded-full -mr-16 -mt-16 blur-2xl"></div>

        <div className="relative text-center mb-10">
          <div className="w-16 h-16 medical-gradient rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-xl shadow-medical-200">
            <Stethoscope size={32} />
          </div>
          <h2 className="text-3xl font-bold text-slate-900">Selamat Datang</h2>
          <p className="text-slate-500 mt-2">Masuk ke pusat manajemen E-Clinic Anda</p>
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
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Email Klinik</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-medical-500 transition-colors" size={20} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-medical-200 focus:bg-white transition-all text-slate-900"
                placeholder="admin@clinic.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-medical-500 transition-colors" size={20} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-medical-200 focus:bg-white transition-all text-slate-900"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-sm px-1">
            <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
              <input type="checkbox" className="rounded-md border-slate-300 text-medical-500 focus:ring-medical-500 w-4 h-4" />
              <span>Ingat Saya</span>
            </label>
            <a href="#" className="text-medical-600 font-bold hover:underline">Lupa Password?</a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 medical-gradient text-white rounded-2xl font-bold text-lg shadow-xl shadow-medical-100 hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={24} />
                <span>Memproses...</span>
              </>
            ) : (
              <span>Masuk Sekarang</span>
            )}
          </button>
        </form>

        <p className="text-center mt-10 text-slate-500 text-sm">
          Belum memiliki akun? <a href="#" className="text-medical-600 font-bold hover:underline">Hubungi IT Support</a>
        </p>
      </motion.div>
    </div>
  );
}
