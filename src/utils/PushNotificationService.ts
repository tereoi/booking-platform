// src/utils/PushNotificationService.ts
import { getMessaging, MulticastMessage, MessagingPayload } from 'firebase-admin/messaging';
import { query, where, getDocs, deleteDoc } from 'firebase/firestore';
import { getDeviceTokensCollection } from '@/lib/firebase';
import { NOTIFICATION_TYPES } from './notificationChannels';
import type { Appointment } from '@/types';
import type { NotificationMessage } from '@/types/notifications';

interface MulticastResponse {
  failureCount: number;
  responses: Array<{ success: boolean }>;
}

export class PushNotificationService {
  private static async getBusinessDeviceTokens(businessId: string): Promise<string[]> {
    const tokenQuery = query(
      getDeviceTokensCollection(),
      where('businessId', '==', businessId),
      where('platform', '==', 'mobile')
    );

    const tokenDocs = await getDocs(tokenQuery);
    return tokenDocs.docs.map(doc => doc.data().token);
  }

  public static async sendNewBookingNotification(
    businessId: string, 
    appointment: Appointment
  ): Promise<void> {
    const tokens = await this.getBusinessDeviceTokens(businessId);
    if (tokens.length === 0) return;

    const message: NotificationMessage = {
      notification: {
        title: NOTIFICATION_TYPES.NEW_BOOKING.title,
        body: `${appointment.customerName} heeft een afspraak gemaakt voor ${
          new Date(appointment.date).toLocaleDateString()
        } om ${appointment.time}`,
      },
      data: {
        appointmentId: appointment.id,
        type: 'new_booking',
        customerName: appointment.customerName,
        date: appointment.date,
        time: appointment.time
      },
      android: {
        notification: {
          channelId: NOTIFICATION_TYPES.NEW_BOOKING.channelId,
          icon: NOTIFICATION_TYPES.NEW_BOOKING.icon,
          priority: 'high',
          defaultSound: true,
          defaultVibrateTimings: true
        }
      },
      apns: {
        payload: {
          aps: {
            sound: 'default',
            badge: 1,
            'mutable-content': 1,
            'content-available': 1
          }
        }
      },
      tokens
    };

    try {
      const response = await getMessaging().sendEachForMulticast(message as MulticastMessage);
      console.log('Successfully sent message:', response);
      
      // Handle invalid tokens
      if (response.failureCount > 0) {
        response.responses.forEach((resp, idx) => {
          if (!resp.success) {
            void this.removeInvalidToken(tokens[idx]);
          }
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }

  private static async removeInvalidToken(token: string): Promise<void> {
    const tokenQuery = query(
      getDeviceTokensCollection(),
      where('token', '==', token)
    );

    const tokenDocs = await getDocs(tokenQuery);
    
    await Promise.all(
      tokenDocs.docs.map(doc => deleteDoc(doc.ref))
    );
  }
}