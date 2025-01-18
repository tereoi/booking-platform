// src/types/index.ts
export interface User {
  id: string;
  email: string;
  role: 'business' | 'superadmin';
  businessId?: string;
}

export interface Business {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  settings: BusinessSettings;
}

export interface BusinessSettings {
  theme: {
    primaryColor: string;
    secondaryColor: string;
    logo?: string;
  };
  workingHours: {
    [key: string]: {
      start: string;
      end: string;
      isOpen: boolean;
    };
  };
}

export interface Appointment {
  id: string;
  date: string;
  time: string;
  duration: number;  // Toegevoegd
  serviceId: string; // Toegevoegd
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}