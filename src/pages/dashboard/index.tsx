// src/pages/dashboard/index.tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import {
  CalendarDaysIcon,
  UserGroupIcon,
  ChartBarIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';

export default function Dashboard() {
  const router = useRouter();
  const [businessData, setBusinessData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const user = auth.currentUser;
      
      if (!user) {
        router.push('/login');
        return;
      }

      if (!user.emailVerified) {
        router.push('/verify-email');
        return;
      }

      try {
        const businessDoc = await getDoc(doc(db, 'businesses', user.uid));
        if (businessDoc.exists()) {
          setBusinessData(businessDoc.data());
        }
      } catch (error) {
        console.error('Error fetching business data:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const quickActions = [
    {
      title: 'Nieuwe Afspraak',
      icon: CalendarDaysIcon,
      color: 'bg-blue-500',
      onClick: () => router.push('/dashboard/appointments/new')
    },
    {
      title: 'Klanten',
      icon: UserGroupIcon,
      color: 'bg-green-500',
      onClick: () => router.push('/dashboard/customers')
    },
    {
      title: 'Statistieken',
      icon: ChartBarIcon,
      color: 'bg-purple-500',
      onClick: () => router.push('/dashboard/statistics')
    },
    {
      title: 'Instellingen',
      icon: Cog6ToothIcon,
      color: 'bg-gray-500',
      onClick: () => router.push('/dashboard/settings')
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-bold">Dashboard</h1>
            <button
              onClick={() => auth.signOut()}
              className="text-gray-600 hover:text-gray-900"
            >
              Uitloggen
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel rounded-2xl p-6 mb-8"
        >
          <h2 className="text-2xl font-bold mb-2">
            Welkom terug, {businessData?.businessName}
          </h2>
          <p className="text-gray-600">
            Hier is een overzicht van je afspraken en activiteiten.
          </p>
        </motion.div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={action.onClick}
              className="glass-panel rounded-xl p-4 cursor-pointer hover:shadow-lg transition-all"
            >
              <div className={`${action.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                <action.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold">{action.title}</h3>
            </motion.div>
          ))}
        </div>

        {/* Today's Appointments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-panel rounded-2xl p-6"
        >
          <h3 className="text-xl font-bold mb-4">Vandaag</h3>
          <div className="text-gray-600">
            Nog geen afspraken voor vandaag.
          </div>
        </motion.div>
      </main>
    </div>
  );
}