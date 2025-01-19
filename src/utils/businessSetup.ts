// src/utils/businessSetup.ts
import { db } from '@/lib/firebase';
import { doc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import type { Business, BusinessSite } from '@/types/business';
import { generateSlug } from '@/utils/stringUtils';

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

const defaultSiteSettings: BusinessSite = {
  hero: {
    enabled: true,
    title: "Welkom bij",
    subtitle: "Plan direct een afspraak",
    showBookingButton: true,
    bookingButtonText: "Boek nu"
  },
  about: {
    enabled: false,
    title: "Over ons",
    content: "Vertel hier meer over je bedrijf..."
  },
  contact: {
    enabled: true,
    title: "Contact",
    email: "",
    phone: "",
    address: "",
    showEmail: true,
    showPhone: true,
    showAddress: false,
    showMap: false
  },
  services: {
    enabled: true,
    title: "Onze Services",
    description: "Bekijk onze beschikbare services",
    showPricing: true,
    showDuration: true
  },
  styling: {
    primaryColor: "#000000",
    secondaryColor: "#ffffff",
    accentColor: "#3B82F6",
    backgroundColor: "#FFFFFF",
    fontFamily: "Inter",
    headingFont: "Inter",
    bodyFont: "Inter",
    logo: undefined,
    favicon: undefined,
    fontSize: 'medium',
    buttonStyle: 'rounded',
    buttonAnimation: true,
    maxWidth: 'medium',
    spacing: 'comfortable',
    enableAnimations: true,
    glassmorphism: false,
    customCss: ''
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
    customFields: [],
    confirmationEmail: {
      enabled: true,
      subject: "Bevestiging van uw afspraak",
      template: ""
    },
    reminders: {
      enabled: false,
      timing: 24,
      template: ""
    }
  },
  seo: {
    title: "",
    description: "",
    keywords: [],
    social: {
      facebook: "",
      instagram: "",
      linkedin: ""
    }
  }
};

// Nieuwe functie om unieke URL te genereren
async function generateUniqueCustomUrl(baseName: string): Promise<string> {
  let customUrl = generateSlug(baseName);
  let counter = 1;
  let uniqueUrl = customUrl;

  while (await checkCustomUrlAvailability(uniqueUrl)) {
    uniqueUrl = `${customUrl}-${counter}`;
    counter++;
  }

  return uniqueUrl;
}

async function checkCustomUrlAvailability(customUrl: string): Promise<boolean> {
  const q = query(collection(db, 'businesses'), where('customUrl', '==', customUrl));
  const querySnapshot = await getDocs(q);
  return querySnapshot.empty;
}

export async function setupNewBusiness(userId: string, businessData: {
  name: string;
  email: string;
}) {
  // Genereer een unieke URL op basis van de bedrijfsnaam
  const customUrl = await generateUniqueCustomUrl(businessData.name);

  const newBusiness: Business = {
    id: userId,
    ownerId: userId,
    customUrl: customUrl,
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