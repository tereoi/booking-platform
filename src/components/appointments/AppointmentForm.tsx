// src/components/appointments/AppointmentForm.tsx
import { useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { toast } from 'react-hot-toast';

interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
}

interface AppointmentFormProps {
  date: Date;
  time: string;
  service: Service;
  onSubmit: () => void;
}

export default function AppointmentForm({ 
  date, 
  time, 
  service, 
  onSubmit 
}: AppointmentFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    notes: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Niet ingelogd');

      const appointment = {
        date: date.toISOString().split('T')[0],
        time,
        serviceId: service.id,
        duration: service.duration,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        notes: formData.notes,
        status: 'confirmed',
        createdAt: new Date().toISOString()
      };

      await addDoc(collection(db, 'businesses', user.uid, 'appointments'), appointment);
      
      toast.success('Afspraak succesvol ingepland!');
      onSubmit();
    } catch (error) {
      console.error('Error adding appointment:', error);
      toast.error('Er ging iets mis. Probeer het opnieuw.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Nieuwe Afspraak</h3>
        <p className="text-sm text-gray-600 mt-1">
          {service.name} • {service.duration} min • €{service.price}
        </p>
        <p className="text-sm text-gray-600">
          {date.toLocaleDateString()} om {time}
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Naam
        </label>
        <input
          type="text"
          name="customerName"
          required
          value={formData.customerName}
          onChange={handleChange}
          className="input-field mt-1"
          placeholder="Naam van de klant"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          name="customerEmail"
          required
          value={formData.customerEmail}
          onChange={handleChange}
          className="input-field mt-1"
          placeholder="email@voorbeeld.nl"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Telefoon
        </label>
        <input
          type="tel"
          name="customerPhone"
          value={formData.customerPhone}
          onChange={handleChange}
          className="input-field mt-1"
          placeholder="06 12345678"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Notities
        </label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={3}
          className="input-field mt-1"
          placeholder="Eventuele opmerkingen..."
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="button-primary w-full"
      >
        {loading ? 'Bezig met opslaan...' : 'Afspraak Inplannen'}
      </button>
    </form>
  );
}