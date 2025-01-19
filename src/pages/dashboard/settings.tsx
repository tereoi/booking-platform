// src/pages/dashboard/settings.tsx
import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import WorkingHoursSettings from '@/components/settings/WorkingHoursSettings';
import ServicesSettings from '@/components/settings/ServicesSettings';
import NotificationSettings from '@/components/settings/NotificationSettings';
import BusinessSettings from '@/components/settings/BusinessSettings';
import { motion } from 'framer-motion';

type SettingsTab = 'business' | 'hours' | 'services' | 'notifications';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('business');

  const tabs = [
    { id: 'business', label: 'Bedrijfsgegevens' },
    { id: 'hours', label: 'Werktijden' },
    { id: 'services', label: 'Diensten' },
    { id: 'notifications', label: 'Notificaties' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          <h2 className="text-2xl font-bold mb-6">Instellingen</h2>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as SettingsTab)}
                  className={`
                    py-4 px-1 inline-flex items-center border-b-2 font-medium text-sm
                    ${activeTab === tab.id
                      ? 'border-black text-black'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="mt-6">
            {activeTab === 'business' && <BusinessSettings />}
            {activeTab === 'hours' && <WorkingHoursSettings />}
            {activeTab === 'services' && <ServicesSettings />}
            {activeTab === 'notifications' && <NotificationSettings />}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}