
export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  lastVisit: string;
  status: 'Aktif' | 'Tidak Aktif';
}

const STORAGE_KEY = 'klinik_patients';

const defaultPatients: Patient[] = [
  { id: '1', name: 'Budi Santoso', age: 45, gender: 'Laki-laki', phone: '0812-3456-7890', lastVisit: '2023-10-15', status: 'Aktif' },
  { id: '2', name: 'Ani Wijaya', age: 32, gender: 'Perempuan', phone: '0812-9876-5432', lastVisit: '2023-10-20', status: 'Aktif' },
  { id: '3', name: 'Rahmat Hidayat', age: 28, gender: 'Laki-laki', phone: '0855-2233-1122', lastVisit: '2023-09-12', status: 'Tidak Aktif' },
  { id: '4', name: 'Siti Aminah', age: 50, gender: 'Perempuan', phone: '0877-6655-4433', lastVisit: '2023-10-25', status: 'Aktif' },
  { id: '5', name: 'Handoko Putra', age: 37, gender: 'Laki-laki', phone: '0813-1122-3344', lastVisit: '2023-10-22', status: 'Aktif' },
];

export const patientService = {
  getPatients: (): Patient[] => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultPatients));
      return defaultPatients;
    }
    return JSON.parse(saved);
  },

  addPatient: (patient: Omit<Patient, 'id' | 'lastVisit' | 'status'>) => {
    const patients = patientService.getPatients();
    const newPatient: Patient = {
      ...patient,
      id: Math.random().toString(36).substr(2, 9),
      lastVisit: new Date().toISOString().split('T')[0],
      status: 'Aktif'
    };
    const updated = [newPatient, ...patients];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return newPatient;
  },

  updatePatient: (id: string, updates: Partial<Omit<Patient, 'id' | 'lastVisit'>>) => {
    const patients = patientService.getPatients();
    const updated = patients.map(p => p.id === id ? { ...p, ...updates } : p);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  deletePatient: (id: string) => {
    const patients = patientService.getPatients();
    const updated = patients.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }
};
