
export interface Medicine {
  id: string;
  name: string;
  category: string;
  stock: number;
  unit: string;
  price: number;
  expiryDate: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

export interface Prescription {
  id: string;
  patientName: string;
  doctorName: string;
  medicines: string;
  date: string;
  status: 'Pending' | 'Prepared' | 'Completed';
}

const STORAGE_KEY = 'klinik_pharmacy';
const RX_STORAGE_KEY = 'klinik_prescriptions';

const defaultMedicines: Medicine[] = [
  { id: '1', name: 'Paracetamol 500mg', category: 'Obat Bebas', stock: 150, unit: 'Tablet', price: 5000, expiryDate: '2025-12-30', status: 'In Stock' },
  { id: '2', name: 'Amoxicillin 250mg', category: 'Antibiotik', stock: 12, unit: 'Kapsul', price: 15000, expiryDate: '2024-08-15', status: 'Low Stock' },
  { id: '3', name: 'Cetirizine 10mg', category: 'Antihistamin', stock: 0, unit: 'Tablet', price: 8000, expiryDate: '2024-11-20', status: 'Out of Stock' },
  { id: '4', name: 'Ibuprofen 400mg', category: 'Antipiretik', stock: 85, unit: 'Tablet', price: 12000, expiryDate: '2025-05-10', status: 'In Stock' },
  { id: '5', name: 'Vitamin C 1000mg', category: 'Suplemen', stock: 200, unit: 'Botol', price: 45000, expiryDate: '2026-01-05', status: 'In Stock' },
];

const defaultPrescriptions: Prescription[] = [
  { id: 'RX-001', patientName: 'Budi Santoso', doctorName: 'dr. Sarah Johnson', medicines: 'Paracetamol 500mg (10), Vitamin C (1)', date: '2024-04-28 09:15', status: 'Pending' },
  { id: 'RX-002', patientName: 'Ani Wijaya', doctorName: 'dr. Ahmad Fauzi', medicines: 'Amoxicillin 250mg (15)', date: '2024-04-28 10:30', status: 'Prepared' },
  { id: 'RX-003', patientName: 'Siti Rahma', doctorName: 'dr. Sarah Johnson', medicines: 'Ibuprofen 400mg (20)', date: '2024-04-27 15:45', status: 'Completed' },
];

export const pharmacyService = {
  getMedicines: (): Medicine[] => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultMedicines));
      return defaultMedicines;
    }
    const data: Medicine[] = JSON.parse(saved);
    // Auto update status based on stock
    return data.map(m => {
      let status: Medicine['status'] = 'In Stock';
      if (m.stock <= 0) status = 'Out of Stock';
      else if (m.stock < 20) status = 'Low Stock';
      return { ...m, status };
    });
  },

  updateStock: (id: string, newStock: number) => {
    const medicines = pharmacyService.getMedicines();
    const updated = medicines.map(m => {
      if (m.id === id) {
        const finalStock = Math.max(0, newStock);
        let status: Medicine['status'] = 'In Stock';
        if (finalStock <= 0) status = 'Out of Stock';
        else if (finalStock < 20) status = 'Low Stock';
        return { ...m, stock: finalStock, status };
      }
      return m;
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },

  addMedicine: (medicine: Omit<Medicine, 'id' | 'status'>) => {
    const medicines = pharmacyService.getMedicines();
    const status: Medicine['status'] = medicine.stock <= 0 ? 'Out of Stock' : (medicine.stock < 20 ? 'Low Stock' : 'In Stock');
    const newMed: Medicine = {
      ...medicine,
      id: Math.random().toString(36).substr(2, 9),
      status
    };
    const updated = [newMed, ...medicines];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },

  deleteMedicine: (id: string) => {
    const medicines = pharmacyService.getMedicines();
    const updated = medicines.filter(m => m.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },

  getPrescriptions: (): Prescription[] => {
    const saved = localStorage.getItem(RX_STORAGE_KEY);
    if (!saved) {
      localStorage.setItem(RX_STORAGE_KEY, JSON.stringify(defaultPrescriptions));
      return defaultPrescriptions;
    }
    return JSON.parse(saved);
  },

  updatePrescriptionStatus: (id: string, status: Prescription['status']) => {
    const rxs = pharmacyService.getPrescriptions();
    const updated = rxs.map(rx => rx.id === id ? { ...rx, status } : rx);
    localStorage.setItem(RX_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },

  addPrescription: (rx: Omit<Prescription, 'id' | 'date' | 'status'>) => {
    const rxs = pharmacyService.getPrescriptions();
    const newRx: Prescription = {
      ...rx,
      id: `RX-${Math.floor(100 + Math.random() * 900)}`,
      date: new Date().toLocaleString('id-ID', { hour12: false }).replace(/\//g, '-'),
      status: 'Pending'
    };
    const updated = [newRx, ...rxs];
    localStorage.setItem(RX_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },

  updatePrescription: (id: string, rx: Partial<Prescription>) => {
    const rxs = pharmacyService.getPrescriptions();
    const updated = rxs.map(p => p.id === id ? { ...p, ...rx } : p);
    localStorage.setItem(RX_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },

  deletePrescription: (id: string) => {
    const rxs = pharmacyService.getPrescriptions();
    const updated = rxs.filter(p => p.id !== id);
    localStorage.setItem(RX_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  }
};
