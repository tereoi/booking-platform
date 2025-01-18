// src/components/settings/NotificationPreferences.tsx
import { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import { DeviceRegistrationService } from '@/utils/DeviceRegistrationService';
import { db, getBusinessesCollection } from '@/lib/firebase';
import type { NotificationPreferences } from '@/types/notifications';

type ChannelType = 'email' | 'browserPush' | 'mobilePush';
type NotificationSetting = 'enabled' | 'newBooking' | 'reminder' | 'cancellation';

interface NotificationPreferencesProps {
  businessId: string;
}

export default function NotificationPreferences({ businessId }: NotificationPreferencesProps) {
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    email: {
      enabled: true,
      newBooking: true,
      reminder: true,
      cancellation: true
    },
    browserPush: {
      enabled: false,
      newBooking: false,
      reminder: false,
      cancellation: false
    },
    mobilePush: {
      enabled: false,
      newBooking: false,
      reminder: false,
      cancellation: false
    }
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const docRef = doc(getBusinessesCollection(), businessId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists() && docSnap.data()?.notificationPreferences) {
          setPreferences(docSnap.data()?.notificationPreferences);
        }
      } catch (error) {
        console.error('Error fetching preferences:', error);
        toast.error('Kon voorkeuren niet laden');
      } finally {
        setLoading(false);
      }
    };

    fetchPreferences();
  }, [businessId]);

  const handleToggle = async (channel: 'email' | 'browserPush' | 'mobilePush', setting: NotificationSetting) => {
    try {
      const newPreferences = {
        ...preferences,
        [channel]: {
          ...preferences[channel],
          [setting]: !preferences[channel][setting]
        }
      };

      // Als een type notificatie wordt aangezet, zet enabled ook aan
      if (setting !== 'enabled' && newPreferences[channel][setting]) {
        newPreferences[channel].enabled = true;
      }

      // Als alle types uit staan, zet enabled uit
      if (setting === 'enabled' && !newPreferences[channel].enabled) {
        newPreferences[channel].newBooking = false;
        newPreferences[channel].reminder = false;
        newPreferences[channel].cancellation = false;
      }

      setPreferences(newPreferences);

      const docRef = doc(db, 'businesses', businessId);
      await updateDoc(docRef, {
        notificationPreferences: newPreferences
      });

      // Als mobile push wordt aangezet, registreer device
      if (channel === 'mobilePush' && setting === 'enabled' && newPreferences.mobilePush.enabled) {
        await DeviceRegistrationService.registerDevice(businessId);
      }

      // Als browser push wordt aangezet, vraag permissie en registreer
      if (channel === 'browserPush' && setting === 'enabled' && newPreferences.browserPush.enabled) {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          const registration = await navigator.serviceWorker.ready;
          const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY
          });
          await DeviceRegistrationService.registerBrowserPush(businessId, subscription);
        }
      }

      toast.success('Voorkeuren opgeslagen');
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast.error('Kon voorkeuren niet opslaan');
    }
  };

  if (loading) return <div>Laden...</div>;

  return (
    <div className="space-y-6">
      {/* Email Notificaties */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-medium">Email Notificaties</h3>
            <p className="text-sm text-gray-500">Ontvang notificaties via email</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={preferences.email.enabled}
              onChange={() => handleToggle('email', 'enabled')}
            />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-black after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
          </label>
        </div>
        {preferences.email.enabled && (
          <div className="space-y-4 mt-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={preferences.email.newBooking}
                onChange={() => handleToggle('email', 'newBooking')}
                className="rounded border-gray-300 text-black focus:ring-black"
              />
              <span>Nieuwe boekingen</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={preferences.email.reminder}
                onChange={() => handleToggle('email', 'reminder')}
                className="rounded border-gray-300 text-black focus:ring-black"
              />
              <span>Herinneringen</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={preferences.email.cancellation}
                onChange={() => handleToggle('email', 'cancellation')}
                className="rounded border-gray-300 text-black focus:ring-black"
              />
              <span>Annuleringen</span>
            </label>
          </div>
        )}
      </div>

      {/* Browser Push Notificaties */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-medium">Browser Notificaties</h3>
            <p className="text-sm text-gray-500">Ontvang notificaties in je browser</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={preferences.browserPush.enabled}
              onChange={() => handleToggle('browserPush', 'enabled')}
            />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-black after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
          </label>
        </div>
        {preferences.browserPush.enabled && (
          <div className="space-y-4 mt-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={preferences.browserPush.newBooking}
                onChange={() => handleToggle('browserPush', 'newBooking')}
                className="rounded border-gray-300 text-black focus:ring-black"
              />
              <span>Nieuwe boekingen</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={preferences.browserPush.reminder}
                onChange={() => handleToggle('browserPush', 'reminder')}
                className="rounded border-gray-300 text-black focus:ring-black"
              />
              <span>Herinneringen</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={preferences.browserPush.cancellation}
                onChange={() => handleToggle('browserPush', 'cancellation')}
                className="rounded border-gray-300 text-black focus:ring-black"
              />
              <span>Annuleringen</span>
            </label>
          </div>
        )}
      </div>

      {/* Mobile Push Notificaties */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-medium">Mobiele Notificaties</h3>
            <p className="text-sm text-gray-500">Ontvang notificaties op je telefoon</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={preferences.mobilePush.enabled}
              onChange={() => handleToggle('mobilePush', 'enabled')}
            />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-black after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
          </label>
        </div>
        {preferences.mobilePush.enabled && (
          <div className="space-y-4 mt-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={preferences.mobilePush.newBooking}
                onChange={() => handleToggle('mobilePush', 'newBooking')}
                className="rounded border-gray-300 text-black focus:ring-black"
              />
              <span>Nieuwe boekingen</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={preferences.mobilePush.reminder}
                onChange={() => handleToggle('mobilePush', 'reminder')}
                className="rounded border-gray-300 text-black focus:ring-black"
              />
              <span>Herinneringen</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={preferences.mobilePush.cancellation}
                onChange={() => handleToggle('mobilePush', 'cancellation')}
                className="rounded border-gray-300 text-black focus:ring-black"
              />
              <span>Annuleringen</span>
            </label>
          </div>
        )}
      </div>
    </div>
  );
}