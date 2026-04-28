
export interface MedicalRecord {
  id: string;
  patient: string;
  date: string;
  diagnosis: string;
  doctor: string;
  status: string;
  details: {
    s: string;
    o: string;
    a: string;
    p: string;
    lab: string;
    prescription: string;
  };
}

const STORAGE_KEY = 'klinik_medical_records';

const defaultRecords: MedicalRecord[] = [
  { 
    id: '1', 
    patient: 'Budi Santoso', 
    date: '20 Nov 2023', 
    diagnosis: 'Influenza (J11)', 
    doctor: 'dr. Sarah', 
    status: 'Final',
    details: {
      s: 'Demam, Batuk, Pilek selama 3 hari. Nyeri tenggorokan dan badan terasa linu.',
      o: 'TD: 120/80, Suhu: 38.5, Respirasi: 20x/mnt. Ronki (-), Wheezing (-).',
      a: 'Influenza (J11) dengan gejala sistemik.',
      p: 'Istirahat total, minum banyak cairan, vitamin C.',
      lab: 'Saran periksa darah lengkap jika demam berlanjut > 5 hari.',
      prescription: 'Paracetamol 500mg 3x1 (k/p demam), Vitamin C 1000mg 1x1.'
    }
  },
  { 
    id: '2', 
    patient: 'Ani Wijaya', 
    date: '19 Nov 2023', 
    diagnosis: 'Hipertensi (I10)', 
    doctor: 'dr. Sarah', 
    status: 'Final',
    details: {
      s: 'Sakit kepala bagian belakang, tengkuk terasa berat.',
      o: 'TD: 155/95, Nadi: 88x/mnt. Jantung: S1-S2 murni reguler.',
      a: 'Hipertensi Essential Grade II.',
      p: 'Diet rendah garam, olahraga ringan rutin.',
      lab: 'Profil Lipid: Kolesterol Total 240 mg/dL, LDL 160 mg/dL.',
      prescription: 'Amlodipine 5mg 1x1 (malam), Simvastatin 20mg 1x1 (malam).'
    }
  }
];

export const recordService = {
  getRecords: (): MedicalRecord[] => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultRecords));
      return defaultRecords;
    }
    return JSON.parse(stored);
  },

  saveRecord: (record: MedicalRecord) => {
    const records = recordService.getRecords();
    const index = records.findIndex(r => r.id === record.id);
    if (index >= 0) {
      records[index] = record;
    } else {
      records.unshift(record);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  },

  deleteRecord: (id: string, callback?: () => void) => {
    const records = recordService.getRecords().filter(r => r.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    if (callback) callback();
  }
};
