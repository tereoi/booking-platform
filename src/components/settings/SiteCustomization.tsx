// src/components/settings/SiteCustomization.tsx
import { useState, useEffect } from 'react';
import { auth, db, storage } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { toast } from 'react-hot-toast';
import { Tab } from '@headlessui/react';
import { motion } from 'framer-motion';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

interface CustomField {
  id: string;
  label: string;
  type: 'text' | 'select' | 'checkbox' | 'textarea';
  required: boolean;
  options?: string[];
  placeholder?: string;
}

interface SiteData {
  customUrl: string;
  site: {
    // Hero sectie
    hero: {
      title: string;
      subtitle: string;
      backgroundImage?: string;
      showBookingButton: boolean;
      bookingButtonText: string;
    };
    // Over ons sectie
    about: {
      enabled: boolean;
      title: string;
      content: string;
      image?: string;
    };
    // Services sectie
    services: {
      enabled: boolean;
      title: string;
      description: string;
      showPricing: boolean;
      showDuration: boolean;
    };
    // Contact sectie
    contact: {
      enabled: boolean;
      title: string;
      showEmail: boolean;
      showPhone: boolean;
      showAddress: boolean;
      showMap: boolean;
      googleMapsUrl?: string;
    };
    // Booking formulier
    booking: {
      title: string;
      description: string;
      // Standaard velden
      requiredFields: {
        name: boolean;
        email: boolean;
        phone: boolean;
        message: boolean;
      };
      // Custom velden
      customFields: CustomField[];
      // Bevestigingsmail
      confirmationEmail: {
        enabled: boolean;
        subject: string;
        template: string;
      };
      // Herinneringen
      reminders: {
        enabled: boolean;
        timing: number; // uren voor afspraak
        template: string;
      };
    };
    // Styling
    styling: {
      // Algemeen
      primaryColor: string;
      secondaryColor: string;
      accentColor: string;
      backgroundColor: string;
      fontFamily: string;
      logo?: string;
      favicon?: string;
      // Typography
      headingFont: string;
      bodyFont: string;
      fontSize: 'small' | 'medium' | 'large';
      // Buttons
      buttonStyle: 'rounded' | 'pill' | 'square';
      buttonAnimation: boolean;
      // Layout
      maxWidth: 'narrow' | 'medium' | 'wide';
      spacing: 'compact' | 'comfortable' | 'spacious';
      // Effects
      enableAnimations: boolean;
      glassmorphism: boolean;
      // Custom CSS
      customCss?: string;
    };
    // SEO & Meta
    seo: {
      title: string;
      description: string;
      keywords: string[];
      ogImage?: string;
      // Social media
      social: {
        facebook?: string;
        instagram?: string;
        linkedin?: string;
      };
    };
    // Geavanceerd
    advanced: {
      customDomain?: string;
      customScripts?: string;
      customHeadTags?: string;
      robotsTxt?: string;
    };
  };
}

