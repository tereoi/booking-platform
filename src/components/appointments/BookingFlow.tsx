// src/components/appointments/BookingFlow.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Business } from '@/types/business';
import Calendar from './Calendar';
import TimeSlotSelector from './TimeSlotSelector';

interface BookingFlowProps {
  business: Business;
  onComplete: () => void;
}

interface CustomField {
  id: string;
  label: string;
  value: string;
  type: 'text' | 'select' | 'checkbox';
  required: boolean;
  options?: string[];
}

export default function BookingFlow({ business, onComplete }: BookingFlowProps) {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    customFields: {} as Record<string, string>
  });

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      // Implementeer hier de logica voor het opslaan van de afspraak
      // Gebruik de NotificationService om meldingen te versturen
      onComplete();
    } catch (error) {
      console.error('Error creating appointment:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Steps */}
      <div className="flex justify-between mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`w-1/4 h-1 rounded-full ${
              step >= i ? 'bg-black' : 'bg-gray-200'
            }`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Step 1: Select Service */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h3 className="text-xl font-medium mb-4">Kies een service</h3>
            <div className="grid gap-4">
              {business.settings.services.map((service) => (
                <button
                  key={service.id}
                  onClick={() => {
                    setSelectedService(service.id);
                    setStep(2);
                  }}
                  className={`p-4 text-left rounded-lg transition-all ${
                    selectedService === service.id
                      ? 'bg-black text-white'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="font-medium">{service.name}</div>
                  <div className="text-sm mt-1">
                    €{service.price} • {service.duration} min
                  </div>
                  {service.description && (
                    <div className="text-sm mt-2 opacity-75">
                      {service.description}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 2: Select Date */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h3 className="text-xl font-medium mb-4">Kies een datum</h3>
            <Calendar
              selectedDate={selectedDate}
              onSelectDate={(date) => {
                setSelectedDate(date);
                setStep(3);
              }}
            />
            <button
              onClick={() => setStep(1)}
              className="mt-4 text-gray-600 hover:text-black"
            >
              ← Terug
            </button>
          </motion.div>
        )}

        {/* Step 3: Select Time */}
        {step === 3 && selectedDate && selectedService && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h3 className="text-xl font-medium mb-4">Kies een tijd</h3>
            <TimeSlotSelector
              date={selectedDate}
              serviceId={selectedService}
              selectedTime={selectedTime}
              onSelectTime={(time) => {
                setSelectedTime(time);
                setStep(4);
              }}
            />
            <button
              onClick={() => setStep(2)}
              className="mt-4 text-gray-600 hover:text-black"
            >
              ← Terug
            </button>
          </motion.div>
        )}

        {/* Step 4: Fill Form */}
        {step === 4 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <h3 className="text-xl font-medium mb-4">Vul je gegevens in</h3>
            
            {/* Required Fields */}
            {business.site.booking.requiredFields.name && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Naam
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => updateFormData('name', e.target.value)}
                  className="input-field mt-1"
                />
              </div>
            )}

{business.site.booking.requiredFields.email && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => updateFormData('email', e.target.value)}
                  className="input-field mt-1"
                />
              </div>
            )}

            {business.site.booking.requiredFields.phone && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Telefoonnummer
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => updateFormData('phone', e.target.value)}
                  className="input-field mt-1"
                />
              </div>
            )}

            {business.site.booking.requiredFields.message && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Bericht
                </label>
                <textarea
                  required
                  value={formData.message}
                  onChange={(e) => updateFormData('message', e.target.value)}
                  rows={3}
                  className="input-field mt-1"
                />
              </div>
            )}

            {/* Custom Fields */}
            {business.site.booking.customFields.map((field) => (
              <div key={field.id}>
                <label className="block text-sm font-medium text-gray-700">
                  {field.label}
                  {field.required && <span className="text-red-500">*</span>}
                </label>
                {field.type === 'text' && (
                  <input
                    type="text"
                    required={field.required}
                    value={formData.customFields[field.id] || ''}
                    onChange={(e) => {
                      setFormData(prev => ({
                        ...prev,
                        customFields: {
                          ...prev.customFields,
                          [field.id]: e.target.value
                        }
                      }));
                    }}
                    className="input-field mt-1"
                  />
                )}
                {field.type === 'select' && field.options && (
                  <select
                    required={field.required}
                    value={formData.customFields[field.id] || ''}
                    onChange={(e) => {
                      setFormData(prev => ({
                        ...prev,
                        customFields: {
                          ...prev.customFields,
                          [field.id]: e.target.value
                        }
                      }));
                    }}
                    className="input-field mt-1"
                  >
                    <option value="">Selecteer...</option>
                    {field.options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                )}
                {field.type === 'checkbox' && (
                  <label className="flex items-center mt-1 space-x-2">
                    <input
                      type="checkbox"
                      required={field.required}
                      checked={formData.customFields[field.id] === 'true'}
                      onChange={(e) => {
                        setFormData(prev => ({
                          ...prev,
                          customFields: {
                            ...prev.customFields,
                            [field.id]: e.target.checked.toString()
                          }
                        }));
                      }}
                      className="rounded text-black focus:ring-black"
                    />
                    <span className="text-sm text-gray-700">{field.label}</span>
                  </label>
                )}
              </div>
            ))}

            {/* Summary */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Samenvatting</h4>
              <div className="space-y-2 text-sm">
                {selectedService && (
                  <div className="flex justify-between">
                    <span>Service:</span>
                    <span className="font-medium">
                      {business.settings.services.find(s => s.id === selectedService)?.name}
                    </span>
                  </div>
                )}
                {selectedDate && (
                  <div className="flex justify-between">
                    <span>Datum:</span>
                    <span className="font-medium">
                      {selectedDate.toLocaleDateString()}
                    </span>
                  </div>
                )}
                {selectedTime && (
                  <div className="flex justify-between">
                    <span>Tijd:</span>
                    <span className="font-medium">{selectedTime}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex space-x-4 pt-4">
              <button
                onClick={() => setStep(3)}
                className="button-secondary"
              >
                ← Terug
              </button>
              <button
                onClick={handleSubmit}
                className="button-primary flex-grow"
              >
                Bevestig afspraak
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
