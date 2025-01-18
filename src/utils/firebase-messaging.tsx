// src/utils/firebase-messaging.ts
import React from 'react';
import { getMessaging, getToken, onMessage, MessagePayload } from 'firebase/messaging';
import { toast, Toast, ToastOptions } from 'react-hot-toast';

interface NotificationToastProps {
  t: Toast;
  notification: {
    title?: string;
    body?: string;
  };
  onClose: () => void;
}

// Explicitly define the Toast component as a React Function Component
const NotificationToast: React.FC<NotificationToastProps> = ({ 
  t, 
  notification, 
  onClose 
}): React.ReactElement => {
  return (
    <div
      className={`${
        t.visible ? 'animate-enter' : 'animate-leave'
      } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex`}
    >
      <div className="flex-1 w-0 p-4">
        <div className="flex items-start">
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-gray-900">
              {notification?.title}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              {notification?.body}
            </p>
          </div>
        </div>
      </div>
      <div className="flex border-l border-gray-200">
        <button
          onClick={onClose}
          className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-gray-600 hover:text-gray-500 focus:outline-none"
        >
          Sluiten
        </button>
      </div>
    </div>
  );
};

export async function initializeFirebaseMessaging(): Promise<string | null> {
  if (typeof window === 'undefined') return null;

  try {
    // Check if the browser supports notifications
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return null;
    }

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.log('Notification permission not granted');
      return null;
    }

    // Check for service worker support
    if (!('serviceWorker' in navigator)) {
      console.log('Service workers not supported');
      return null;
    }

    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
      scope: '/'
    });

    const messaging = getMessaging();
    
    if (!process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY) {
      console.error('VAPID key not configured');
      return null;
    }

    const currentToken = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
      serviceWorkerRegistration: registration
    });

    // Add proper typing for the payload
    onMessage(messaging, (payload: MessagePayload) => {
      if (payload.notification) {
        const toastOptions: ToastOptions = { duration: 5000 };
        
        toast.custom(
          (t: Toast) => (
            <NotificationToast
              t={t}
              notification={payload.notification || { title: '', body: '' }}
              onClose={() => toast.dismiss(t.id)}
            />
          ),
          toastOptions
        );
      }
    });

    return currentToken;
  } catch (error) {
    console.error('Error initializing Firebase Messaging:', error);
    return null;
  }
}