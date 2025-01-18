// src/utils/DeviceRegistrationService.ts
import { getMessaging, getToken } from 'firebase/messaging';
import { addDoc } from 'firebase/firestore';
import { getDeviceTokensCollection } from '@/lib/firebase';
import type { DeviceToken } from '@/types/notifications';

export class DeviceRegistrationService {
  public static async registerDevice(businessId: string): Promise<string | null> {
    try {
      const messaging = getMessaging();
      const currentToken = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY
      });

      if (!currentToken) {
        throw new Error('No registration token available');
      }

      const deviceToken: DeviceToken = {
        businessId,
        token: currentToken,
        platform: 'mobile',
        createdAt: new Date().toISOString()
      };

      await addDoc(getDeviceTokensCollection(), deviceToken);

      return currentToken;
    } catch (error) {
      console.error('Error registering device:', error);
      return null;
    }
  }

  public static async registerBrowserPush(businessId: string, subscription: PushSubscription): Promise<void> {
    try {
      const deviceToken: DeviceToken = {
        businessId,
        token: JSON.stringify(subscription),
        platform: 'browser',
        createdAt: new Date().toISOString()
      };

      await addDoc(getDeviceTokensCollection(), deviceToken);
    } catch (error) {
      console.error('Error registering browser push:', error);
      throw error;
    }
  }
}