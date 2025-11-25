import { Medicine, MedicineForm, Client, Supplier, Prescription, PrescriptionStatus, Sale, PharmacySettings } from './types';

export const INITIAL_SETTINGS: PharmacySettings = {
  name: "Pharmacie de l'Espoir",
  address: "Bd du 13 Janvier, Lomé, Togo",
  phone: "+228 22 21 00 00",
  email: "contact@pharma-espoir.tg",
  nif: "1000567890",
  dailyRevenueTarget: 150000,
  taxRate: 0,
  currency: "FCFA"
};

export const INITIAL_MEDICINES: Medicine[] = [
  {
    id: '1',
    name: 'Paracétamol',
    description: 'Antalgique et antipyrétique',
    dosage: '500mg',
    category: 'Douleur',
    form: MedicineForm.TABLET,
    purchasePrice: 125,
    salePrice: 200,
    stock: 320,
    minStock: 50,
    expiryDate: '2025-12-31',
    supplierId: 'sup1'
  },
  {
    id: '2',
    name: 'Amoxicilline',
    description: 'Antibiotique à large spectre',
    dosage: '500mg',
    category: 'Antibiotique',
    form: MedicineForm.TABLET,
    purchasePrice: 900,
    salePrice: 1500,
    stock: 45,
    minStock: 50,
    expiryDate: '2024-08-15',
    supplierId: 'sup1'
  },
  {
    id: '3',
    name: 'Coartem 80/480',
    description: 'Antipaludéen (Artéméther/Luméfantrine)',
    dosage: '6 comp',
    category: 'Paludisme',
    form: MedicineForm.TABLET,
    purchasePrice: 2500,
    salePrice: 3500,
    stock: 120,
    minStock: 40,
    expiryDate: '2026-01-20',
    supplierId: 'sup2'
  },
  {
    id: '4',
    name: 'Vitamine C',
    description: 'Complément alimentaire et fatigue',
    dosage: '1000mg',
    category: 'Vitamines',
    form: MedicineForm.TABLET,
    purchasePrice: 1000,
    salePrice: 1800,
    stock: 15,
    minStock: 20,
    expiryDate: '2025-05-10',
    supplierId: 'sup2'
  },
  {
    id: '5',
    name: 'Bronchokod',
    description: 'Sirop pour toux grasse',
    dosage: '150ml',
    category: 'Respiratoire',
    form: MedicineForm.SYRUP,
    purchasePrice: 1800,
    salePrice: 2900,
    stock: 8,
    minStock: 10,
    expiryDate: '2024-11-01',
    supplierId: 'sup1'
  },
  {
    id: '6',
    name: 'Efferalgan',
    description: 'Paracétamol effervescent',
    dosage: '1g',
    category: 'Douleur',
    form: MedicineForm.TABLET,
    purchasePrice: 1100,
    salePrice: 1700,
    stock: 60,
    minStock: 20,
    expiryDate: '2025-09-01',
    supplierId: 'sup1'
  }
];

export const INITIAL_CLIENTS: Client[] = [
  { 
    id: 'c1', 
    firstName: 'Kossi', 
    lastName: 'Mensah', 
    sex: 'M',
    birthDate: '1979-05-12',
    phone: '+228 90 12 34 56', 
    height: 175,
    weight: 82,
    bloodGroup: 'O+',
    chronicConditions: ['Hypertension'],
    allergies: ['Pénicilline'],
    notes: 'Patient régulier, vérifier tension.',
    history: [] 
  },
  { 
    id: 'c2', 
    firstName: 'Afi', 
    lastName: 'Akakpo', 
    sex: 'F',
    birthDate: '1992-11-23',
    phone: '+228 91 88 77 66', 
    height: 162,
    weight: 65,
    bloodGroup: 'A+',
    chronicConditions: [],
    allergies: [],
    notes: '',
    history: [] 
  },
  { 
    id: 'c3', 
    firstName: 'Kodjo', 
    lastName: 'Lawson', 
    sex: 'M',
    birthDate: '1965-02-10',
    phone: '+228 70 45 12 23', 
    height: 180,
    weight: 90,
    bloodGroup: 'B-',
    chronicConditions: ['Diabète Type 2'],
    allergies: [],
    notes: 'Suit un traitement insuline.',
    history: [] 
  },
];

export const INITIAL_SUPPLIERS: Supplier[] = [
  { 
    id: 'sup1', 
    name: 'CAMEG Togo', 
    type: 'Grossiste',
    contact: '22 21 00 00', 
    email: 'contact@cameg.tg',
    address: 'Tokoin, Lomé',
    location: { lat: 30, lng: 20 }, // Relative position for demo map
    nextDelivery: '2024-05-25T10:00:00'
  },
  { 
    id: 'sup2', 
    name: 'Laborex Togo', 
    type: 'Grossiste',
    contact: '22 21 44 55', 
    email: 'sales@laborex.tg',
    address: 'Zone Industrielle, Lomé',
    location: { lat: 70, lng: 80 }, // Relative position for demo map
    nextDelivery: '2024-05-24T14:30:00'
  },
];

export const INITIAL_PRESCRIPTIONS: Prescription[] = [
  {
    id: 'p1',
    patientName: 'Kossi Mensah',
    doctorName: 'Dr. Gbeassor',
    date: '2024-05-20',
    medications: ['Amoxicilline', 'Paracétamol'],
    status: PrescriptionStatus.PENDING
  },
  {
    id: 'p2',
    patientName: 'Sophie Gnassingbé',
    doctorName: 'Dr. Almeida',
    date: '2024-05-21',
    medications: ['Coartem 80/480'],
    status: PrescriptionStatus.READY
  }
];

export const MOCK_SALES_HISTORY: Sale[] = [
  {
    id: 's1',
    date: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
    items: [],
    total: 12500,
    tax: 0, 
    discount: 0,
    paymentMethod: 'CASH',
    cashierId: 'user1'
  },
  {
    id: 's2',
    date: new Date().toISOString(),
    items: [],
    total: 4500,
    tax: 0,
    discount: 0,
    paymentMethod: 'MOBILE_MONEY',
    cashierId: 'user1'
  }
];