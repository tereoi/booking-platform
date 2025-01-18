// src/lib/firebase.ts
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, User } from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc,
  CollectionReference,
  DocumentData,
  QueryDocumentSnapshot,
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { useState, useEffect } from 'react';


const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Helper function voor typed collections
export function createCollection<T = DocumentData>(path: string) {
  return collection(db, path) as CollectionReference<T>;
}

// Helper function voor typed documents
export function createDoc<T = DocumentData>(collectionPath: string, docId: string) {
  return doc(db, collectionPath, docId);
}

// Collection references
export const getBusinessesCollection = () => createCollection('businesses');
export const getDeviceTokensCollection = () => createCollection('deviceTokens');
export const getAppointmentsCollection = (businessId: string) => 
  createCollection(`businesses/${businessId}/appointments`);
export const getNotificationsCollection = () => createCollection('notifications');

// Types
export type FirestoreDoc<T> = QueryDocumentSnapshot<T>;

// Custom hooks
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return { user, loading };
}

export { auth, db, storage };