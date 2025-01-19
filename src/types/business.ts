// src/types/business.ts
export interface BusinessSite {
  hero: {
    enabled: boolean;
    title: string;
    subtitle: string;
    backgroundImage?: string;
    showBookingButton: boolean;
    bookingButtonText: string;
  };
  about: {
    enabled: boolean;
    title: string;
    content: string;
    image?: string;
  };
  services: {
    enabled: boolean;
    title: string;
    description: string;
    showPricing: boolean;
    showDuration: boolean;
  };
  contact: {
    enabled: boolean;
    title: string;
    email: string;
    phone: string;
    address: string;
    showEmail: boolean;
    showPhone: boolean;
    showAddress: boolean;
    showMap: boolean;
    googleMapsUrl?: string;
  };
  styling: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    backgroundColor: string;
    fontFamily: string;
    logo?: string;
    favicon?: string;
    headingFont: string;
    bodyFont: string;
    fontSize: 'small' | 'medium' | 'large';
    buttonStyle: 'rounded' | 'pill' | 'square';
    buttonAnimation: boolean;
    maxWidth: 'narrow' | 'medium' | 'wide';
    spacing: 'compact' | 'comfortable' | 'spacious';
    enableAnimations: boolean;
    glassmorphism: boolean;
    customCss?: string;
  };
  booking: {
    title: string;
    description: string;
    requiredFields: {
      name: boolean;
      email: boolean;
      phone: boolean;
      message: boolean;
    };
    customFields: Array<{
      id: string;
      label: string;
      type: 'text' | 'select' | 'checkbox';
      required: boolean;
      options?: string[];
    }>;
    confirmationEmail: {
      enabled: boolean;
      subject: string;
      template: string;
    };
    reminders: {
      enabled: boolean;
      timing: number; // uren voor afspraak
      template: string;
    };
  };
  seo: {
    title: string;
    description: string;
    keywords: string[];
    ogImage?: string;
    social: {
      facebook?: string;
      instagram?: string;
      linkedin?: string;
    };
  };
}

export interface Business {
  id: string;
  ownerId: string;
  customUrl: string;
  name: string;
  createdAt: string;
  status: 'active' | 'inactive' | 'suspended';
  subscription: {
    plan: 'basic' | 'premium';
    validUntil: string;
  };
  site: BusinessSite;
  settings: {
    workingHours: WorkingHours;
    services: Service[];
    notifications: NotificationSettings;
  };
}

interface WorkingHours {
  [key: string]: {
    isOpen: boolean;
    start: string;
    end: string;
  };
}

interface Service {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  maxBookings?: number;
}

interface NotificationSettings {
  email: NotificationChannel;
  sms: NotificationChannel;
  push: NotificationChannel;
}

interface NotificationChannel {
  enabled: boolean;
  newBooking: boolean;
  reminder: boolean;
  cancellation: boolean;
}

// Type voor de website editor componenten
export interface SiteData {
  customUrl: string;
  site: BusinessSite;
}