export default function SiteCustomization() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<SiteData | null>(null);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [selectedTab, setSelectedTab] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const docRef = doc(db, 'businesses', user.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setData(docSnap.data() as SiteData);
        }
      } catch (error) {
        console.error('Error fetching site data:', error);
        toast.error('Kon site-instellingen niet laden');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSave = async () => {
    if (!data) return;
    const user = auth.currentUser;
    if (!user) return;

    setSaving(true);
    try {
      await updateDoc(doc(db, 'businesses', user.uid), {
        site: data.site
      });
      toast.success('Site-instellingen opgeslagen!');
    } catch (error) {
      console.error('Error saving site settings:', error);
      toast.error('Kon site-instellingen niet opslaan');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (section: string, field: string, file: File) => {
    const user = auth.currentUser;
    if (!user || !data) return;

    try {
      const storageRef = ref(storage, `businesses/${user.uid}/site/${section}-${field}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      
      setData(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          site: {
            ...prev.site,
            [section]: {
              ...prev.site[section as keyof typeof prev.site],
              [field]: url
            }
          }
        };
      });

      toast.success('Afbeelding geüpload!');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Kon afbeelding niet uploaden');
    }
  };

  const addCustomField = () => {
    if (!data) return;
    
    const newField: CustomField = {
      id: Date.now().toString(),
      label: '',
      type: 'text',
      required: false
    };

    setData(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        site: {
          ...prev.site,
          booking: {
            ...prev.site.booking,
            customFields: [...prev.site.booking.customFields, newField]
          }
        }
      };
    });
  };

  const removeCustomField = (id: string) => {
    if (!data) return;
    
    setData(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        site: {
          ...prev.site,
          booking: {
            ...prev.site.booking,
            customFields: prev.site.booking.customFields.filter(field => field.id !== id)
          }
        }
      };
    });
  };

  if (loading || !data) {
    return <div>Laden...</div>;
  }

  // De rest van de component met alle tabs en formulieren
  const tabs = [
    { name: 'Algemeen', content: (
      <div>Algemene site instellingen</div>
    )},
    { name: 'Styling', content: (
      <div>Styling opties</div>
    )},
    { name: 'Inhoud', content: (
      <div>Content secties</div>
    )},
    { name: 'Booking', content: (
      <div>Booking formulier instellingen</div>
    )},
    { name: 'SEO', content: (
      <div>SEO instellingen</div>
    )},
    { name: 'Geavanceerd', content: (
      <div>Geavanceerde opties</div>
    )}
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Preview toggle */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Website Instellingen</h1>
        <div className="flex items-center space-x-4">
          <div className="flex rounded-lg border border-gray-200 p-1">
            <button
              onClick={() => setPreviewMode('desktop')}
              className={`px-3 py-1.5 rounded ${
                previewMode === 'desktop' ? 'bg-black text-white' : 'text-gray-600'
              }`}
            >
              Desktop
            </button>
            <button
              onClick={() => setPreviewMode('mobile')}
              className={`px-3 py-1.5 rounded ${
                previewMode === 'mobile' ? 'bg-black text-white' : 'text-gray-600'
              }`}
            >
              Mobiel
            </button>
          </div>
          <a
            href={`https://${data.customUrl}.yourdomain.com`}
            target="_blank"
            rel="noopener noreferrer"
            className="button-secondary"
          >
            Preview
          </a>
          <button
            onClick={handleSave}
            disabled={saving}
            className="button-primary"
          >
            {saving ? 'Opslaan...' : 'Opslaan'}
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-12 gap-8">
        {/* Settings panel */}
        <div className="col-span-7">
          <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
            <Tab.List className="flex space-x-2 rounded-xl bg-gray-100 p-1">
              {tabs.map((tab) => (
                <Tab
                  key={tab.name}
                  className={({ selected }) =>
                    `w-full rounded-lg py-2.5 text-sm font-medium leading-5
                    ${selected
                      ? 'bg-white shadow text-black'
                      : 'text-gray-600 hover:text-black hover:bg-white/[0.12]'
                    }`
                  }
                >
                  {tab.name}
                </Tab>
              ))}
            </Tab.List>

            <Tab.Panels className="mt-4">
              {tabs.map((tab, idx) => (
                <Tab.Panel
                  key={idx}
                  className={
                    "rounded-xl bg-white p-6 shadow-sm"
                  }
                >
                  {tab.content}
                </Tab.Panel>
              ))}
            </Tab.Panels>
          </Tab.Group>
        </div>

        {/* Preview panel */}
        <div className="col-span-5">
          <div className={`
            sticky top-4 rounded-xl border border-gray-200 bg-gray-50
            ${previewMode === 'mobile' ? 'w-[375px] mx-auto' : 'w-full'}
          `}>
            <div className="p-4">
              <div className="aspect-[9/16] bg-white rounded-lg shadow-sm">
                {/* Live preview here */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}