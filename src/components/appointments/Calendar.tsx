// src/components/appointments/Calendar.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface WorkingHours {
  [key: string]: {
    isOpen: boolean;
    start: string;
    end: string;
  };
}

interface CalendarProps {
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
  workingHours?: WorkingHours;
}

const DAYS = ['Zo', 'Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za'];
const DAY_NAMES = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

export default function Calendar({ 
  selectedDate, 
  onSelectDate, 
  workingHours 
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const isDateAvailable = (date: Date): boolean => {
    // Verleden datum check
    if (date < today) return false;

    // Werkuren check
    if (workingHours) {
      const dayName = DAY_NAMES[date.getDay()];
      const daySchedule = workingHours[dayName];
      return daySchedule?.isOpen || false;
    }

    return true;
  };

  const previousMonth = () => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1);
    // Sta alleen navigatie naar huidige of toekomstige maanden toe
    if (newDate.getMonth() >= today.getMonth() || 
        newDate.getFullYear() > today.getFullYear()) {
      setCurrentMonth(newDate);
    }
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  // Calendar grid genereren
  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDayOfMonth = getFirstDayOfMonth(currentMonth);
  const days = [];

  // Lege dagen voor begin van de maand
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="h-12" />);
  }

  // Dagen van de maand
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const isSelected = selectedDate?.toDateString() === date.toDateString();
    const isToday = today.toDateString() === date.toDateString();
    const available = isDateAvailable(date);

    days.push(
      <motion.button
        key={day}
        whileHover={available ? { scale: 1.05 } : {}}
        whileTap={available ? { scale: 0.95 } : {}}
        onClick={() => available && onSelectDate(date)}
        disabled={!available}
        className={`
          h-12 rounded-lg font-medium transition-colors relative
          ${isSelected ? 'bg-black text-white' : ''}
          ${isToday ? 'ring-2 ring-black' : ''}
          ${available 
            ? 'hover:bg-gray-100' 
            : 'opacity-50 cursor-not-allowed bg-gray-100'
          }
        `}
      >
        {day}
      </motion.button>
    );
  }

  return (
    <div>
      {/* Header met maand en navigatie */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">
          {currentMonth.toLocaleString('nl-NL', { month: 'long', year: 'numeric' })}
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={previousMonth}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Weekdagen */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {DAYS.map(day => (
          <div key={day} className="h-8 flex items-center justify-center text-sm text-gray-500">
            {day}
          </div>
        ))}
      </div>

      {/* Kalenderdagen */}
      <div className="grid grid-cols-7 gap-2">
        {days}
      </div>
    </div>
  );
}