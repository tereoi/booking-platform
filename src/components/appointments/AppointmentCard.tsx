// src/components/appointments/AppointmentCard.tsx
import { useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PencilIcon, 
  TrashIcon, 
  XMarkIcon,
  CheckIcon 
} from '@heroicons/react/24/outline';
import type { Appointment } from '@/types';

interface AppointmentCardProps {
  appointment: Appointment;
  onUpdate: () => void;
}

export default function AppointmentCard({ appointment, onUpdate }: AppointmentCardProps) {
  const [showActions, setShowActions] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCancel = async () => {
    if (!confirm('Weet je zeker dat je deze afspraak wilt annuleren?')) return;

    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Niet ingelogd');

      await updateDoc(doc(db, 'businesses', user.uid, 'appointments', appointment.id), {
        status: 'cancelled'
      });

      toast.success('Afspraak geannuleerd');
      onUpdate();
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      toast.error('Kon afspraak niet annuleren');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Weet je zeker dat je deze afspraak wilt verwijderen?')) return;

    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Niet ingelogd');

      await deleteDoc(doc(db, 'businesses', user.uid, 'appointments', appointment.id));

      toast.success('Afspraak verwijderd');
      onUpdate();
    } catch (error) {
      console.error('Error deleting appointment:', error);
      toast.error('Kon afspraak niet verwijderen');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Niet ingelogd');

      await updateDoc(doc(db, 'businesses', user.uid, 'appointments', appointment.id), {
        status: 'confirmed'
      });

      toast.success('Afspraak bevestigd');
      onUpdate();
    } catch (error) {
      console.error('Error confirming appointment:', error);
      toast.error('Kon afspraak niet bevestigen');
    } finally {
      setLoading(false);
    }
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-all"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium">{appointment.customerName}</h3>
          <p className="text-sm text-gray-500">
            {new Date(appointment.date).toLocaleDateString()} om {appointment.time}
          </p>
          {appointment.customerPhone && (
            <p className="text-sm text-gray-500">{appointment.customerPhone}</p>
          )}
          <span className={`inline-block px-2 py-1 rounded-full text-xs mt-2 ${
            statusColors[appointment.status as keyof typeof statusColors]
          }`}>
            {appointment.status === 'pending' && 'In afwachting'}
            {appointment.status === 'confirmed' && 'Bevestigd'}
            {appointment.status === 'cancelled' && 'Geannuleerd'}
          </span>
        </div>

        <AnimatePresence>
          {showActions && !loading && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex space-x-2"
            >
              {appointment.status === 'pending' && (
                <button
                  onClick={handleConfirm}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                  title="Bevestig afspraak"
                >
                  <CheckIcon className="w-5 h-5" />
                </button>
              )}
              {appointment.status !== 'cancelled' && (
                <button
                  onClick={handleCancel}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  title="Annuleer afspraak"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={handleDelete}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                title="Verwijder afspraak"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}