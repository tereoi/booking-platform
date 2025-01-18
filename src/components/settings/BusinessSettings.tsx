// src/components/settings/BusinessSettings.tsx
import { useState, useEffect } from 'react';
import { auth, db, storage } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

interface BusinessData {
  name: string;
  email: string;
  phone: string;
  address: string;
  site: {
    styling: {
      primaryColor: string;
      secondaryColor: string;
      logo?: string;
    };
  };
}

const defaultData: BusinessData = {
  name: '',
  email: '',
  phone: '',
  address: '',
  site: {
    styling: {
      primaryColor: '#000000',
      secondaryColor: '#ffffff'
    }
  }
};

export default function BusinessSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<BusinessData>(defaultData);

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const docRef = doc(db, 'businesses', user.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const businessData = docSnap.data();
          setData({
            name: businessData.name || '',
            email: businessData.email || '',
            phone: businessData.phone || '',
            address: businessData.address || '',
            site: {
              styling: {
                primaryColor: businessData.site?.styling?.primaryColor || '#000000',
                secondaryColor: businessData.site?.styling?.secondaryColor || '#ffffff',
                logo: businessData.site?.styling?.logo
              }
            }
          });
        }
      } catch (error) {
        console.error('Error fetching business data:', error);
        toast.error('Kon bedrijfsgegevens niet laden');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleThemeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData(prev => ({
      ...prev,
      site: {
        ...prev.site,
        styling: {
          ...prev.site.styling,
          [name]: value
        }
      }
    }));
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const user = auth.currentUser;
    if (!user) return;

    try {
      const storageRef = ref(storage, `businesses/${user.uid}/logo`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      
      setData(prev => ({
        ...prev,
        site: {
          ...prev.site,
          styling: {
            ...prev.site.styling,
            logo: url
          }
        }
      }));

      toast.success('Logo geüpload!');
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast.error('Kon logo niet uploaden');
    }
  };

  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user) return;

    setSaving(true);
    try {
      await updateDoc(doc(db, 'businesses', user.uid), {
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        site: {
          styling: {
            primaryColor: data.site.styling.primaryColor,
            secondaryColor: data.site.styling.secondaryColor,
            logo: data.site.styling.logo
          }
        }
      });
      toast.success('Instellingen opgeslagen!');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Kon instellingen niet opslaan');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
    </div>;
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Bedrijfsnaam
          </label>
          <input
            type="text"
            name="name"
            value={data.name}
            onChange={handleChange}
            className="input-field mt-1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={data.email}
            onChange={handleChange}
            className="input-field mt-1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Telefoon
          </label>
          <input
            type="tel"
            name="phone"
            value={data.phone}
            onChange={handleChange}
            className="input-field mt-1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Adres
          </label>
          <textarea
            name="address"
            value={data.address}
            onChange={handleChange}
            rows={3}
            className="input-field mt-1"
          />
        </div>

        <div className="border-t pt-6">
          <h3 className="text-lg font-medium mb-4">Thema Instellingen</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Primaire Kleur
              </label>
              <input
                type="color"
                name="primaryColor"
                value={data.site.styling.primaryColor}
                onChange={handleThemeChange}
                className="h-10 w-full mt-1 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Secundaire Kleur
              </label>
              <input
                type="color"
                name="secondaryColor"
                value={data.site.styling.secondaryColor}
                onChange={handleThemeChange}
                className="h-10 w-full mt-1 rounded-lg"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">
              Logo
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="mt-1"
            />
            {data.site.styling.logo && (
              <img 
                src={data.site.styling.logo} 
                alt="Business logo" 
                className="mt-2 h-20 object-contain"
              />
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="button-primary"
        >
          {saving ? 'Opslaan...' : 'Opslaan'}
        </button>
      </div>
    </div>
  );
}