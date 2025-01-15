// src/pages/pricing.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import MainLayout from '@/components/layout/MainLayout';

const pricingPlans = [
  {
    name: 'Basic',
    price: '29',
    description: 'Perfect for small businesses',
    features: [
      'Up to 100 appointments/month',
      'Basic customization',
      'Email notifications',
      'Calendar integration',
    ],
  },
  {
    name: 'Pro',
    price: '79',
    description: 'For growing businesses',
    features: [
      'Unlimited appointments',
      'Advanced customization',
      'SMS notifications',
      'Custom domain',
      'Priority support',
    ],
    popular: true,
  },
  {
    name: 'Enterprise',
    price: '199',
    description: 'For large organizations',
    features: [
      'Everything in Pro',
      'Multiple locations',
      'API access',
      'Dedicated support',
      'Custom integrations',
    ],
  },
];

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <MainLayout>
      <div className="min-h-screen pt-20 pb-12 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
          <div className="text-center">
            <motion.h1 
              className="heading-1 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Simple, transparent pricing
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-600 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              Choose the perfect plan for your business
            </motion.p>
          </div>

          {/* Billing Period Toggle */}
          <div className="flex justify-center mt-8 mb-12">
            <div className="relative bg-gray-100 rounded-full p-1">
              <button
                className={`px-6 py-2 rounded-full transition-all ${
                  billingPeriod === 'monthly' ? 'bg-white shadow-md' : ''
                }`}
                onClick={() => setBillingPeriod('monthly')}
              >
                Monthly
              </button>
              <button
                className={`px-6 py-2 rounded-full transition-all ${
                  billingPeriod === 'yearly' ? 'bg-white shadow-md' : ''
                }`}
                onClick={() => setBillingPeriod('yearly')}
              >
                Yearly
                <span className="ml-1 text-sm text-green-500">Save 20%</span>
              </button>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`glass-panel rounded-2xl p-8 ${
                  plan.popular ? 'ring-2 ring-black' : ''
                }`}
              >
                {plan.popular && (
                  <span className="inline-block px-4 py-1 rounded-full text-sm font-medium bg-black text-white mb-4">
                    Most Popular
                  </span>
                )}
                <h3 className="text-2xl font-bold">{plan.name}</h3>
                <p className="text-gray-600 mt-2">{plan.description}</p>
                <div className="mt-4 mb-8">
                  <span className="text-4xl font-bold">€{
                    billingPeriod === 'yearly' 
                      ? (parseInt(plan.price) * 0.8).toString() 
                      : plan.price
                  }</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <svg
                        className="w-5 h-5 text-green-500 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className={`w-full ${
                  plan.popular ? 'button-primary' : 'button-secondary'
                }`}>
                  Get Started
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}