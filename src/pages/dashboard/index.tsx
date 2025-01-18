// src/pages/dashboard/index.tsx
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { auth, db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import type { Appointment } from '@/types';
import { 
  CalendarDaysIcon, 
  UsersIcon, 
  CurrencyEuroIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: any; // We gebruiken 'any' hier omdat de HeroIcons types complex zijn
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-xl p-6 shadow-sm"
  >
    <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center mb-4`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <h3 className="text-gray-500 text-sm">{title}</h3>
    <p className="text-2xl font-bold mt-1">{value}</p>
  </motion.div>
);

const statCards = [
  {
    title: "Afspraken Vandaag",
    value: 0,
    icon: CalendarDaysIcon,
    color: "bg-blue-500"
  },
  {
    title: "Afspraken deze Maand",
    value: 0,
    icon: ChartBarIcon,
    color: "bg-green-500"
  },
  {
    title: "Totaal Klanten",
    value: 0,
    icon: UsersIcon,
    color: "bg-purple-500"
  },
  {
    title: "Omzet deze Maand",
    value: "€0",
    icon: CurrencyEuroIcon,
    color: "bg-gray-700"
  }
];

export default function DashboardPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [stats, setStats] = useState({
    todayAppointments: 0,
    monthlyAppointments: 0,
    totalCustomers: 0,
    revenue: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      // Fetch vandaag's afspraken
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const appointmentsRef = collection(db, 'businesses', user.uid, 'appointments');
      const q = query(appointmentsRef, where('date', '>=', today));

      try {
        const querySnapshot = await getDocs(q);
        const appointmentsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Appointment[];
        
        setAppointments(appointmentsData);

        // Update statistieken
        setStats({
          todayAppointments: appointmentsData.length,
          monthlyAppointments: 45, // Voorbeeld data
          totalCustomers: 128, // Voorbeeld data
          revenue: 2850 // Voorbeeld data
        });
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    fetchData();
  }, []);

  // Update de statCards met actuele data
  const updatedStatCards = [
    { ...statCards[0], value: stats.todayAppointments },
    { ...statCards[1], value: stats.monthlyAppointments },
    { ...statCards[2], value: stats.totalCustomers },
    { ...statCards[3], value: `€${stats.revenue}` }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welkom sectie */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          <h2 className="text-2xl font-bold">Goedemorgen!</h2>
          <p className="text-gray-600 mt-1">
            Hier is een overzicht van je afspraken en statistieken.
          </p>
        </motion.div>

        {/* Statistieken Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {updatedStatCards.map((stat, index) => (
            <StatCard
              key={index}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              color={stat.color}
            />
          ))}
        </div>

        {/* Vandaag's Afspraken */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold">Vandaag's Afspraken</h3>
          </div>
          <div className="divide-y">
            {appointments.length > 0 ? (
              appointments.map((appointment) => (
                <div 
                  key={appointment.id}
                  className="flex items-center justify-between p-4 hover:bg-gray-50"
                >
                  <div>
                    <p className="font-medium">{appointment.customerName}</p>
                    <p className="text-sm text-gray-500">{appointment.time}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    appointment.status === 'confirmed' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {appointment.status}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 p-6">Geen afspraken voor vandaag.</p>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}