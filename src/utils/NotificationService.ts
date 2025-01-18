// src/utils/NotificationService.ts
import { getFirestore, doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import type { Appointment, NotificationType, NotificationPreferences } from '@/types/notifications';
import { NOTIFICATION_TYPES } from './notificationChannels';

const db = getFirestore();

interface EmailTemplate {
  subject: string;
  html: string;
}

type NotificationTypeKey = keyof typeof NOTIFICATION_TYPES;
const notificationTypeMapping: Record<NotificationType, NotificationTypeKey> = {
  new: 'NEW_BOOKING',
  reminder: 'REMINDER',
  cancel: 'CANCELLATION',
  update: 'NEW_BOOKING' // We gebruiken dezelfde als new booking voor updates
};

export class NotificationService {
  private static async sendEmail(to: string, subject: string, html: string): Promise<void> {
    try {
      const response = await fetch('/api/notifications/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to, subject, html })
      });

      if (!response.ok) {
        throw new Error('Failed to send email');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  private static getEmailTemplate(type: NotificationType, appointment: Appointment, isCustomer = true): EmailTemplate {
    const typeConfig = NOTIFICATION_TYPES[notificationTypeMapping[type]];
    
    return {
      subject: isCustomer ? 'Afspraakbevestiging' : typeConfig.title,
      html: `
        <h1>${isCustomer ? 'Je afspraak is bevestigd!' : typeConfig.title}</h1>
        <p>${isCustomer ? `Beste ${appointment.customerName},` : 'Details:'}</p>
        <ul>
          <li>Datum: ${new Date(appointment.date).toLocaleDateString()}</li>
          <li>Tijd: ${appointment.time}</li>
          <li>Service: ${appointment.serviceName}</li>
        </ul>
      `
    };
  }

  public static async sendCustomerNotification(
    type: NotificationType,
    appointment: Appointment
  ): Promise<void> {
    const template = this.getEmailTemplate(type, appointment, true);
    await this.sendEmail(appointment.customerEmail, template.subject, template.html);
  }

  public static async sendBusinessNotification(
    type: NotificationType,
    appointment: Appointment,
    businessId: string,
    preferences: NotificationPreferences
  ): Promise<void> {
    const businessRef = doc(db, 'businesses', businessId);
    const businessDoc = await getDoc(businessRef);
    const business = businessDoc.data();

    if (!business) return;

    // Email Notifications
    if (preferences.email.enabled && preferences.email.newBooking) {
      const template = this.getEmailTemplate(type, appointment, false);
      await this.sendEmail(business.email, template.subject, template.html);
    }

    // Push Notifications
    if (preferences.mobilePush.enabled && preferences.mobilePush.newBooking) {
      await this.sendPushNotification(businessId, type, appointment);
    }
  }

  private static async sendPushNotification(
    businessId: string,
    type: NotificationType,
    appointment: Appointment
  ): Promise<void> {
    const tokensRef = collection(db, 'deviceTokens');
    const tokenQuery = query(
      tokensRef, 
      where('businessId', '==', businessId),
      where('platform', '==', 'mobile')
    );
    
    const tokenDocs = await getDocs(tokenQuery);
    const tokens = tokenDocs.docs.map(doc => doc.data().token);

    if (tokens.length === 0) return;

    try {
      const typeConfig = NOTIFICATION_TYPES[notificationTypeMapping[type]];
      
      await fetch('/api/notifications/push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tokens,
          notification: {
            title: typeConfig.title,
            body: `${appointment.customerName} - ${new Date(appointment.date).toLocaleDateString()} ${appointment.time}`,
            icon: typeConfig.icon
          },
          data: {
            type,
            appointmentId: appointment.id
          },
          android: {
            notification: {
              channelId: typeConfig.channelId,
              priority: 'high'
            }
          }
        })
      });
    } catch (error) {
      console.error('Error sending push notification:', error);
    }
  }
}