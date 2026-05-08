import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  ClipboardList, 
  FileText, 
  Settings, 
  UserCircle,
  Stethoscope,
  Activity,
  History,
  Pill
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { cn } from '../../lib/utils';

export default function Sidebar() {
  const { profile } = useAuth();
  const role = profile?.role || 'PHARMACIST';

  const menuItems = [
    {
      label: 'Dashboard',
      path: '/app',
      icon: LayoutDashboard,
      roles: ['ADMIN', 'DOCTOR', 'PHARMACIST'],
    },
    {
      label: 'Doctor Dashboard',
      path: '/app/doctor-dashboard',
      icon: Stethoscope,
      roles: ['ADMIN', 'DOCTOR'],
    },
    {
      label: 'Data Pasien',
      path: '/app/patients',
      icon: Users,
      roles: ['ADMIN', 'PHARMACIST'],
    },
    {
      label: 'Data Dokter',
      path: '/app/doctors',
      icon: Stethoscope,
      roles: ['ADMIN'],
    },
    {
      label: 'Jadwal Praktek',
      path: '/app/schedule',
      icon: Calendar,
      roles: ['ADMIN', 'DOCTOR'],
    },
    {
      label: 'Pemeriksaan',
      path: '/app/medical-records',
      icon: Activity,
      roles: ['ADMIN', 'DOCTOR'],
    },
    {
      label: 'Rekam Medis',
      path: '/app/history',
      icon: History,
      roles: ['ADMIN', 'DOCTOR'],
    },
    {
      label: 'Farmasi & Obat',
      path: '/app/pharmacy',
      icon: Pill,
      roles: ['ADMIN', 'PHARMACIST'],
    },
    {
      label: 'Laporan',
      path: '/app/reports',
      icon: FileText,
      roles: ['ADMIN', 'DOCTOR'],
    },
    {
      label: 'User Management',
      path: '/app/users',
      icon: Settings,
      roles: ['ADMIN'],
    },
  ];

  const filteredMenu = menuItems.filter((item) => item.roles.includes(role));

  return (
    <aside className="w-64 bg-blue-900 shadow-xl flex flex-col h-full text-white">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-blue-900 shadow-lg">
          <Stethoscope size={24} />
        </div>
        <span className="font-bold text-xl tracking-tight text-white uppercase italic">
          E-Clinic
        </span>
      </div>

      <nav className="flex-1 px-4 space-y-1 mt-4">
        {filteredMenu.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/app'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group text-sm font-medium',
                isActive
                  ? 'bg-blue-800 text-white shadow-inner'
                  : 'text-blue-100/70 hover:bg-white/10 hover:text-white'
              )
            }
          >
            <item.icon size={18} className={cn("transition-transform group-hover:scale-110", "opacity-80")} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-blue-800">
        <div className="bg-blue-800/50 rounded-xl p-4 flex items-center gap-3 border border-white/5">
          <div className="w-9 h-9 rounded-full bg-blue-500 border border-blue-400 flex items-center justify-center text-white shrink-0">
            <UserCircle size={22} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-white truncate">
              {profile?.full_name || 'Guest'}
            </p>
            <p className="text-[10px] text-blue-300 uppercase tracking-widest font-black">{role}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
