// src/types/notifications.ts
import { DocumentData } from 'firebase/firestore';

export interface Appointment extends DocumentData {
  id: string;
  customerName: string;
  customerEmail: string;
  date: string;
  time: string;
  serviceId: string;
  serviceName: string;
  duration: number;
  status: 'confirmed' | 'cancelled' | 'completed';
}

export type NotificationType = 'new' | 'update' | 'cancel' | 'reminder';

export interface NotificationChannelPreferences {
  enabled: boolean;
  newBooking: boolean;
  reminder: boolean;
  cancellation: boolean;
}

export interface DeviceToken extends DocumentData {
  id?: string;
  businessId: string;
  token: string;
  platform: 'mobile' | 'browser';
  createdAt: string;
  lastUsed?: string;
}

export interface NotificationPreferences {
  email: NotificationChannelPreferences;
  browserPush: NotificationChannelPreferences;
  mobilePush: NotificationChannelPreferences;
}

export interface NotificationMessage {
  notification: {
    title: string;
    body: string;
  };
  data?: Record<string, string>;
  android?: {
    notification: {
      channelId: string;
      icon?: string;
      priority?: string;
      defaultSound?: boolean;
      defaultVibrateTimings?: boolean;
    };
  };
  apns?: {
    payload: {
      aps: {
        sound?: string;
        badge?: number;
        'mutable-content'?: number;
        'content-available'?: number;
      };
    };
  };
  tokens: string[];
}