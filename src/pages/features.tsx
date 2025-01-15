import { motion } from 'framer-motion';
import MainLayout from '@/components/layout/MainLayout';

const features = [
  {
    title: 'Smart Scheduling',
    description: 'Our intelligent booking system adapts to your business needs and automatically optimizes your calendar.',
    icon: '📅',
  },
  {
    title: 'Client Management',
    description: 'Keep track of your clients, their preferences, and booking history all in one place.',
    icon: '👥',
  },
  {
    title: 'Automated Notifications',
    description: 'Reduce no-shows with automated email and SMS reminders for your clients.',
    icon: '📱',
  },
  {
    title: 'Custom Branding',
    description: 'Make your booking page match your brand with custom colors, logos, and domain.',
    icon: '🎨',
  },
  {
    title: 'Analytics & Insights',
    description: 'Get valuable insights into your business performance with detailed analytics.',
    icon: '📊',
  },
  {
    title: 'Integration Ready',
    description: 'Connect with your favorite tools including Google Calendar, iCal, and more.',
    icon: '🔄',
  },
];

export default function FeaturesPage() {
  return (
    <MainLayout>
      <div className="min-h-screen pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="heading-1 mb-4">
              Everything you need to grow
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features to help you manage appointments, clients, and your entire business
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-panel rounded-2xl p-6"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}