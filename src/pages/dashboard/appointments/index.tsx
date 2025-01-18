// src/pages/dashboard/appointments/index.tsx
import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Calendar from '@/components/appointments/Calendar';
import TimeSlotSelector from '@/components/appointments/TimeSlotSelector';
import AppointmentForm from '@/components/appointments/AppointmentForm';
import AppointmentCard from '@/components/appointments/AppointmentCard';
import { motion } from 'framer-motion';
import { auth, db } from '@/lib/firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { PlusIcon } from '@heroicons/react/24/outline';
import type { Appointment } from '@/types';

export default function AppointmentsPage() {
  const [view, setView] = useState<'list' | 'create'>('list');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [services, setServices] = useState<any[]>([]);

  const fetchAppointments = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      // Fetch services first
      const businessDoc = await getDoc(doc(db, 'businesses', user.uid));
      if (businessDoc.exists()) {
        setServices(businessDoc.data().services || []);
      }

      // Fetch appointments
      const appointmentsRef = collection(db, 'businesses', user.uid, 'appointments');
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const q = query(appointmentsRef, where('date', '>=', today.toISOString().split('T')[0]));
      const querySnapshot = await getDocs(q);
      
      const appointmentsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Appointment[];

      // Sort appointments by date and time
      appointmentsData.sort((a, b) => {
        const dateCompare = a.date.localeCompare(b.date);
        if (dateCompare !== 0) return dateCompare;
        return a.time.localeCompare(b.time);
      });

      setAppointments(appointmentsData);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const groupAppointmentsByDate = () => {
    const grouped = appointments.reduce((acc, appointment) => {
      if (!acc[appointment.date]) {
        acc[appointment.date] = [];
      }
      acc[appointment.date].push(appointment);
      return acc;
    }, {} as { [key: string]: Appointment[] });

    return Object.entries(grouped);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header met Toggle */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Afspraken</h1>
          <button
            onClick={() => setView(view === 'list' ? 'create' : 'list')}
            className="button-primary flex items-center space-x-2"
          >
            {view === 'list' ? (
              <>
                <PlusIcon className="w-5 h-5" />
                <span>Nieuwe Afspraak</span>
              </>
            ) : (
              <span>Terug naar Overzicht</span>
            )}
          </button>
        </div>

        {view === 'list' ? (
          <div className="bg-white rounded-xl shadow-sm p-6">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : appointments.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Geen afspraken gevonden</p>
              </div>
            ) : (
              <div className="space-y-8">
                {groupAppointmentsByDate().map(([date, dateAppointments]) => (
                  <div key={date}>
                    <h3 className="text-lg font-semibold mb-4">
                      {new Date(date).toLocaleDateString('nl-NL', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long'
                      })}
                    </h3>
                    <div className="space-y-4">
                      {dateAppointments.map((appointment) => (
                        <AppointmentCard
                          key={appointment.id}
                          appointment={appointment}
                          onUpdate={fetchAppointments}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm p-6"
              >
                <h2 className="text-xl font-bold mb-6">Nieuwe Afspraak</h2>
                
                {/* Service Selectie */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-3">Kies een dienst</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {services.map((service) => (
                      <motion.button
                        key={service.id}
                        onClick={() => setSelectedService(service)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`p-4 rounded-lg text-left transition-all ${
                          selectedService?.id === service.id
                            ? 'bg-black text-white'
                            : 'bg-gray-50 hover:bg-gray-100'
                        }`}
                      >
                        <div className="font-medium">{service.name}</div>
                        <div className="text-sm mt-1">
                          €{service.price} • {service.duration} min
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Kalender */}
                {selectedService && (
                  <Calendar
                    selectedDate={selectedDate}
                    onSelectDate={setSelectedDate}
                  />
                )}
              </motion.div>
              
              {/* Tijdslots */}
              {selectedDate && selectedService && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-6 bg-white rounded-xl shadow-sm p-6"
                >
                  <h3 className="text-lg font-semibold mb-4">
                    Beschikbare tijden voor {selectedDate.toLocaleDateString()}
                  </h3>
                  <TimeSlotSelector
                    date={selectedDate}
                    selectedTime={selectedTime}
                    serviceId={selectedService.id}
                    onSelectTime={setSelectedTime}
                  />
                </motion.div>
              )}
            </div>

            {/* Form */}
            <div>
              {selectedDate && selectedTime && selectedService ? (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-xl shadow-sm p-6"
                >
                  <AppointmentForm
                    date={selectedDate}
                    time={selectedTime}
                    service={selectedService}
                    onSubmit={() => {
                      setView('list');
                      fetchAppointments();
                    }}
                  />
                </motion.div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <p className="text-gray-500 text-center">
                    Selecteer een dienst, datum en tijd om een afspraak te maken
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}