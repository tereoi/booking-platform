// src/types/business.ts
export interface BusinessSite {
    hero: {
      title: string;
      subtitle: string;
      backgroundImage?: string;
    };
    about: {
      title: string;
      content: string;
      image?: string;
    };
    contact: {
      email: string;
      phone: string;
      address: string;
      googleMapsUrl?: string;
    };
    styling: {
      primaryColor: string;
      secondaryColor: string;
      fontFamily: string;
      logo?: string;
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
        options?: string[]; // Voor select fields
      }>;
    };
    seo: {
      title: string;
      description: string;
      keywords: string[];
      ogImage?: string;
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
  
  // Bestaande interfaces
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