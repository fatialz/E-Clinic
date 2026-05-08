
export interface Appointment {
  id: string;
  patient: string;
  time: string;
  type: string;
  doctor: string;
  date: string; // YYYY-MM-DD
  status: 'Menunggu' | 'Diperiksa' | 'Selesai' | 'Batal';
  reason?: string;
  age?: number;
}

const STORAGE_KEY = 'klinik_appointments';

const defaultAppointments: Appointment[] = [
  { id: '1', patient: 'Budi Santoso', time: '09:00', type: 'General Checkup', doctor: 'dr. Sarah', date: new Date().toISOString().split('T')[0], status: 'Menunggu', reason: 'Kontrol Pasca Operasi', age: 45 },
  { id: '2', patient: 'Ani Wijaya', time: '10:30', type: 'Konsultasi Spesialis', doctor: 'dr. Sarah', date: new Date().toISOString().split('T')[0], status: 'Selesai', reason: 'Flu dan Demam', age: 32 },
  { id: '3', patient: 'Siti Aminah', time: '14:00', type: 'Follow up', doctor: 'dr. Sarah', date: new Date().toISOString().split('T')[0], status: 'Diperiksa', reason: 'Sakit Kepala Kronis', age: 50 },
];

export const appointmentService = {
  getAppointments: (): Appointment[] => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultAppointments));
      return defaultAppointments;
    }
    return JSON.parse(stored);
  },

  saveAppointment: (appointment: Appointment) => {
    const appointments = appointmentService.getAppointments();
    const index = appointments.findIndex(a => a.id === appointment.id);
    if (index >= 0) {
      appointments[index] = appointment;
    } else {
      appointments.push(appointment);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
  },

  deleteAppointment: (id: string) => {
    const appointments = appointmentService.getAppointments().filter(a => a.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
  },

  getAppointmentsByDate: (date: string): Appointment[] => {
    return appointmentService.getAppointments().filter(a => a.date === date);
  }
};
