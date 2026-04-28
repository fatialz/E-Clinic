export type UserRole = 'ADMIN' | 'DOCTOR' | 'PHARMACIST';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  created_at: string;
}

export interface Patient {
  id: string;
  name: string;
  birth_date: string;
  gender: 'MALE' | 'FEMALE';
  address: string;
  phone: string;
  created_at: string;
}

export interface Doctor {
  id: string;
  profile_id: string;
  specialization: string;
  phone: string;
  availability: string;
}

export interface Appointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  appointment_date: string;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
  queue_number?: number;
}

export interface MedicalRecord {
  id: string;
  appointment_id: string;
  patient_id: string;
  doctor_id: string;
  diagnosis: string;
  treatment: string;
  prescription: string;
  files?: string[];
  created_at: string;
}
