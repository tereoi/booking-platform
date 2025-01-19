// src/components/appointments/TimeSlotSelector.tsx
import { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { TimeSlotManager } from '@/utils/timeSlotManager';
import type { Appointment } from '@/types';

interface TimeSlotSelectorProps {
  date: Date;
  selectedTime: string | null;
  serviceId: string;
  onSelectTime: (time: string) => void;
}

interface TimeSlot {
  startTime: string;
  endTime: string;
  available: boolean;
}

interface Service {
  id: string;
  name: string;
  duration: number;
}

interface BusinessData {
  settings?: {
    workingHours: Record<string, { isOpen: boolean; start: string; end: string }>;
  };
  services: Service[];
}

export default function TimeSlotSelector({
  date,
  selectedTime,
  serviceId,
  onSelectTime
}: TimeSlotSelectorProps) {
  const [loading, setLoading] = useState(true);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTimeSlots = async () => {
      setLoading(true);
      setError(null);

      try {
        const user = auth.currentUser;
        if (!user) throw new Error('Niet ingelogd');

        const businessDoc = await getDoc(doc(db, 'businesses', user.uid));
        if (!businessDoc.exists()) throw new Error('Bedrijf niet gevonden');

        const businessData = businessDoc.data() as BusinessData;
        const workingHours = businessData.settings?.workingHours;
        if (!workingHours) throw new Error('Werktijden niet ingesteld');

        const services = businessData.services || [];
        const service = services.find((s: Service) => s.id === serviceId);
        if (!service) throw new Error('Dienst niet gevonden');

        const appointmentsRef = collection(db, 'businesses', user.uid, 'appointments');
        const appointmentsQuery = query(
          appointmentsRef,
          where('date', '==', date.toISOString().split('T')[0])
        );
        const appointmentsSnapshot = await getDocs(appointmentsQuery);
        const appointments = appointmentsSnapshot.docs.map(doc => ({
          ...doc.data()
        })) as Appointment[];

        const slots = TimeSlotManager.generateTimeSlots(
          date,
          workingHours,
          appointments,
          service.duration
        );

        setTimeSlots(slots);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        console.error('Error fetching time slots:', errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchTimeSlots();
  }, [date, serviceId]);


  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        {error}
      </div>
    );
  }

  if (timeSlots.length === 0) {
    return (
      <div className="text-center py-8 text-gray-600">
        Geen beschikbare tijden voor deze dag.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-2">
      {timeSlots.map((slot) => (
        <motion.button
          key={slot.startTime}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => slot.available && onSelectTime(slot.startTime)}
          disabled={!slot.available}
          className={`
            p-3 rounded-lg text-center transition-all
            ${selectedTime === slot.startTime
              ? 'bg-black text-white'
              : slot.available
                ? 'bg-gray-50 hover:bg-gray-100'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          {slot.startTime}
        </motion.button>
      ))}
    </div>
  );
}