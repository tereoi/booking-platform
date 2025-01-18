// src/components/settings/ServicesSettings.tsx
import { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

interface Service {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
}

export default function ServicesSettings() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const docRef = doc(db, 'businesses', user.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists() && docSnap.data().services) {
          setServices(docSnap.data().services);
        }
      } catch (error) {
        console.error('Error fetching services:', error);
        toast.error('Kon diensten niet laden');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const addService = () => {
    const newService: Service = {
      id: Date.now().toString(),
      name: '',
      description: '',
      duration: 30,
      price: 0
    };
    setServices([...services, newService]);
  };

  const removeService = (id: string) => {
    setServices(services.filter(service => service.id !== id));
  };

  const updateService = (id: string, field: keyof Service, value: string | number) => {
    setServices(services.map(service => {
      if (service.id === id) {
        return { ...service, [field]: value };
      }
      return service;
    }));
  };

  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user) return;

    setSaving(true);
    try {
      await updateDoc(doc(db, 'businesses', user.uid), {
        services: services
      });
      toast.success('Diensten opgeslagen!');
    } catch (error) {
      console.error('Error saving services:', error);
      toast.error('Kon diensten niet opslaan');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div>Laden...</div>;
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Diensten</h3>
        <button
          onClick={addService}
          className="button-secondary flex items-center space-x-2"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Nieuwe Dienst</span>
        </button>
      </div>

      <AnimatePresence>
        {services.map((service) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="bg-white p-4 rounded-lg shadow-sm space-y-4"
          >
            <div className="flex justify-between">
              <div className="w-full space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Naam
                    </label>
                    <input
                      type="text"
                      value={service.name}
                      onChange={(e) => updateService(service.id, 'name', e.target.value)}
                      className="input-field mt-1"
                      placeholder="Naam van de dienst"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Prijs
                    </label>
                    <div className="relative mt-1">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500">€</span>
                      </div>
                      <input
                        type="number"
                        value={service.price}
                        onChange={(e) => updateService(service.id, 'price', parseFloat(e.target.value))}
                        className="input-field pl-7"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Beschrijving
                  </label>
                  <input
                    type="text"
                    value={service.description}
                    onChange={(e) => updateService(service.id, 'description', e.target.value)}
                    className="input-field mt-1"
                    placeholder="Korte beschrijving van de dienst"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Duur (minuten)
                  </label>
                  <select
                    value={service.duration}
                    onChange={(e) => updateService(service.id, 'duration', parseInt(e.target.value))}
                    className="input-field mt-1"
                  >
                    <option value={15}>15 minuten</option>
                    <option value={30}>30 minuten</option>
                    <option value={45}>45 minuten</option>
                    <option value={60}>1 uur</option>
                    <option value={90}>1,5 uur</option>
                    <option value={120}>2 uur</option>
                  </select>
                </div>
              </div>

              <button
                onClick={() => removeService(service.id)}
                className="ml-4 p-2 text-gray-400 hover:text-red-500"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {services.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          Nog geen diensten toegevoegd. Klik op "Nieuwe Dienst" om te beginnen.
        </div>
      )}

      <div className="pt-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="button-primary"
        >
          {saving ? 'Opslaan...' : 'Opslaan'}
        </button>
      </div>
    </div>
  );
}