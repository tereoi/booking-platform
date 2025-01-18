// src/utils/businessSetup.ts
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import type { Business, BusinessSite } from '@/types/business';

const defaultSiteSettings: BusinessSite = {
  hero: {
    title: "Welkom bij",
    subtitle: "Plan direct een afspraak"
  },
  about: {
    title: "Over ons",
    content: "Vertel hier meer over je bedrijf..."
  },
  contact: {
    email: "",
    phone: "",
    address: ""
  },
  styling: {
    primaryColor: "#000000",
    secondaryColor: "#ffffff",
    fontFamily: "Inter"
  },
  booking: {
    title: "Maak een afspraak",
    description: "Kies een service en tijd die jou uitkomt",
    requiredFields: {
      name: true,
      email: true,
      phone: false,
      message: false
    },
    customFields: []
  },
  seo: {
    title: "",
    description: "",
    keywords: []
  }
};

const defaultWorkingHours = {
  monday: { isOpen: true, start: '09:00', end: '17:00' },
  tuesday: { isOpen: true, start: '09:00', end: '17:00' },
  wednesday: { isOpen: true, start: '09:00', end: '17:00' },
  thursday: { isOpen: true, start: '09:00', end: '17:00' },
  friday: { isOpen: true, start: '09:00', end: '17:00' },
  saturday: { isOpen: false, start: '09:00', end: '17:00' },
  sunday: { isOpen: false, start: '09:00', end: '17:00' }
};

const defaultNotificationSettings = {
  email: {
    enabled: true,
    newBooking: true,
    reminder: true,
    cancellation: true
  },
  sms: {
    enabled: false,
    newBooking: false,
    reminder: false,
    cancellation: false
  },
  push: {
    enabled: false,
    newBooking: false,
    reminder: false,
    cancellation: false
  }
};

export async function setupNewBusiness(userId: string, businessData: {
  name: string;
  email: string;
  customUrl: string;
}) {
  const newBusiness: Business = {
    id: userId,
    ownerId: userId,
    customUrl: businessData.customUrl,
    name: businessData.name,
    createdAt: new Date().toISOString(),
    status: 'active',
    subscription: {
      plan: 'basic',
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 dagen proefperiode
    },
    site: {
      ...defaultSiteSettings,
      hero: {
        ...defaultSiteSettings.hero,
        title: `Welkom bij ${businessData.name}`
      },
      contact: {
        ...defaultSiteSettings.contact,
        email: businessData.email
      },
      seo: {
        ...defaultSiteSettings.seo,
        title: businessData.name,
        description: `Maak direct een afspraak bij ${businessData.name}`
      }
    },
    settings: {
      workingHours: defaultWorkingHours,
      services: [],
      notifications: defaultNotificationSettings
    }
  };

  // Sla het nieuwe bedrijf op in Firestore
  await setDoc(doc(db, 'businesses', userId), newBusiness);

  return newBusiness;
}