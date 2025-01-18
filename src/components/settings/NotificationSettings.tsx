// src/components/settings/NotificationSettings.tsx
import { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { BellIcon, EnvelopeIcon, DevicePhoneMobileIcon } from '@heroicons/react/24/outline';

interface NotificationSettings {
  email: {
    enabled: boolean;
    newBooking: boolean;
    reminder: boolean;
    cancellation: boolean;
  };
  sms: {
    enabled: boolean;
    newBooking: boolean;
    reminder: boolean;
    cancellation: boolean;
  };
  push: {
    enabled: boolean;
    newBooking: boolean;
    reminder: boolean;
    cancellation: boolean;
  };
}

export default function NotificationSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<NotificationSettings>({
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
  });

  useEffect(() => {
    const fetchSettings = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const docRef = doc(db, 'businesses', user.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists() && docSnap.data().notificationSettings) {
          setSettings(docSnap.data().notificationSettings);
        }
      } catch (error) {
        console.error('Error fetching notification settings:', error);
        toast.error('Kon notificatie-instellingen niet laden');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleToggle = (type: keyof NotificationSettings, setting: string) => {
    setSettings(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [setting]: !prev[type][setting as keyof typeof prev[typeof type]]
      }
    }));
  };

  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user) return;

    setSaving(true);
    try {
      await updateDoc(doc(db, 'businesses', user.uid), {
        notificationSettings: settings
      });
      toast.success('Notificatie-instellingen opgeslagen!');
    } catch (error) {
      console.error('Error saving notification settings:', error);
      toast.error('Kon notificatie-instellingen niet opslaan');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div>Laden...</div>;
  }

  const notificationTypes = [
    {
      key: 'email' as const,
      title: 'Email Notificaties',
      icon: EnvelopeIcon,
      description: 'Ontvang notificaties via email'
    },
    {
      key: 'sms' as const,
      title: 'SMS Notificaties',
      icon: DevicePhoneMobileIcon,
      description: 'Ontvang notificaties via SMS'
    },
    {
      key: 'push' as const,
      title: 'Push Notificaties',
      icon: BellIcon,
      description: 'Ontvang notificaties in je browser'
    }
  ];

  return (
    <div className="max-w-2xl space-y-6">
      {notificationTypes.map(({ key, title, icon: Icon, description }) => (
        <motion.div
          key={key}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-lg shadow-sm"
        >
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <Icon className="w-6 h-6 text-gray-400" />
            </div>
            <div className="flex-grow">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">{title}</h3>
                <label className="flex items-center cursor-pointer">
                  <div className="relative inline-block w-10 mr-2 align-middle select-none">
                    <input
                      type="checkbox"
                      checked={settings[key].enabled}
                      onChange={() => handleToggle(key, 'enabled')}
                      className="hidden"
                    />
                    <div className={`
                      toggle-bg block w-10 h-6 rounded-full transition-all duration-300
                      ${settings[key].enabled ? 'bg-black' : 'bg-gray-300'}
                    `}></div>
                  </div>
                </label>
              </div>
              <p className="text-sm text-gray-500 mt-1">{description}</p>

              {settings[key].enabled && (
                <div className="mt-4 space-y-3">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={settings[key].newBooking}
                      onChange={() => handleToggle(key, 'newBooking')}
                      className="rounded text-black focus:ring-black"
                    />
                    <span className="text-sm">Nieuwe boekingen</span>
                  </label>

                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={settings[key].reminder}
                      onChange={() => handleToggle(key, 'reminder')}
                      className="rounded text-black focus:ring-black"
                    />
                    <span className="text-sm">Herinneringen</span>
                  </label>

                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={settings[key].cancellation}
                      onChange={() => handleToggle(key, 'cancellation')}
                      className="rounded text-black focus:ring-black"
                    />
                    <span className="text-sm">Annuleringen</span>
                  </label>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      ))}

      <div className="pt-4">
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