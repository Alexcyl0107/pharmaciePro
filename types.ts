export enum MedicineForm {
  TABLET = 'Comprimé',
  SYRUP = 'Sirop',
  INJECTION = 'Injection',
  CREAM = 'Crème',
  CAPSULE = 'Gélule',
  DROP = 'Gouttes'
}

export interface Medicine {
  id: string;
  name: string;
  description: string;
  dosage: string;
  category: string;
  form: MedicineForm;
  purchasePrice: number;
  salePrice: number;
  stock: number;
  minStock: number;
  expiryDate: string; // ISO Date string
  supplierId: string;
}

export interface CartItem extends Medicine {
  quantity: number;
}

export interface Sale {
  id: string;
  date: string; // ISO Date
  items: CartItem[];
  total: number;
  tax: number;
  discount: number;
  paymentMethod: 'CASH' | 'CARD' | 'MOBILE_MONEY';
  cashierId: string;
}

export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  sex: 'M' | 'F';
  birthDate: string; // ISO Date
  phone: string;
  height: number; // cm
  weight: number; // kg
  bloodGroup?: BloodGroup;
  chronicConditions: string[]; // ex: Diabète, Hypertension
  allergies: string[];
  notes: string;
  history: string[]; // Sale IDs
}

export enum PrescriptionStatus {
  PENDING = 'En attente',
  PREPARING = 'En préparation',
  READY = 'Prête',
  COMPLETED = 'Retirée'
}

export interface Prescription {
  id: string;
  patientName: string;
  doctorName: string;
  date: string;
  medications: string[]; // List of med names or IDs
  status: PrescriptionStatus;
  image?: string; // Base64 or URL
}

export interface Supplier {
  id: string;
  name: string;
  type: 'Grossiste' | 'Laboratoire';
  contact: string;
  email: string;
  address: string;
  location: {
    lat: number;
    lng: number;
  };
  nextDelivery?: string; // ISO Date
}

export interface ReportData {
  name: string;
  value: number;
}

export interface PharmacySettings {
  name: string;
  address: string;
  phone: string;
  email: string;
  nif: string; // Numéro d'Identification Fiscale
  dailyRevenueTarget: number;
  taxRate: number; // Percentage (e.g., 18 for 18%)
  currency: string;
}