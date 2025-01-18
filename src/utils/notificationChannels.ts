// src/utils/notificationChannels.ts
export const NOTIFICATION_CHANNELS = {
    APPOINTMENTS: {
      id: 'appointments',
      name: 'Appointments',
      description: 'Notifications for appointments',
      importance: 'high',
      sound: true,
      vibration: true
    }
  } as const;
  
  export const NOTIFICATION_TYPES = {
    NEW_BOOKING: {
      channelId: NOTIFICATION_CHANNELS.APPOINTMENTS.id,
      title: 'Nieuwe Afspraak',
      icon: '/icons/new-booking.png',
      priority: 'high',
      ttl: 24 * 60 * 60, // 24 uur
      analytics_label: 'new_booking'
    },
    REMINDER: {
      channelId: NOTIFICATION_CHANNELS.APPOINTMENTS.id,
      title: 'Herinnering Afspraak',
      icon: '/icons/reminder.png',
      priority: 'high',
      ttl: 1 * 60 * 60, // 1 uur
      analytics_label: 'reminder'
    },
    CANCELLATION: {
      channelId: NOTIFICATION_CHANNELS.APPOINTMENTS.id,
      title: 'Afspraak Geannuleerd',
      icon: '/icons/cancellation.png',
      priority: 'high',
      ttl: 24 * 60 * 60, // 24 uur
      analytics_label: 'cancellation'
    }
  } as const;