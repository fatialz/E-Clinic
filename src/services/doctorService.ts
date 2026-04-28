
export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  schedule: string;
  room: string;
  phone: string;
  image?: string;
  status: 'Aktif' | 'Cuti' | 'Tidak Aktif';
}

const STORAGE_KEY = 'klinik_doctors';

const defaultDoctors: Doctor[] = [
  { 
    id: '1', 
    name: 'dr. Sarah Wijaya, Sp.PD', 
    specialization: 'Spesialis Penyakit Dalam', 
    schedule: 'Senin - Jumat', 
    room: 'Poli A1', 
    phone: '0812-1111-2222',
    image: 'https://images.unsplash.com/photo-1559839734-2b71f1e59816?auto=format&fit=crop&q=80&w=200&h=200',
    status: 'Aktif' 
  },
  { 
    id: '2', 
    name: 'dr. Ahmad Pratama, Sp.A', 
    specialization: 'Spesialis Anak', 
    schedule: 'Selasa - Sabtu', 
    room: 'Poli B2', 
    phone: '0812-3333-4444',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=200&h=200',
    status: 'Aktif' 
  },
  { 
    id: '3', 
    name: 'dr. Linda Kusuma, Sp.OG', 
    specialization: 'Spesialis Kandungan', 
    schedule: 'Senin - Kamis', 
    room: 'Poli C3', 
    phone: '0812-5555-6666',
    image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=200&h=200',
    status: 'Aktif' 
  }
];

export const doctorService = {
  getDoctors: (): Doctor[] => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultDoctors));
      return defaultDoctors;
    }
    return JSON.parse(saved);
  },

  addDoctor: (doctor: Omit<Doctor, 'id'>) => {
    const doctors = doctorService.getDoctors();
    const newDoctor: Doctor = {
      ...doctor,
      id: Math.random().toString(36).substr(2, 9)
    };
    const updated = [newDoctor, ...doctors];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return newDoctor;
  },

  updateDoctor: (id: string, updates: Partial<Omit<Doctor, 'id'>>) => {
    const doctors = doctorService.getDoctors();
    const updated = doctors.map(d => d.id === id ? { ...d, ...updates } : d);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  deleteDoctor: (id: string) => {
    const doctors = doctorService.getDoctors();
    const updated = doctors.filter(d => d.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }
};
